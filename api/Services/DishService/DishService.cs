using api.Repositories;

namespace api.Services.DishService;

public class DishService(IDishRepository _dishRepository) : IDishService
{
    public Task<IEnumerable<Models.Dish>> GetDishesAsync() => _dishRepository.GetDishesAsync();
}
