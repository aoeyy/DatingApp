using System.Text.Json;
using API.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, 
            int itemsPerPage, int totalItems, int totalPages)
        {
            //the parameters in the brackets need to be the in the right order
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            //Pagination and Access-Control-Expose-Header need to be spelled exactly like this
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader, options));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        } 
    }
} 