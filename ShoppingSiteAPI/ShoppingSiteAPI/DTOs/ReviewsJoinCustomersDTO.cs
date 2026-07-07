using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShoppingSiteAPI.DTOs
{
    public class ReviewsJoinCustomersDto
    {
        [Key]
        public int ReviewId { get; set; }

        [ForeignKey("for_ProductId")]
        public int? ProductId { get; set; }       //nullable but only for implementation purposes, not practical

        [ForeignKey("for_ProductName")]
        public string ProductName { get; set; } = string.Empty;

        [ForeignKey("for_CustomerId")]
        public int? CustomerId { get; set; }       //nullable but only for implementation purposes, not practical

        [ForeignKey("for_CustomerFirstName")]
        public string CustomerFirstName { get; set; } = string.Empty;

        [ForeignKey("for_CustomerLastName")]
        public string CustomerLastName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }    //someone can leave a rating but does not have to comment on it
        public DateTime CreatedAt { get; set; }
    }
}
