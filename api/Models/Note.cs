using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Note
{
    [Key]
    public int OrderId { get; set; }

    [MaxLength(255)]
    public string Description { get; set; } = string.Empty;

    public Order Order { get; set; } = null!;
}
