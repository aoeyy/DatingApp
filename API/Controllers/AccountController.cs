using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseAPIController
    {
        private readonly DataContext _context;
        public readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")] //used to add a new resource through the http endpoint
        //async because we are doing something with our database
        //Returning AppUser
        //cals the method Register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken"); //a 400 statement

            //provides us with our hashing algorithm for our password hash
            //"using" ensures that when we're done with the class HMACSHA512, it is disposed of correctly. calls the method dispose to dispose of it
            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            //tells entity framework that we want to add this to the users table. this doesn't actually add anything to th table, it just tracks it in the entity framework
            _context.Users.Add(user);

            //calls our database and saves it to the table
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Invalid username");

            //calculate the computed hash of their password using the password salt
            using var hmac = new HMACSHA512(user.PasswordSalt);

            //if the loginDto.Password is the same as the original with the passwordsalt, then they should be identical and can login so we return the user obj
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            //since it's a byte array, we need to loop over each element in the array
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        //checks if the username exists
        private async Task<bool> UserExists(string username)
        {
            //convert to lower so we are comparing like to like
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}