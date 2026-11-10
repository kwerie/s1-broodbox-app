namespace api.Dtos;

public record AddressResponse(
    int Id,
    string Street,
    int HouseNumber,
    string? Addition,
    string PostalCode,
    string City
);

