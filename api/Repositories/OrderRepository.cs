using api.Data;
using api.Models;
using api.Services;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class OrderRepository(
    BroodboxDbContext _dbContext
) : IOrderRepository
{
    public async Task<IEnumerable<Order>> GetOrdersAsync(int? customerId, int limit = 5)
    {
        var query = IncludeOrderDetails(_dbContext.Orders)
            .Where(o => o.Status != OrderStatus.Draft);

        if (customerId is not null)
        {
            query = query.Where(o => o.CustomerId == customerId);
        }

        query = query.OrderByDescending(o => o.OrderedAt);

        if (limit > 0)
        {
            query = query.Take(limit);
        }

        return await query.ToListAsync();
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

    public async Task<Order> GetOrCreateDraftAsync(int customerId)
    {
        var existing = await IncludeOrderDetails(_dbContext.Orders)
            .FirstOrDefaultAsync(o => o.CustomerId == customerId && o.Status == OrderStatus.Draft);

        if (existing is not null)
        {
            return existing;
        }

        var now = DateTime.UtcNow;
        var draft = new Order
        {
            CustomerId = customerId,
            Status = OrderStatus.Draft,
            OrderedAt = now,
            OrderNumber = OrderNumberGenerator.Generate(now),
        };

        _dbContext.Orders.Add(draft);

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            _dbContext.Entry(draft).State = EntityState.Detached;
            return await IncludeOrderDetails(_dbContext.Orders)
                .FirstAsync(o => o.CustomerId == customerId && o.Status == OrderStatus.Draft);
        }

        return await IncludeOrderDetails(_dbContext.Orders).FirstAsync(o => o.Id == draft.Id);
    }

    public Task<Order?> GetTrackedDraftAsync(int orderId, int customerId)
    {
        return _dbContext.Orders
            .Include(o => o.OrderDishes)
            .Include(o => o.Recipients).ThenInclude(r => r.RecipientAllergies)
            .Include(o => o.Recipients).ThenInclude(r => r.RecipientPreferences)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.CustomerId == customerId);
    }

    public Task<Order?> GetTrackedByIdAsync(int orderId)
    {
        return _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
    }

    public Task SaveAsync() => _dbContext.SaveChangesAsync();

    public Task<bool> AddressBelongsToCustomerAsync(int addressId, int customerId) =>
        _dbContext.Addresses.AnyAsync(a => a.Id == addressId && a.CustomerId == customerId);

    public Task<bool> DishExistsAsync(int dishId) =>
        _dbContext.Dishes.AnyAsync(d => d.Id == dishId);

    public Task<bool> AllergyExistsAsync(int allergyId) =>
        _dbContext.Allergies.AnyAsync(a => a.Id == allergyId);

    public async Task<Preference> GetOrCreatePreferenceAsync(string description)
    {
        var trimmed = description.Trim();
        var existing = await _dbContext.Preferences
            .FirstOrDefaultAsync(p => p.Description.ToLower() == trimmed.ToLower());

        if (existing is not null)
        {
            return existing;
        }

        var created = new Preference { Description = trimmed };
        _dbContext.Preferences.Add(created);
        return created;
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
