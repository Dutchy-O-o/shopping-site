using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoppingSiteAPI.Database
{
    public class OrderedItem
    {
        [ForeignKey("for_ProductId")]
        public int ProductId { get; set; }

        [ForeignKey("for_OrderId")]
        public int? OrderId { get; set; }       //nullable but only for implementation purposes, not practical
        public int Quantity { get; set; }
    //  public decimal UnitPrice { get; set; }
    }
}
