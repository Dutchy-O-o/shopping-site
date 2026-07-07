using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;
using ShoppingSiteAPI.Database;
using ShoppingSiteAPI.DTOs;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class ShoppingCartItemController : ControllerBase
{
    private readonly AppDbContext _context;

    public ShoppingCartItemController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("select-all-shopping-cart-items-via-function")]
    public async Task<ActionResult<List<ShoppingCartItemsJoinShoppingCartsJoinProductsDto>>> SelectAllShoppingCartItemsThroughFunction()
    {
        var result = await _context.ShoppingCartItemsJoinShoppingCartsJoinProductsDTOs
            .FromSqlRaw("SELECT * FROM select_all_shopping_cart_items_join_shopping_cart_join_products()")
            .ToListAsync();

        return Ok(result);
    }

    [HttpPost("procedure-add-shopping-cart-item")]
    public async Task<IActionResult> ProcedureAddShoppingCartItem(int ShoppingCartId, int ProductId, int Quantity)
    {
        try
        {
            // Directly call the database procedure to handle the insertion or update
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL insert_shopping_cart_item({ShoppingCartId}, {ProductId}, {Quantity})");

            return Ok(new { Message = "Shopping Cart Item successfully added or updated." });
        }
        catch (Exception ex)
        {
            // Handle errors gracefully and provide detailed feedback
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }

    [HttpPost("procedure-remove-from-cart-add-to-new-order")]
    public async Task<IActionResult> ProcedureRemoveFromCartAddToNewOrder(int input_ShoppingCartId, string input_PaymentMethod, string input_CardNumber)
    {
        try
        {
            // Use ExecuteSqlInterpolated to safely pass parameters and call the stored procedure
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL CartIntoOrder({input_ShoppingCartId}, {input_PaymentMethod}, {input_CardNumber})");

            return Ok(new { Message = "Shopping Cart Items successfully moved to OrderedItems, also created new Order." });
        }
        catch (Exception ex)
        {
            // Handle any errors that occur during the call
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }

    [HttpGet("select-all-shopping-cart-items-via-function-less-total-values")]
    public async Task<ActionResult<List<ShoppingCartItemDto>>> SelectAllShoppingCartItemsThroughFunctionLessTotalValues()
    {
        var result = await _context.ShoppingCartItemDtos
            .FromSqlRaw("SELECT * FROM select_all_shopping_cart_items()")
            .ToListAsync();

        return Ok(result);
    }

    [HttpPost("procedure-remove-shopping_cart_item-from-shopping_cart")]
    public async Task<IActionResult> ProcedureRemoveShoppingCartItemFromShoppingCart(int ShoppingCartId, int ProductId, int Quantity)
    {
        try
        {
            // Use ExecuteSqlInterpolated to safely pass parameters and call the stored procedure
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL remove_shopping_cart_item_from_shopping_cart({ShoppingCartId}, {ProductId}, {Quantity})");

            return Ok(new { Message = "Shopping Cart Items removed from Shopping Cart." });
        }
        catch (Exception ex)
        {
            // Handle any errors that occur during the call
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }
}
