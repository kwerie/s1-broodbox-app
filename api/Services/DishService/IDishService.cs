namespace api.Services.DishService;

public interface IDishService
{
    Task<IEnumerable<Models.Dish>> GetDishesAsync();
}
