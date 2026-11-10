using api.Models;
using api.Repositories;

namespace api.Services.OrderService;

public class OrderService(
    IOrderRepository _orderRepository
) : IOrderService
{
    public Task<IEnumerable<Order>> GetOrdersAsync(int? userId, int limit = 5)
    {
        return _orderRepository.GetOrdersAsync(userId, limit);
    }

    public Task<Order?> GetOrderAsync(int orderId, int? customerId)
    {
        return _orderRepository.GetOrderAsync(orderId, customerId);
    }
}

