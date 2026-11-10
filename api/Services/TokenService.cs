using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Models;
using Microsoft.IdentityModel.Tokens;

namespace api.Services;

public class TokenService(JwtOptions options) : ITokenService
{
    private readonly SigningCredentials credentials = new(
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.SigningKey)),
        SecurityAlgorithms.HmacSha256);

    public string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Role, user.Role)
        };

        if (user.Customer is not null)
        {
            claims.Add(new Claim(JwtRegisteredClaimNames.Name, user.Customer.Name));
        }

        var token = new JwtSecurityToken(
            issuer: options.Issuer,
            audience: options.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(options.ExpiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
