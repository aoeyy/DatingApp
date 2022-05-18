using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

//an interface is a contract between itself and any class that implements it
//this contract states that any class that implements this interface will implement the interface's properties, methods and/or events
//an interface doesn't contain any implementation logic
//it only contains the signatures of functionality the interface provides
//the functionality that this interface has a single method signature
//testing is the main reason for creating interfaces

namespace API.Interfaces
{
    //ITokenService starts with an I because it's an interface
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}