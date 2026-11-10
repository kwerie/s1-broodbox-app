using api.Models;

namespace api.Repositories;

public interface IOrderRepository
{
    Task<IEnumerable<Order>> GetOrdersAsync(int? userId, int limit = 5);

    Task<Order?> GetOrderAsync(int orderId, int? customerId);

    Task<Order> GetOrCreateDraftAsync(int customerId);

    Task<Order?> GetTrackedDraftAsync(int orderId, int customerId);

    Task SaveAsync();

    Task<bool> AddressBelongsToCustomerAsync(int addressId, int customerId);

    Task<bool> DishExistsAsync(int dishId);

    Task<bool> AllergyExistsAsync(int allergyId);

    Task<Preference> GetOrCreatePreferenceAsync(string description);
}
