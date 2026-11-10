using api.Dtos;

namespace api.Services.AddressService;

public interface IAddressService
{
    Task<IEnumerable<Models.Address>> GetAddressesAsync(int customerId);
    Task<Models.Address> CreateAsync(int customerId, CreateAddressRequest request);
    Task<Models.Address?> UpdateAsync(int addressId, int customerId, UpdateAddressRequest request);
    Task<bool> DeleteAsync(int addressId, int customerId);
    Task<Models.Address?> SetDefaultAsync(int addressId, int customerId, SetDefaultAddressRequest request);
}
