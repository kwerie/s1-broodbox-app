using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Dish
{
    public int Id { get; set; }

    public int PreparationTime { get; set; }

    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    public ICollection<OrderDish> OrderDishes { get; set; } = new List<OrderDish>();
    public ICollection<DishIngredient> DishIngredients { get; set; } = new List<DishIngredient>();
}
