using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;
using ShoppingSiteAPI.Database;
using ShoppingSiteAPI.DTOs;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class ShoppingCartController : ControllerBase
{
    private readonly AppDbContext _context;

    public ShoppingCartController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("select-all-shopping-carts-via-function")]
    public async Task<ActionResult<List<ShoppingCartDto>>> SelectAllShoppingCartsThroughFunction()
    {
        var result = await _context.ShoppingCartDtos
            .FromSqlRaw("SELECT * FROM select_all_shopping_carts()")
            .ToListAsync();

        return Ok(result);
    }

    [HttpPost("procedure-add-shopping-cart")]
    public async Task<IActionResult> ProcedureAddShoppingCart(int CustomerId)
    {
        try
        {
            // Use ExecuteSqlInterpolated to safely pass parameters and call the stored procedure
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL insert_shopping_cart({CustomerId})");

            return Ok(new { Message = "Shopping Cart successfully added." });
        }
        catch (Exception ex)
        {
            // Handle any errors that occur during the call
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }

    [HttpGet("find-shopping_cart_id-using-customer_id-via-function")]
    public async Task<ActionResult<List<ShoppingCartDto>>> FindShoppingCartId(int CustomerId)
    {
        var result = await _context.ShoppingCartDtos
            .FromSqlRaw("SELECT * FROM find_shopping_cart_id_using_customer_id({0})", CustomerId)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("select-shopping_cart_items-using-shopping_cart_id-via-function")]
    public async Task<ActionResult<List<ShoppingCartItemsJoinShoppingCartsJoinProductsDto>>> SelectItemsOfShoppingCartUsingId(int ShoppingCartId)
    {
        var result = await _context.ShoppingCartItemsJoinShoppingCartsJoinProductsDTOs
            .FromSqlRaw("SELECT * FROM select_shopping_cart_items_join_shopping_cart_join_products_wit({0})", ShoppingCartId)
            .ToListAsync();

        return Ok(result);
    }

    //select_shopping_cart_items_join_shopping_cart_join_products_wit
}
