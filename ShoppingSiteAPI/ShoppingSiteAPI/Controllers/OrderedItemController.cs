using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;
using ShoppingSiteAPI.Database;

[Route("api/[controller]")]
[ApiController]
public class OrderedItemController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderedItemController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-ordered-items")]
    public async Task<List<OrderedItem>> Get()
    {
        return await _context.OrderedItems.ToListAsync();   //Returns all ordered items as a list
    }

    [HttpGet("get-ordered-item-by-id")]
    public async Task<OrderedItem> GetById(int Id)
    {
        return await _context.OrderedItems.FirstOrDefaultAsync(x => x.ProductId == Id);    //Searches for the ordered item with the corresponding Id
    }

    [HttpPost("add-ordered-item")]
    public async Task<IActionResult> AddOrderedItem([FromBody] OrderedItem orderedItem)
    {
        if (orderedItem == null)
        {
            return BadRequest("Ordered item data is null");
        }

        _context.OrderedItems.Add(orderedItem); // Adds the new ordered item to the Orders table
        await _context.SaveChangesAsync();  // Saves the changes to the database
        return Ok(orderedItem); // Returns the added ordered item as a response
    }

    [HttpDelete("remove-ordered-item-by-id")]
    public async Task<IActionResult> RemoveOrderedItem([FromQuery] int Id)  // VERY IMPORTANT TO MAKE THIS "FromQuery" AND NOT "FromBody" OTHERWISE DELETE WITH ID IS VERY IMPRACTICAL
    {
        var orderedItem = await _context.OrderedItems.FindAsync(Id);

        if (orderedItem != null)
        {
            _context.OrderedItems.Remove(orderedItem);  // Removes the ordered item from the database
            await _context.SaveChangesAsync();  // Save the changes to the database
            return Ok(orderedItem);  // Return the removed ordered item as a response
        }
        else
        {
            return BadRequest("Ordered item data is null");
        }
    }
}
