using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ShoppingSiteAPI.Controllers;

using Microsoft.EntityFrameworkCore.Storage;
using Npgsql;
using ShoppingSiteAPI.Database;
using ShoppingSiteAPI.DTOs;

[Route("api/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomerController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("get-customers")]
    public async Task<List<Customer>> Get()
    {
        return await _context.Customers.ToListAsync();   //Returns all customers as a list
    }

    [HttpGet("get-customer-by-id")]
    public async Task<Customer> GetById(int Id)
    {
        return await _context.Customers.FirstOrDefaultAsync(x => x.CustomerId == Id);    //Searches for the customer with the corresponding Id
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("add-customer-old")]
    public async Task<IActionResult> AddCustomerOld([FromBody] Customer customer)
    {
        if (customer == null)
        {
            return BadRequest("Customer data is null");
        }

        _context.Customers.Add(customer); // Adds the new customer to the Customers table
        await _context.SaveChangesAsync();  // Saves the changes to the database
        return Ok(customer); // Returns the added customer as a response
    }


    // POST: api/customer/add-customer
    [Authorize(Roles = "Admin")]
    [HttpPost("add-customer")]
    public async Task<IActionResult> AddCustomer([FromBody] Customer customer)
    {

        if (customer == null)
        {
            return BadRequest("Customer data is null");
        }

        _context.Customers.Add(customer); // Adds the new customer to the Customers table
        await _context.SaveChangesAsync();  // Saves the changes to the database
        return Ok(customer); // Returns the added customer as a response

    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("remove-customer-by-id")]
    public async Task<IActionResult> RemoveCustomer([FromQuery] int Id)  // VERY IMPORTANT TO MAKE THIS "FromQuery" AND NOT "FromBody" OTHERWISE DELETE WITH ID IS VERY IMPRACTICAL
    {
        var customer = await _context.Customers.FindAsync(Id);

        if (customer != null)
        {
            _context.Customers.Remove(customer);  // Removes the customer from the database
            await _context.SaveChangesAsync();  // Save the changes to the database
            return Ok(customer);  // Return the removed customer as a response
        }
        else
        {
            return BadRequest("Customer data is null");
        }
    }

    [HttpGet("get-customer-by-function/{id}")]
    public async Task<IActionResult> GetCustomerByFunction(int id)
    {
        try
        {
            // Execute the SQL function and map the results to CustomerDto
            var customers = await _context.Set<CustomerDto>()
                .FromSqlRaw("SELECT * FROM select_customer({0})", id)
                .AsNoTracking()
                .ToListAsync();

            if (!customers.Any())
            {
                return NotFound($"Customer with ID {id} not found.");
            }

            return Ok(customers.First());
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error occurred: {ex.Message}");
            return StatusCode(500, $"Internal Server Error: {ex.Message}");
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("select-all-customers")]
    public async Task<ActionResult<List<CustomerDto>>> SelectAllCustomers()
    {
        var result = await _context.CustomerDtos
            .FromSqlRaw("SELECT * FROM select_all_customers()")
            .ToListAsync();

        return Ok(result);
    }

    [HttpPost("procedure-sign-up")]
    public async Task<IActionResult> ProcedureSignUp([FromBody] SignUpRequest request)
    {
        try
        {
            // Bind the request body to local variables so the password never
            // travels in the URL / query string (where it would be logged).
            var CustomerFirstName = request.CustomerFirstName ?? string.Empty;
            var CustomerLastName = request.CustomerLastName ?? string.Empty;
            var CustomerEmail = request.CustomerEmail ?? string.Empty;
            var PasswordHash = request.PasswordHash ?? string.Empty;

            var namePattern = @"^[a-zA-Z\s]+$";

            if (CustomerFirstName.Length > 40 || CustomerLastName.Length > 40)
            {
                return BadRequest(new { Message = "First name and last name cannot exceed 40 characters." });
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(CustomerFirstName, namePattern) ||
                !System.Text.RegularExpressions.Regex.IsMatch(CustomerLastName, namePattern))
            {
                return BadRequest(new { Message = "First name and last name can only contain letters and spaces." });
            }

            if (!CustomerEmail.Contains("@"))
            {
                return BadRequest(new { Message = "Email must contain an '@' character." });
            }

            if (CustomerEmail.Length > 50)
            {
                return BadRequest(new { Message = "Email cannot exceed 50 characters." });
            }

            var emailExists = await _context.Customers.AnyAsync(c => c.CustomerEmail == CustomerEmail);
            if (emailExists)
            {
                return BadRequest(new { Message = "This email is already registered. Please use a different email." });
            }

            if (PasswordHash.Length < 8)
            {
                return BadRequest(new { Message = "Password must be at least 8 characters long." });
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(PasswordHash);

            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL insert_customer({CustomerFirstName}, {CustomerLastName}, {CustomerEmail}, {passwordHash})");

            return Ok(new { Message = "Customer successfully added." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }



    [Authorize]
    [HttpPost("procedure-edit-profile")]
    public async Task<IActionResult> ProcedureEditProfile(int CustomerId, string? CustomerFirstName, string? CustomerLastName, string? CustomerEmail, string? PasswordHash)
    {
        try
        {
            var namePattern = @"^[a-zA-Z\s]+$";

            if (CustomerFirstName != null)
            {
                if (CustomerFirstName.Length > 40)
                {
                    return BadRequest(new { Message = "First name cannot exceed 40 characters." });
                }

                if (!System.Text.RegularExpressions.Regex.IsMatch(CustomerFirstName, namePattern))
                {
                    return BadRequest(new { Message = "First name can only contain letters and spaces." });
                }
            }

            if (CustomerLastName != null)
            {
                if (CustomerLastName.Length > 40)
                {
                    return BadRequest(new { Message = "Last name cannot exceed 40 characters." });
                }

                if (!System.Text.RegularExpressions.Regex.IsMatch(CustomerLastName, namePattern))
                {
                    return BadRequest(new { Message = "Last name can only contain letters and spaces." });
                }
            }


            if (CustomerEmail != null)
            {
                if (!CustomerEmail.Contains("@"))
                {
                    return BadRequest(new { Message = "Email must contain an '@' character." });
                }

                if (CustomerEmail.Length > 50)
                {
                    return BadRequest(new { Message = "Email cannot exceed 50 characters." });
                }
            }

            string passwordHash = "";

            if (PasswordHash != null)
            {
                if (PasswordHash.Length < 8)
                {
                    return BadRequest(new { Message = "Password must be at least 8 characters long." });
                }

                passwordHash = BCrypt.Net.BCrypt.HashPassword(PasswordHash);
            }
            else if (PasswordHash == null)
            {
                passwordHash = PasswordHash;
            }

            //string passwordHash = BCrypt.Net.BCrypt.HashPassword(PasswordHash);

            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL edit_profile({CustomerId}, {CustomerFirstName}, {CustomerLastName}, {CustomerEmail}, {passwordHash})");

            return Ok(new { Message = "Profile successfully edited." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("delete-customer-via-function")]
    public async Task<IActionResult> DeleteCustomer(int CustomerId)
    {
        try
        {
            await _context.Database.ExecuteSqlInterpolatedAsync(
                $"CALL delete_customer({CustomerId})");

            return Ok(new { Message = "Profile successfully deleted." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = "An error occurred.", Details = ex.Message });
        }
    }
}

public class SignUpRequest
{
    public string? CustomerFirstName { get; set; }
    public string? CustomerLastName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? PasswordHash { get; set; }
}


