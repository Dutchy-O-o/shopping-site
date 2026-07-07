using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoppingSiteAPI.Database
{
    public class OrdersJoinOrderedItemsJoinProductsDto
    {
        [Key]
        public int OrderId { get; set; }

        [ForeignKey("for_ProductId")]
        public int? ProductId { get; set; }

        [ForeignKey("for_ProductName")]
        public string ProductName { get; set; } = string.Empty;

        [ForeignKey("for_Gender")]
        public string Gender { get; set; } = string.Empty;

        [ForeignKey("for_Quantity")]
        public int? Quantity { get; set; }

        [ForeignKey("for_Price")]
        public int? Price { get; set; }

        [ForeignKey("for_CustomerId")]
        public int? CustomerId { get; set; }       //nullable but only for implementation purposes, not practical
        public DateTime OrderDate { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
    }
}
