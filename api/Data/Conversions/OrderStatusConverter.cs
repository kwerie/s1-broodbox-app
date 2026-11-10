using api.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace api.Data.Conversions;

public class OrderStatusConverter : ValueConverter<OrderStatus, string>
{
    private static readonly IReadOnlyDictionary<OrderStatus, string> Labels = new Dictionary<OrderStatus, string>
    {
        [OrderStatus.Received] = "Received",
        [OrderStatus.Accepted] = "Accepted",
        [OrderStatus.InPreparation] = "In preparation",
        [OrderStatus.Done] = "Done",
    };

    private static readonly IReadOnlyDictionary<string, OrderStatus> Values =
        Labels.ToDictionary(pair => pair.Value, pair => pair.Key);

    public OrderStatusConverter() : base(
        status => Labels[status],
        label => Values[label])
    {
    }
}
