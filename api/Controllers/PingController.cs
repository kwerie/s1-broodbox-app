using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("ping")]
public class PingController : ControllerBase
{

    [HttpGet(Name = "ping")]
    public Dictionary<string, object> Get()
    {
        return new Dictionary<string, object>
        {
            { "message", "pong" },
            { "timestamp", DateTime.UtcNow }
        };
    }
}
