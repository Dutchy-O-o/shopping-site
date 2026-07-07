using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;
using ShoppingSiteAPI.Database;

[Route("api/[controller]")]
[ApiController]
public class AddressController : ControllerBase
{
    private readonly AppDbContext _context;

    public AddressController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-addresses")]
    public async Task<List<Address>> Get()
    {
        return await _context.Addresses.ToListAsync();   //Returns all addresses as a list
    }

    [HttpGet("get-address-by-id")]
    public async Task<Address> GetById(int Id)
    {
        return await _context.Addresses.FirstOrDefaultAsync(x => x.AddressId == Id);    //Searches for the address with the corresponding Id
    }

    [HttpPost("add-address")]
    public async Task<IActionResult> AddAddress([FromBody] Address address)
    {
        if (address == null)
        {
            return BadRequest("Address data is null");
        }

        _context.Addresses.Add(address); // Adds the new address to the Addresses table
        await _context.SaveChangesAsync();  // Saves the changes to the database
        return Ok(address); // Returns the added address as a response
    }

    [HttpDelete("remove-address-by-id")]
    public async Task<IActionResult> RemoveStudent([FromQuery] int Id)  // VERY IMPORTANT TO MAKE THIS "FromQuery" AND NOT "FromBody" OTHERWISE DELETE WITH ID IS VERY IMPRACTICAL
    {
        var address = await _context.Addresses.FindAsync(Id);

        if (address != null)
        {
            _context.Addresses.Remove(address);  // Removes the address from the database
            await _context.SaveChangesAsync();  // Save the changes to the database
            return Ok(address);  // Return the removed address as a response
        }
        else
        {
            return BadRequest("Address data is null");
        }
    }
}
