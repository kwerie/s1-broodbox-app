using api.Dtos;
using api.Models;
using api.Repositories;

namespace api.Services.AddressService;

public class AddressService(IAddressRepository _addressRepository) : IAddressService
{
    public Task<IEnumerable<Address>> GetAddressesAsync(int customerId) =>
        _addressRepository.GetAddressesAsync(customerId);

    public async Task<Address> CreateAsync(int customerId, CreateAddressRequest request)
    {
        var address = new Address
        {
            CustomerId = customerId,
            Type = "custom",
            Street = request.Street,
            HouseNumber = request.HouseNumber,
            Addition = request.Addition,
            PostalCode = request.PostalCode,
            City = request.City,
        };

        _addressRepository.Add(address);
        await _addressRepository.SaveAsync();
        return address;
    }

    public async Task<Address?> UpdateAsync(int addressId, int customerId, UpdateAddressRequest request)
    {
        var address = await _addressRepository.GetAddressAsync(addressId, customerId);
        if (address is null)
        {
            return null;
        }

        address.Street = request.Street;
        address.HouseNumber = request.HouseNumber;
        address.Addition = request.Addition;
        address.PostalCode = request.PostalCode;
        address.City = request.City;

        await _addressRepository.SaveAsync();
        return address;
    }

    public async Task<bool> DeleteAsync(int addressId, int customerId)
    {
        var address = await _addressRepository.GetAddressAsync(addressId, customerId);
        if (address is null)
        {
            return false;
        }

        _addressRepository.Remove(address);
        await _addressRepository.SaveAsync();
        return true;
    }

    public async Task<Address?> SetDefaultAsync(int addressId, int customerId, SetDefaultAddressRequest request)
    {
        var address = await _addressRepository.GetAddressAsync(addressId, customerId);
        if (address is null)
        {
            return null;
        }

        if (request.Invoice == true)
        {
            foreach (var previous in await _addressRepository.GetDefaultsOfKindAsync(customerId, invoice: true))
            {
                previous.IsDefaultInvoice = false;
            }
            address.IsDefaultInvoice = true;
        }

        if (request.Shipping == true)
        {
            foreach (var previous in await _addressRepository.GetDefaultsOfKindAsync(customerId, invoice: false))
            {
                previous.IsDefaultShipping = false;
            }
            address.IsDefaultShipping = true;
        }

        await _addressRepository.SaveAsync();
        return address;
    }
}
