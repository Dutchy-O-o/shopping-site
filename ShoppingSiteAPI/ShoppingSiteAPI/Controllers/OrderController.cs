using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;

using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ShoppingSiteAPI.Database;
using ShoppingSiteAPI.DTOs;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-orders")]
    public async Task<List<Order>> Get()
    {
        return await _context.Orders.ToListAsync();   //Returns all orders as a list
    }

    [HttpGet("get-order-by-id")]
    public async Task<Order> GetById(int Id)
    {
        return await _context.Orders.FirstOrDefaultAsync(x => x.OrderId == Id);    //Searches for the order with the corresponding Id
    }

    [HttpPost("add-order")]
    public async Task<IActionResult> AddOrder([FromBody] Order order)
    {
        if (order == null)
        {
            return BadRequest("Order data is null");
        }

        _context.Orders.Add(order); // Adds the new order to the Orders table
        await _context.SaveChangesAsync();  // Saves the changes to the database
        return Ok(order); // Returns the added order as a response
    }

    [HttpDelete("remove-order-by-id")]
    public async Task<IActionResult> RemoveOrder([FromQuery] int Id)  // VERY IMPORTANT TO MAKE THIS "FromQuery" AND NOT "FromBody" OTHERWISE DELETE WITH ID IS VERY IMPRACTICAL
    {
        var order = await _context.Orders.FindAsync(Id);

        if (order != null)
        {
            _context.Orders.Remove(order);  // Removes the order from the database
            await _context.SaveChangesAsync();  // Save the changes to the database
            return Ok(order);  // Return the removed order as a response
        }
        else
        {
            return BadRequest("Order data is null");
        }
    }

    [HttpGet("select-orders-join-ordered_items-join-products-with-customer_id-via-function")]
    public async Task<ActionResult<List<OrdersJoinOrderedItemsJoinProductsDto>>> SelectOrdersJoinOrderedItemsJoinProductsWithCustomerId(int CustomerId)
    {
        var result = await _context.OrdersJoinOrderedItemsJoinProductsDtos
            .FromSqlRaw("SELECT * FROM select_orders_join_ordered_items_join_products_from_customer_id({0})", CustomerId)
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("select-orders-join-ordered_items-join-products-via-function")]
    public async Task<ActionResult<List<OrdersJoinOrderedItemsJoinProductsDto>>> SelectOrdersJoinOrderedItemsJoinProducts()
    {
        var result = await _context.OrdersJoinOrderedItemsJoinProductsDtos
            .FromSqlRaw("SELECT * FROM select_orders_join_ordered_items_join_products()")
            .ToListAsync();

        return Ok(result);
    }

    
}
