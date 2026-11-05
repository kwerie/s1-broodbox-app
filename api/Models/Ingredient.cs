using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Ingredient
{
    public int Id { get; set; }

    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    public ICollection<DishIngredient> DishIngredients { get; set; } = new List<DishIngredient>();
}
