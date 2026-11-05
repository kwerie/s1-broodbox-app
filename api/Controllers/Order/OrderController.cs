using api.Dtos;
using api.Extensions;
using api.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderModel = api.Models.Order;

namespace api.Controllers.Order;

[ApiController]
[Route("order")]
public class OrderController() : ControllerBase
{
    /**
     * Returns a list of all orders in the system which have not been processed yet.
     */
    [Authorize(Roles = "customer-service")]
    [HttpGet]
    public async Task<IEnumerable<OrderModel>> GetOrdersAsync()
    {
        return [];
    }

    [Authorize(Roles = "customer")]
    [HttpPost]
    public SuccessResponse<object> CreateOrderAsync([FromBody] CreateOrderRequest request)
    {
        return JSend.Success();
    }

    [Authorize(Roles = "customer-service,customer")]
    [HttpPatch("{orderId}")]
    public JSendResponse<string> UpdateOrderAsync(string orderId, [FromBody] UpdateOrderRequest order)
    {
        var isCustomerService = User.IsInRole("customer-service");

        if (order.Status != null && isCustomerService)
        {
            // TODO: update order status
            return JSend.Success<string>(null, StatusCodes.Status204NoContent);
        }

        var userId = User.GetUserId();

        // Verify the order is owned by the user or the user has customer-service role.
        // Customer can set recipients, dishes, delivery + invoice address. Only customer-service can set the status
        return JSend.Success<string>(null, StatusCodes.Status204NoContent);
    }
}

