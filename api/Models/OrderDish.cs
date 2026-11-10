using Microsoft.EntityFrameworkCore;

namespace api.Models;

[PrimaryKey(nameof(OrderId), nameof(DishId))]
public class OrderDish
{
    public int OrderId { get; set; }

    public int DishId { get; set; }

    public int Quantity { get; set; }

    public Order Order { get; set; } = null!;
    public Dish Dish { get; set; } = null!;
}
