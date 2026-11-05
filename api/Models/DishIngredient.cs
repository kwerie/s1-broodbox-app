using Microsoft.EntityFrameworkCore;

namespace api.Models;

[PrimaryKey(nameof(DishId), nameof(IngredientId))]
public class DishIngredient
{
    public int DishId { get; set; }

    public int IngredientId { get; set; }

    public Dish Dish { get; set; } = null!;
    public Ingredient Ingredient { get; set; } = null!;
}
