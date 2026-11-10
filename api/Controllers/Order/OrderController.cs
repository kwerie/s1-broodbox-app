using api.Dtos;
using api.Extensions;
using api.Responses;
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
    [Authorize(Roles = "customer-service,customer")]
    [HttpGet]
    public async Task<IActionResult> GetOrdersAsync([FromQuery] int limit = 5)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        var orders = await _orderService.GetOrdersAsync(customer?.Id, limit);
        return JSend.Success(orders.Select(o => o.AsDto()));
    }

    [Authorize(Roles = "customer-service,customer")]
    [HttpGet("{orderId:int}")]
    public async Task<IActionResult> GetOrderAsync(int orderId)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        var order = await _orderService.GetOrderAsync(orderId, customer?.Id);

        return order is null
            ? JSend.Fail(statusCode: StatusCodes.Status404NotFound)
            : JSend.Success(order.AsDto());
    }

    [Authorize(Roles = "customer")]
    [HttpPost]
    public async Task<IActionResult> CreateDraftAsync()
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return JSend.Fail(statusCode: StatusCodes.Status403Forbidden);
        }

        var draft = await _orderService.GetOrCreateDraftAsync(customer.Id);
        return JSend.Success(draft.AsDto());
    }

    [Authorize(Roles = "customer-service")]
    [HttpPost("{orderId:int}/accept")]
    public async Task<IActionResult> AcceptOrderAsync(int orderId)
    {
        try
        {
            var accepted = await _orderService.AcceptOrderAsync(orderId);
            return accepted is null
                ? JSend.Fail(statusCode: StatusCodes.Status404NotFound)
                : JSend.Success(accepted.AsDto());
        }
        catch (InvalidOperationException exception)
        {
            return JSend.Fail(new { message = exception.Message });
        }
    }

    [Authorize(Roles = "customer")]
    [HttpPatch("{orderId:int}")]
    public async Task<IActionResult> UpdateOrderAsync(int orderId, [FromBody] UpdateOrderRequest request)
    {
        var customer = await _customerService.GetCustomerByIdAsync(User.GetUserId());
        if (customer is null)
        {
            return JSend.Fail(statusCode: StatusCodes.Status403Forbidden);
        }

        try
        {
            var updated = await _orderService.UpdateDraftAsync(orderId, customer.Id, request);
            return updated is null
                ? JSend.Fail(statusCode: StatusCodes.Status404NotFound)
                : JSend.Success(updated.AsDto());
        }
        catch (InvalidOperationException exception)
        {
            return JSend.Fail(new { message = exception.Message });
        }
    }
}
