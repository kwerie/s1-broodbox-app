using api.Dtos;
using api.Extensions;
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
    public async Task<IEnumerable<AllergyResponse>> GetAllergiesAsync()
    {
        var allergies = await _allergyService.GetAllergiesAsync();
        return allergies.Select(allergy => allergy.AsDto());
    }
}
