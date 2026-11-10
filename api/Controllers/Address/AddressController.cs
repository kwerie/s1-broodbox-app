using api.Dtos;
using api.Extensions;
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
    public async Task<ActionResult<IEnumerable<AddressResponse>>> GetAddressesAsync()
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return Forbid();
        }

        var addresses = await _addressService.GetAddressesAsync(customer.Id);
        return Ok(addresses.Select(address => address.AsDto()));
    }

    [HttpPost]
    public async Task<ActionResult<AddressResponse>> CreateAsync([FromBody] CreateAddressRequest request)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return Forbid();
        }

        var address = await _addressService.CreateAsync(customer.Id, request);
        return address.AsDto();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AddressResponse>> UpdateAsync(int id, [FromBody] UpdateAddressRequest request)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return Forbid();
        }

        var address = await _addressService.UpdateAsync(id, customer.Id, request);
        return address is null ? NotFound() : address.AsDto();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return Forbid();
        }

        try
        {
            var deleted = await _addressService.DeleteAsync(id, customer.Id);
            return deleted ? NoContent() : NotFound();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Dit adres is gekoppeld aan een bestelling en kan niet worden verwijderd." });
        }
    }

    [HttpPatch("{id:int}/default")]
    public async Task<ActionResult<AddressResponse>> SetDefaultAsync(int id, [FromBody] SetDefaultAddressRequest request)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return Forbid();
        }

        var address = await _addressService.SetDefaultAsync(id, customer.Id, request);
        return address is null ? NotFound() : address.AsDto();
    }
}
