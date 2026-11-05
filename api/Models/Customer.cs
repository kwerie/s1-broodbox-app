using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Customer
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(255)]
    public string CustomerNumber { get; set; } = string.Empty;

    [MaxLength(255)]
    public string CompanyName { get; set; } = string.Empty;

    public User User { get; set; } = null!;
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
