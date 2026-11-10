using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public record AddressResponse(
    int Id,
    string Street,
    int HouseNumber,
    string? Addition,
    string PostalCode,
    string City,
    bool IsDefaultInvoice,
    bool IsDefaultShipping
);

public record CreateAddressRequest(
    [Required] string Street,
    [Required] int HouseNumber,
    string? Addition,
    [Required] string PostalCode,
    [Required] string City
);

public record UpdateAddressRequest(
    [Required] string Street,
    [Required] int HouseNumber,
    string? Addition,
    [Required] string PostalCode,
    [Required] string City
);

public record SetDefaultAddressRequest(bool? Invoice, bool? Shipping);
