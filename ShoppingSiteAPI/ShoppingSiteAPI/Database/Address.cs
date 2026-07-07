using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoppingSiteAPI.Database
{
    public class Address
    {
        [Key]
        public int AddressId { get; set; }

        [ForeignKey("for_CustomerId")]
        public int? CustomerId { get; set; }       //nullable but only for implementation purposes, not practical
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string? PostalCode { get; set; }     //postal code not required (because it always annoys me irl)        //varchar 20 length
        public string Country { get; set; } = string.Empty;
    }
}
