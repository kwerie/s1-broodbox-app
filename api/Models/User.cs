using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

public class User
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string Password { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Role { get; set; } = string.Empty;

    public Customer? Customer { get; set; }
}
