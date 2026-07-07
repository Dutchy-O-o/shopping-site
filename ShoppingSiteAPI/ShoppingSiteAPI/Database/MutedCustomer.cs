using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoppingSiteAPI.Database
{
    public class MutedCustomer
    {
        [Key]
        [ForeignKey("for_CustomerId")]
        public int CustomerId { get; set; }
        public string WhyMutedDescription { get; set; } = string.Empty;     //the reason this person got muted
        public DateTime CreatedAt { get; set; }
    }
}
