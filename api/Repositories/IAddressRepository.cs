namespace api.Repositories;

public interface IAddressRepository
{
    Task<IEnumerable<Models.Address>> GetAddressesAsync(int customerId);
    Task<Models.Address?> GetAddressAsync(int addressId, int customerId);
    void Add(Models.Address address);
    void Remove(Models.Address address);
    Task<IEnumerable<Models.Address>> GetDefaultsOfKindAsync(int customerId, bool invoice);
    Task SaveAsync();
}
