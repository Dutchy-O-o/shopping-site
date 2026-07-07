using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;
using ShoppingSiteAPI.Database;
using ShoppingSiteAPI.DTOs;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class ReviewController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("select-all-reviews_join_customers-via-function")]
    public async Task<ActionResult<List<ReviewsJoinCustomersDto>>> SelectAllReviewsJoinCustomersThroughFunction()
    {
        var result = await _context.ReviewsJoinCustomersDtos
            .FromSqlRaw("SELECT * FROM select_reviews_join_customers()")
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("select-review-from-customer-via-function")]
    public async Task<ActionResult<List<ReviewsJoinCustomersDto>>> SelectReviewFromCustomerThroughFunction([FromQuery] int CustomerId)
    {
        var result = await _context.ReviewsJoinCustomersDtos
            .FromSqlRaw("SELECT * FROM select_review_from_customer_id({0})", CustomerId)
            .ToListAsync();

        return Ok(result);
    }

    [HttpPost("procedure-add-review")]
    public async Task<IActionResult> ProcedureAddReview(int ProductId, int CustomerId, int Rating, string Comment)
    {
        try
        {
            var existingReview = await _context.ReviewsJoinCustomersDtos
            .FromSqlRaw("SELECT * FROM select_reviews_join_customers()")
            .Where(r => r.ProductId == ProductId && r.CustomerId == CustomerId)
            .FirstOrDefaultAsync();

            if (existingReview != null)
            {
                return BadRequest(new { Message = "You have already written a review for this product." });
            }

            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL insert_review({ProductId}, {CustomerId}, {Rating}, {Comment})");

            return Ok(new { Message = "Review successfully added." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }

    [HttpPost("delete-review-via-procedure-with-customer_id-and-product_id")]
    public async Task<IActionResult> DeleteReviewWithCustomerId(int CustomerId, int ProductId)
    {
        try
        {
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL delete_review_by_customer({CustomerId}, {ProductId})");

            return Ok(new { Message = "Review successfully deleted." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }
}
