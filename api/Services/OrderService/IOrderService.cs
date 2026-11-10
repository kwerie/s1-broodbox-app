namespace api.Services.OrderService;

public interface IOrderService
{
    Task<IEnumerable<Models.Order>> GetOrdersAsync(int? userId, int limit = 5);

    Task<Models.Order?> GetOrderAsync(int orderId, int? customerId);
}

