using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;

namespace ShoppingSiteAPI.Database
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int? StockQuantity { get; set; }       //nullable but only for implementation purposes, not practical

        [ForeignKey("for_CategoryId")]
        public int? CategoryId { get; set; }       //nullable but only for implementation purposes, not practical
        public byte[]? ImageURL { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Gender { get; set; } = string.Empty; //male, female, unisex
        public string? alt_url { get; set; } = string.Empty;
    }
}
