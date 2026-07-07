using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShoppingSiteAPI.DTOs
{
    public class MutedCustomersJoinCustomersDTO
    {
        [Key]
        [ForeignKey("for_CustomerId")]
        public int CustomerId { get; set; }
        public string CustomerFirstName { get; set; } = string.Empty;
        public string CustomerLastName { get; set; } = string.Empty;
        public string WhyMutedDescription { get; set; } = string.Empty;     //the reason this person got muted
    }
}
