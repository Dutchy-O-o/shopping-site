using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ShoppingSiteAPI.Database;
using Microsoft.EntityFrameworkCore;

namespace ShoppingSiteAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AppDbContext context, IConfiguration config, ILogger<AuthController> logger)
    {
        _context = context;
        _config = config;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.CustomerEmail == loginRequest.Email);

        if (customer == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, customer.PasswordHash))
        {
            // Same message for "no such user" and "wrong password" to avoid user enumeration.
            return Unauthorized(new { message = "Invalid email or password." });
        }

        // An account is an admin if its email is listed under "AdminEmails" in configuration.
        var adminEmails = _config.GetSection("AdminEmails").Get<string[]>() ?? Array.Empty<string>();
        var role = adminEmails.Contains(customer.CustomerEmail, StringComparer.OrdinalIgnoreCase)
            ? "Admin"
            : "Customer";

        var token = GenerateToken(customer, role);

        _logger.LogInformation("Customer {CustomerId} logged in as {Role}.", customer.CustomerId, role);

        return Ok(new
        {
            token,
            userId = customer.CustomerId,
            role
        });
    }

    private string GenerateToken(Customer customer, string role)
    {
        var jwt = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, customer.CustomerId.ToString()),
            new Claim(ClaimTypes.Email, customer.CustomerEmail),
            new Claim(ClaimTypes.Role, role)
        };

        var expiryHours = int.TryParse(jwt["ExpiryHours"], out var h) ? h : 2;

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expiryHours),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}
