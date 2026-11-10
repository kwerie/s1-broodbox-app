using api.Dtos;
using api.Models;

namespace api.Services.OrderService;

public interface IOrderService
{
    Task<IEnumerable<Order>> GetOrdersAsync(int? userId, int limit = 5);

    Task<Order?> GetOrderAsync(int orderId, int? customerId);

    Task<Order> GetOrCreateDraftAsync(int customerId);

    Task<Order?> UpdateDraftAsync(int orderId, int customerId, UpdateOrderRequest request);

    Task<Order?> AcceptOrderAsync(int orderId);
}
