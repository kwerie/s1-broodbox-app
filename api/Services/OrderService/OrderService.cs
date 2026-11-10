using api.Dtos;
using api.Models;
using api.Repositories;

namespace api.Services.OrderService;

public class OrderService(
    IOrderRepository _orderRepository
) : IOrderService
{
    public Task<IEnumerable<Order>> GetOrdersAsync(int? userId, int limit = 5)
    {
        return _orderRepository.GetOrdersAsync(userId, limit);
    }

    public Task<Order?> GetOrderAsync(int orderId, int? customerId)
    {
        return _orderRepository.GetOrderAsync(orderId, customerId);
    }

    public Task<Order> GetOrCreateDraftAsync(int customerId)
    {
        return _orderRepository.GetOrCreateDraftAsync(customerId);
    }

    public async Task<Order?> AcceptOrderAsync(int orderId)
    {
        var order = await _orderRepository.GetTrackedByIdAsync(orderId);
        if (order is null)
        {
            return null;
        }

        if (order.Status != OrderStatus.Received)
        {
            throw new InvalidOperationException("Alleen ontvangen bestellingen kunnen worden geaccepteerd.");
        }

        order.Status = OrderStatus.Accepted;
        await _orderRepository.SaveAsync();
        return await _orderRepository.GetOrderAsync(orderId, null);
    }

    public async Task<Order?> UpdateDraftAsync(int orderId, int customerId, UpdateOrderRequest request)
    {
        var draft = await _orderRepository.GetTrackedDraftAsync(orderId, customerId);
        if (draft is null || draft.Status != OrderStatus.Draft)
        {
            return null;
        }

        await ApplyDishesAsync(draft, request);
        await ApplyRecipientsAsync(draft, request);
        await ApplyAddressesAsync(draft, customerId, request);
        ApplyConfirmation(draft, request);

        await _orderRepository.SaveAsync();
        return await _orderRepository.GetOrderAsync(orderId, customerId);
    }

    private async Task ApplyDishesAsync(Order draft, UpdateOrderRequest request)
    {
        if (request.Dishes is null)
        {
            return;
        }

        foreach (var dish in request.Dishes)
        {
            if (dish.Quantity < 1 || !await _orderRepository.DishExistsAsync(dish.DishId))
            {
                throw new InvalidOperationException($"Invalid dish {dish.DishId}.");
            }
        }

        draft.OrderDishes.Clear();
        foreach (var dish in request.Dishes)
        {
            draft.OrderDishes.Add(new OrderDish { DishId = dish.DishId, Quantity = dish.Quantity });
        }
    }

    private async Task ApplyRecipientsAsync(Order draft, UpdateOrderRequest request)
    {
        if (request.Recipients is null)
        {
            return;
        }

        foreach (var recipient in request.Recipients)
        {
            foreach (var allergyId in recipient.AllergyIds ?? [])
            {
                if (!await _orderRepository.AllergyExistsAsync(allergyId))
                {
                    throw new InvalidOperationException($"Invalid allergy {allergyId}.");
                }
            }
        }

        draft.Recipients.Clear();
        foreach (var recipientDto in request.Recipients)
        {
            var recipient = new Recipient
            {
                Name = recipientDto.Name,
                LockerNumber = recipientDto.LockerNumber,
            };

            foreach (var allergyId in recipientDto.AllergyIds ?? [])
            {
                recipient.RecipientAllergies.Add(new RecipientAllergy { AllergyId = allergyId });
            }

            foreach (var description in recipientDto.Preferences ?? [])
            {
                if (string.IsNullOrWhiteSpace(description))
                {
                    continue;
                }

                var preference = await _orderRepository.GetOrCreatePreferenceAsync(description);
                recipient.RecipientPreferences.Add(new RecipientPreference { Preference = preference });
            }

            draft.Recipients.Add(recipient);
        }
    }

    private async Task ApplyAddressesAsync(Order draft, int customerId, UpdateOrderRequest request)
    {
        if (request.InvoiceAddressId is int invoiceId)
        {
            if (!await _orderRepository.AddressBelongsToCustomerAsync(invoiceId, customerId))
            {
                throw new InvalidOperationException("Invalid invoice address.");
            }
            draft.InvoiceAddressId = invoiceId;
        }

        if (request.DeliveryAddressId is int shippingId)
        {
            if (!await _orderRepository.AddressBelongsToCustomerAsync(shippingId, customerId))
            {
                throw new InvalidOperationException("Invalid shipping address.");
            }
            draft.ShippingAddressId = shippingId;
        }
    }

    private static void ApplyConfirmation(Order draft, UpdateOrderRequest request)
    {
        if (request.Status is null)
        {
            return;
        }

        if (request.Status != "Received")
        {
            throw new InvalidOperationException("Only confirmation to Received is allowed.");
        }
        if (draft.OrderDishes.Count == 0)
        {
            throw new InvalidOperationException("Order needs at least one dish.");
        }
        if (draft.Recipients.Count == 0)
        {
            throw new InvalidOperationException("Order needs at least one recipient.");
        }
        if (draft.InvoiceAddressId is null || draft.ShippingAddressId is null)
        {
            throw new InvalidOperationException("Order needs an invoice and shipping address.");
        }

        draft.Status = OrderStatus.Received;
    }
}
