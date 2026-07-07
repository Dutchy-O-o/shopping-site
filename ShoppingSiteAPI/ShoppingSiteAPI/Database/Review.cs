using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoppingSiteAPI.Database
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }

        [ForeignKey("for_ProductId")]
        public int? ProductId { get; set; }       //nullable but only for implementation purposes, not practical

        [ForeignKey("for_CustomerId")]
        public int? CustomerId { get; set; }       //nullable but only for implementation purposes, not practical
        public int Rating { get; set; }
        public string? Comment { get; set; }    //someone can leave a rating but does not have to comment on it
        public DateTime CreatedAt { get; set; }
    }
}
