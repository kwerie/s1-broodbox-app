using api.Dtos;
using api.Extensions;
using api.Responses;
using api.Services.AddressService;
using api.Services.CustomerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers.Address;

[ApiController]
[Route("addresses")]
[Authorize(Roles = "customer")]
public class AddressController(
    IAddressService _addressService,
    ICustomerService _customerService
) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAddressesAsync()
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return JSend.Fail(statusCode: StatusCodes.Status403Forbidden);
        }

        var addresses = await _addressService.GetAddressesAsync(customer.Id);
        return JSend.Success(addresses.Select(address => address.AsDto()));
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAddressRequest request)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return JSend.Fail(statusCode: StatusCodes.Status403Forbidden);
        }

        var address = await _addressService.CreateAsync(customer.Id, request);
        return JSend.Success(address.AsDto());
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateAddressRequest request)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return JSend.Fail(statusCode: StatusCodes.Status403Forbidden);
        }

        var address = await _addressService.UpdateAsync(id, customer.Id, request);
        return address is null
            ? JSend.Fail(statusCode: StatusCodes.Status404NotFound)
            : JSend.Success(address.AsDto());
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return JSend.Fail(statusCode: StatusCodes.Status403Forbidden);
        }

        try
        {
            var deleted = await _addressService.DeleteAsync(id, customer.Id);
            return deleted ? JSend.Success() : JSend.Fail(statusCode: StatusCodes.Status404NotFound);
        }
        catch (DbUpdateException)
        {
            return JSend.Fail(
                new { message = "Dit adres is gekoppeld aan een bestelling en kan niet worden verwijderd." },
                StatusCodes.Status409Conflict);
        }
    }

    [HttpPatch("{id:int}/default")]
    public async Task<IActionResult> SetDefaultAsync(int id, [FromBody] SetDefaultAddressRequest request)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return JSend.Fail(statusCode: StatusCodes.Status403Forbidden);
        }

        var address = await _addressService.SetDefaultAsync(id, customer.Id, request);
        return address is null
            ? JSend.Fail(statusCode: StatusCodes.Status404NotFound)
            : JSend.Success(address.AsDto());
    }
}
