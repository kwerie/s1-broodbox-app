using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class AddressRepository(BroodboxDbContext _dbContext) : IAddressRepository
{
    public async Task<IEnumerable<Address>> GetAddressesAsync(int customerId) =>
        await _dbContext.Addresses
            .Where(a => a.CustomerId == customerId)
            .OrderBy(a => a.Id)
            .ToListAsync();

    public Task<Address?> GetAddressAsync(int addressId, int customerId) =>
        _dbContext.Addresses.FirstOrDefaultAsync(a => a.Id == addressId && a.CustomerId == customerId);

    public void Add(Address address) => _dbContext.Addresses.Add(address);

    public void Remove(Address address) => _dbContext.Addresses.Remove(address);

    public async Task<IEnumerable<Address>> GetDefaultsOfKindAsync(int customerId, bool invoice) =>
        await _dbContext.Addresses
            .Where(a => a.CustomerId == customerId && (invoice ? a.IsDefaultInvoice : a.IsDefaultShipping))
            .ToListAsync();

    public Task SaveAsync() => _dbContext.SaveChangesAsync();
}
