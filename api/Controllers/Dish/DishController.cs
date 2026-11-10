using api.Extensions;
using api.Responses;
using api.Services.DishService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.Dish;

[ApiController]
[Route("dishes")]
public class DishController(IDishService _dishService) : ControllerBase
{
    [Authorize(Roles = "customer,customer-service")]
    [HttpGet]
    public async Task<IActionResult> GetDishesAsync()
    {
        var dishes = await _dishService.GetDishesAsync();
        return JSend.Success(dishes.Select(dish => dish.AsDto()));
    }
}
