using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShoppingSiteAPI.DTOs
{
    public class ShoppingCartItemsJoinShoppingCartsJoinProductsDto
    {
        [Key]
        public int ShoppingCartItemId { get; set; }

        [ForeignKey("for_ShoppingCartId")]
        public int? ShoppingCartId { get; set; }       //nullable but only for implementation purposes, not practical

        [ForeignKey("for_CustomerId")]
        public int? CustomerId { get; set; }    //nullable but only for implementation purposes, not practical

        [ForeignKey("for_ProductId")]
        public int? ProductId { get; set; }       //nullable but only for implementation purposes, not practical
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int Price { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string alt_url { get; set; } = string.Empty;
    }
}
