using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;
using ShoppingSiteAPI.Database;
using ShoppingSiteAPI.DTOs;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ProductController> _logger;

    public ProductController(AppDbContext context, ILogger<ProductController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("get-products")]
    public async Task<List<Product>> Get()
    {
        return await _context.Products.ToListAsync();   //Returns all payments as a list
    }

    [HttpGet("get-product-by-id")]
    public async Task<Product> GetById(int Id)
    {
        return await _context.Products.FirstOrDefaultAsync(x => x.ProductId == Id);    //Searches for the product with the corresponding Id
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("add-product")]
    public async Task<IActionResult> AddProduct([FromBody] Product product)
    {
        if (product == null)
        {
            return BadRequest("Product data is null");
        }

        _context.Products.Add(product); // Adds the new product to the Orders table
        await _context.SaveChangesAsync();  // Saves the changes to the database
        return Ok(product); // Returns the added product as a response
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("remove-product-by-id")]
    public async Task<IActionResult> RemoveProduct([FromQuery] int Id)  // VERY IMPORTANT TO MAKE THIS "FromQuery" AND NOT "FromBody" OTHERWISE DELETE WITH ID IS VERY IMPRACTICAL
    {
        var product = await _context.Products.FindAsync(Id);

        if (product != null)
        {
            _context.Products.Remove(product);  // Removes the payment from the database
            await _context.SaveChangesAsync();  // Save the changes to the database
            return Ok(product);  // Return the payment item as a response
        }
        else
        {
            return BadRequest("Product data is null");
        }
    }

    /*
    // GET: api/products/{id}/image
    [HttpGet("{id}/image")]
    public async Task<IActionResult> GetProductImage(int id)
    {
        var product = await _context.Products
            .Where(p => p.ProductId == id)
            .Select(p => p.ImageURL) // Assuming ImageURL is the BYTEA field
            .FirstOrDefaultAsync();

        if (product == null)        
        {
            return NotFound();
        }

        // Return the binary data as a file response
        return File(product, "image/jpg");
    }

    [HttpGet("images")]
    public async Task<IActionResult> GetAllProductImages()
    {
        var products = await _context.Products
            .Select(p => new { p.ProductId, p.ImageURL }) // Include necessary fields
            .ToListAsync();

        return Ok(products); // Return a list of product IDs and image URLs
    }
    */

    [HttpGet("select-all-products-via-function")]
    public async Task<ActionResult<List<ProductDto>>> SelectAllProductsThroughFunction()
    {
        var result = await _context.ProductDtos
            .FromSqlRaw("SELECT * FROM select_all_products()")
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("get-product-by-function/{id}")]
    public async Task<IActionResult> GetProductByFunction(int id)
    {
        try
        {
            // Execute the SQL function and map the results to ProductDto
            var products = await _context.Set<ProductDto>()
                .FromSqlRaw("SELECT * FROM select_product({0})", id)
                .AsNoTracking()
                .ToListAsync();

            if (!products.Any())
            {
                return NotFound($"Product with ID {id} not found.");
            }

            return Ok(products.First());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching product {ProductId} via function.", id);
            return StatusCode(500, "An error occurred while fetching the product.");
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("procedure-add-product")]
    public async Task<IActionResult> ProcedureAddProduct(int ProductId)
    {
        try
        {
            // Use ExecuteSqlInterpolated to safely pass parameters and call the stored procedure
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL insert_product({ProductId})");

            return Ok(new { Message = "Product successfully added." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding product {ProductId} via procedure.", ProductId);
            return BadRequest(new { Message = "An error occurred while adding the product." });
        }
    }

    [HttpGet("select-products-by-gender-and-categories")]
    public async Task<ActionResult<List<ProductDto>>> SelectProductsByGenderAndCategories([FromQuery] string? gender, [FromQuery] List<int>? categoryIds)
    {
        var categoryArray = "{" + string.Join(",", categoryIds) + "}";

        if ((categoryIds == null || !categoryIds.Any()) && string.IsNullOrEmpty(gender))
        {
            var result_without_preferences = await _context.ProductDtos
            .FromSqlRaw("SELECT * FROM select_all_products()")
            .ToListAsync();

            return Ok(result_without_preferences);
        }
        else
        if (categoryIds == null || !categoryIds.Any())
        {
            var result_only_gender = await _context.ProductDtos
            .FromSqlRaw(
                "SELECT * FROM select_products_by_gender({0})",
                gender
            )
            .ToListAsync();

            return Ok(result_only_gender);
        }
        else
        if (string.IsNullOrEmpty(gender))
        {
            var result_only_category = await _context.ProductDtos
                .FromSqlRaw(
                    "SELECT * FROM select_products_by_categories({0}::integer[])",
                    categoryArray
                )
                .ToListAsync();

            return Ok(result_only_category);
        }

        var result = await _context.ProductDtos
            .FromSqlRaw(
                "SELECT * FROM select_products_by_gender_and_categories({0}, {1}::integer[])",
                gender,
                categoryArray
            )
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("UltimateSelect")]
    public async Task<ActionResult<List<ProductsJoinCategoriesDto>>> UltimateSelect([FromQuery] string? gender, [FromQuery] List<int>? categoryIds, [FromQuery] string? search,
        [FromQuery] string? order)
    {
        var categoryArray = categoryIds != null && categoryIds.Any() ? "{" + string.Join(",", categoryIds) + "}" : null;

        var result = await _context.ProductsJoinCategoriesDtos
            .FromSqlRaw("SELECT * FROM ultimate_select({0}, {1}::integer[], {2}, {3})", gender, categoryArray, search, order).ToListAsync();

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("update-product-via-function")]
    public async Task<ActionResult<List<ProductsJoinCategoriesDto>>> UpdateProduct([FromQuery] int ProductId, [FromQuery] string? ProductName, [FromQuery] string? Description,
        [FromQuery] int? Price, [FromQuery] int? StockQuantity, [FromQuery] int? CategoryId, [FromQuery] string? Gender, [FromQuery] string? alt_url)
    {
        await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL update_product({ProductId}, {ProductName}, {Description}, {Price}, {StockQuantity}, {CategoryId}, {Gender}, {alt_url})");

        return Ok(new { Message = "Product successfully updated." });
    }
}
