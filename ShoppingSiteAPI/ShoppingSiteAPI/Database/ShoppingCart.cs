using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoppingSiteAPI.Database
{
    public class ShoppingCart
    {
        [Key]
        public int ShoppingCartId { get; set; }

        [ForeignKey("for_CustomerId")]
        public int? CustomerId { get; set; }       //nullable but only for implementation purposes, not practical
        public DateTime CreatedAt { get; set; }
    }
}
