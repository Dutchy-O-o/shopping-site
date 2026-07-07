using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;

using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ShoppingSiteAPI.Database;
using ShoppingSiteAPI.DTOs;

[Route("api/[controller]")]
[ApiController]
public class MutedCustomerController : ControllerBase
{
    private readonly AppDbContext _context;

    public MutedCustomerController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("select_all_muted_customers-via-function")]
    public async Task<ActionResult<List<MutedCustomersJoinCustomersDTO>>> SelectMutedCustomers()
    {
        var result = await _context.MutedCustomersJoinCustomersDtos
            .FromSqlRaw("SELECT * FROM select_all_muted_customers()")
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("select_muted_customers_with_customer_id-via-function")]
    public async Task<ActionResult<List<MutedCustomersJoinCustomersDTO>>> SelectMutedCustomersWithCustomerId(int CustomerId)
    {
        var result = await _context.MutedCustomersJoinCustomersDtos
            .FromSqlRaw("SELECT * FROM select_muted_customers_with_customer_id({0})", CustomerId)
            .ToListAsync();

        return Ok(result);
    }

    [HttpPost("procedure-add-muted-customer")]
    public async Task<IActionResult> ProcedureAddMutedCustomer(int CustomerId, string WhyMutedDescription)
    {
        try
        {
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL add_muted_customer({CustomerId}, {WhyMutedDescription})");

            return Ok(new { Message = "Muted Customer successfully added." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }

    [HttpPost("procedure-remove-muted-customer")]
    public async Task<IActionResult> ProcedureRemoveMutedCustomer(int CustomerId)
    {
        try
        {
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL remove_muted_customer({CustomerId})");

            return Ok(new { Message = "Muted Customer successfully deleted." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }

}
    