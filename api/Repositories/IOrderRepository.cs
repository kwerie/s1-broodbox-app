namespace api.Repositories;

public interface IOrderRepository
{
    Task<IEnumerable<Models.Order>> GetOrdersAsync(int? userId, int limit = 5);

    Task<Models.Order?> GetOrderAsync(int orderId, int? customerId);
}

