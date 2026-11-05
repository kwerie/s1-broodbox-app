using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public record DishDto(
    [Required] int DishId,
    [Required] int Quantity
);

public record CreateOrderRequest(
        [MinLength(1)] DishDto[] Dishes
);

public record AllergyDto(
    [Required] int Id
);

public record PreferenceDto(
    int? Id,
    [Required] string Description
);


public record RecipientDto(
    [Required] string Name,
    [Required] string Email,
    [Required] string Phone,
    AllergyDto[]? Allergies,
    PreferenceDto[]? Preferences
);

public record UpdateOrderRequest(
    [MinLength(1)] DishDto[]? Dishes,
    RecipientDto[]? Recipients,
    int? DeliveryAddressId,
    int? InvoiceAddressId,
    string? Status
);
