using api.Data;
using api.Dtos;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers.Auth;

[ApiController]
[Route("auth/login")]
public class LoginController(
    BroodboxDbContext dbContext,
    IPasswordHasher<User> passwordHasher,
    ITokenService tokenService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await dbContext.Users.SingleOrDefaultAsync(user => user.Email == request.Email);
        if (user is null)
        {
            return Unauthorized();
        }

        var verification = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);
        if (verification == PasswordVerificationResult.Failed)
        {
            return Unauthorized();
        }

        return new AuthResponse(tokenService.CreateToken(user));
    }
}
