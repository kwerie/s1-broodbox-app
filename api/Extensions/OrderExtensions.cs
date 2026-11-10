using api.Dtos;
using api.Models;

namespace api.Extensions;

public static class OrderExtensions
{
    public static DishDto AsDto(this Dish dish)
    {
        return new DishDto(
            dish.Id,
            dish.Name,
            dish.PreparationTime,
            dish.Price
        );
    }

    public static OrderDishResponse AsDto(this OrderDish orderDish)
    {
        return new OrderDishResponse(
            orderDish.Dish.AsDto(),
            orderDish.Quantity
        );
    }

    public static AddressResponse AsDto(this Address address)
    {
        return new AddressResponse(
            address.Id,
            address.Street,
            address.HouseNumber,
            address.Addition,
            address.PostalCode,
            address.City,
            address.IsDefaultInvoice,
            address.IsDefaultShipping
        );
    }

    public static AllergyResponse AsDto(this Allergy allergy)
    {
        return new AllergyResponse(
            allergy.Id,
            allergy.Type,
            allergy.Description
        );
    }

    public static PreferenceResponse AsDto(this Preference preference)
    {
        return new PreferenceResponse(
            preference.Id,
            preference.Description
        );
    }

    public static RecipientResponse AsDto(this Recipient recipient)
    {
        return new RecipientResponse(
            recipient.Id,
            recipient.Name,
            recipient.LockerNumber,
            [.. recipient.RecipientAllergies.Select(recipientAllergy => recipientAllergy.Allergy.AsDto())],
            [.. recipient.RecipientPreferences.Select(rp => rp.Preference.AsDto())]
        );
    }

    public static OrderDto AsDto(this Order order)
    {
        return new OrderDto(
            order.Id,
            order.OrderNumber,
            order.Customer.Name,
            order.Customer.CompanyName,
            order.OrderedAt,
            order.Status,
            [.. order.OrderDishes.Select(orderDish => orderDish.AsDto())],
            [.. order.Recipients.Select(recipient => recipient.AsDto())],
            order.ShippingAddress?.AsDto(),
            order.InvoiceAddress?.AsDto(),
            order.Note?.Description
        );
    }
}

