namespace api.Repositories;

public interface IDishRepository
{
    Task<IEnumerable<Models.Dish>> GetDishesAsync();
}
