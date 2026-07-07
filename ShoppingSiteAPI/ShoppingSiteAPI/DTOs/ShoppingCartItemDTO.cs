using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShoppingSiteAPI.DTOs
{
    public class ShoppingCartItemDto
    {
        [Key]
        public int ShoppingCartItemId { get; set; }

        [ForeignKey("for_ShoppingCartId")]
        public int? ShoppingCartId { get; set; }       //nullable but only for implementation purposes, not practical

        [ForeignKey("for_ProductId")]
        public int? ProductId { get; set; }       //nullable but only for implementation purposes, not practical
        public int Quantity { get; set; }
    }
}
