using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;
using ShoppingSiteAPI.Database;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-categories")]
    public async Task<List<Category>> Get()
    {
        return await _context.Categories.ToListAsync();   //Returns all categories as a list
    }

    [HttpGet("get-category-by-id")]
    public async Task<Category> GetById(int Id)
    {
        return await _context.Categories.FirstOrDefaultAsync(x => x.CategoryId == Id);    //Searches for the category with the corresponding Id
    }

    [HttpPost("add-category")]          //THIS IS OLD
    public async Task<IActionResult> AddCategory([FromBody] Category category)
    {
        if (category == null)
        {
            return BadRequest("Category data is null");
        }

        _context.Categories.Add(category); // Adds the new address to the Categories table
        await _context.SaveChangesAsync();  // Saves the changes to the database
        return Ok(category); // Returns the added category as a response
    }

    [HttpDelete("remove-category-by-id")]
    public async Task<IActionResult> RemoveCategory([FromQuery] int Id)  // VERY IMPORTANT TO MAKE THIS "FromQuery" AND NOT "FromBody" OTHERWISE DELETE WITH ID IS VERY IMPRACTICAL
    {
        var category = await _context.Categories.FindAsync(Id);

        if (category != null)
        {
            _context.Categories.Remove(category);  // Removes the category from the database
            await _context.SaveChangesAsync();  // Save the changes to the database
            return Ok(category);  // Return the removed category as a response
        }
        else
        {
            return BadRequest("Category data is null");
        }
    }
}
