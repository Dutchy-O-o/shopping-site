namespace ShoppingSiteAPI.DTOs
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Price { get; set; }
        public int? StockQuantity { get; set; }
        public int CategoryId { get; set; }
        //public byte[]? ImageURL { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string? alt_url { get; set; } = string.Empty;
    }
}
