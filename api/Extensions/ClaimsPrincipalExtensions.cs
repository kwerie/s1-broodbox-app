using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? throw new InvalidOperationException("The 'sub' claim is missing from the current user.");

        return int.Parse(value);
    }
}
