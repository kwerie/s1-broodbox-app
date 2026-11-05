using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Address
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    [MaxLength(20)]
    public string Type { get; set; } = string.Empty;

    public bool IsDefaultShipping { get; set; }

    public bool IsDefaultInvoice { get; set; }

    [MaxLength(50)]
    public string Street { get; set; } = string.Empty;

    public int HouseNumber { get; set; }

    [MaxLength(50)]
    public string? Addition { get; set; }

    [MaxLength(10)]
    public string PostalCode { get; set; } = string.Empty;

    [MaxLength(50)]
    public string City { get; set; } = string.Empty;

    public Customer Customer { get; set; } = null!;
}
