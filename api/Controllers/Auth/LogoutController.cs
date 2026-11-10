using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.Auth;

[ApiController]
[Route("logout")]
public class LogoutController : ControllerBase
{
    [HttpPost]
    [Authorize]
    public IActionResult Logout()
    {
        // Bearer tokens are stateless; the client discards the token to log out.
        return NoContent();
    }
}
