using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.Dtos;

public record DishDto(
        int Id,
        string Name,
        int PreparationTime,
        decimal Price
);

// TODO: naming things
public record OrderDishDto(
    [Required] int DishId,
    [Required] int Quantity
);

public record RecipientDto(
    [Required] string Name,
    [Required] string LockerNumber,
    int[]? AllergyIds,
    string[]? Preferences
);

public record UpdateOrderRequest(
    [MinLength(1)] OrderDishDto[]? Dishes,
    RecipientDto[]? Recipients,
    int? DeliveryAddressId,
    int? InvoiceAddressId,
    string? Status
);

public record OrderDto(
    int Id,
    string OrderNumber,
    string CustomerName,
    string CompanyName,
    DateTime OrderedAt,
    OrderStatus Status,
    OrderDishResponse[] Dishes,
    RecipientResponse[] Recipients,
    AddressResponse? DeliveryAddress,
    AddressResponse? InvoiceAddress,
    string? Note
);

public record OrderDishResponse(
    DishDto Dish,
    int Quantity
);

public record RecipientResponse(
    int Id,
    string Name,
    string LockerNumber,
    AllergyResponse[] Allergies,
    PreferenceResponse[] Preferences
);

public record AllergyResponse(
    int Id,
    AllergyType Type,
    string Description
);

public record PreferenceResponse(
    int Id,
    string Description
);
