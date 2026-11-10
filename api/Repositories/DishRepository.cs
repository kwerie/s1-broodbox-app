using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class DishRepository(BroodboxDbContext _dbContext) : IDishRepository
{
    public async Task<IEnumerable<Dish>> GetDishesAsync() =>
        await _dbContext.Dishes.OrderBy(dish => dish.Name).ToListAsync();
}
