using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShoppingSiteAPI.DTOs
{
    public class ShoppingCartDto
    {
        [Key]
        public int ShoppingCartId { get; set; }

        [ForeignKey("for_CustomerId")]
        public int? CustomerId { get; set; }       //nullable but only for implementation purposes, not practical
        public DateTime CreatedAt { get; set; }
    }
}
