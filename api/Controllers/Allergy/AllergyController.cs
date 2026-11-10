using api.Extensions;
using api.Responses;
using api.Services.AllergyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.Allergy;

[ApiController]
[Route("allergies")]
public class AllergyController(IAllergyService _allergyService) : ControllerBase
{
    [Authorize(Roles = "customer,customer-service")]
    [HttpGet]
    public async Task<IActionResult> GetAllergiesAsync()
    {
        var allergies = await _allergyService.GetAllergiesAsync();
        return JSend.Success(allergies.Select(allergy => allergy.AsDto()));
    }
}
