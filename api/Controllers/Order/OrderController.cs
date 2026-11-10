using api.Dtos;
using api.Extensions;
using api.Services.CustomerService;
using api.Services.OrderService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.Order;

[ApiController]
[Route("order")]
public class OrderController(
    IOrderService _orderService,
    ICustomerService _customerService
) : ControllerBase
{
    /**
     * Returns a list of all orders in the system which have not been processed yet.
     */
    [Authorize(Roles = "customer-service,customer")]
    [HttpGet]
    public async Task<IEnumerable<OrderDto>> GetOrdersAsync([FromQuery] int limit = 5)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        var orders = await _orderService.GetOrdersAsync(customer?.Id, limit);
        return orders.Select(o => o.AsDto());
    }

    [Authorize(Roles = "customer-service,customer")]
    [HttpGet("{orderId:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderAsync(int orderId)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        var order = await _orderService.GetOrderAsync(orderId, customer?.Id);

        if (order is null)
        {
            return NotFound();
        }

        return order.AsDto();
    }

    [Authorize(Roles = "customer")]
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateDraftAsync()
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return Forbid();
        }

        var draft = await _orderService.GetOrCreateDraftAsync(customer.Id);
        return draft.AsDto();
    }

    [Authorize(Roles = "customer-service")]
    [HttpPost("{orderId:int}/accept")]
    public async Task<ActionResult<OrderDto>> AcceptOrderAsync(int orderId)
    {
        try
        {
            var accepted = await _orderService.AcceptOrderAsync(orderId);
            return accepted is null ? NotFound() : accepted.AsDto();
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [Authorize(Roles = "customer")]
    [HttpPatch("{orderId:int}")]
    public async Task<ActionResult<OrderDto>> UpdateOrderAsync(int orderId, [FromBody] UpdateOrderRequest request)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return Forbid();
        }

        try
        {
            var updated = await _orderService.UpdateDraftAsync(orderId, customer.Id, request);
            return updated is null ? NotFound() : updated.AsDto();
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }
}

