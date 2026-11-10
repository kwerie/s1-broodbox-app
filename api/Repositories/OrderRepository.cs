using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class OrderRepository(
    BroodboxDbContext _dbContext
) : IOrderRepository
{
    public async Task<IEnumerable<Order>> GetOrdersAsync(int? customerId, int limit = 5)
    {
        var query = IncludeOrderDetails(_dbContext.Orders);

        if (customerId is not null)
        {
            query = query.Where(o => o.CustomerId == customerId);
        }

        return await query.Take(limit).ToListAsync();
    }

    public async Task<Order?> GetOrderAsync(int orderId, int? customerId)
    {
        var query = IncludeOrderDetails(_dbContext.Orders)
            .Where(o => o.Id == orderId);

        if (customerId is not null)
        {
            query = query.Where(o => o.CustomerId == customerId);
        }

        return await query.FirstOrDefaultAsync();
    }

    private static IQueryable<Order> IncludeOrderDetails(IQueryable<Order> orders)
    {
        return orders
            .Include(o => o.Customer)
            .Include(o => o.Note)
            .Include(o => o.ShippingAddress)
            .Include(o => o.InvoiceAddress)
            .Include(o => o.OrderDishes)
                .ThenInclude(od => od.Dish)
            .Include(o => o.Recipients)
                .ThenInclude(r => r.RecipientAllergies)
                .ThenInclude(ra => ra.Allergy)
            .Include(o => o.Recipients)
                .ThenInclude(r => r.RecipientPreferences)
                .ThenInclude(rp => rp.Preference);
    }
}
