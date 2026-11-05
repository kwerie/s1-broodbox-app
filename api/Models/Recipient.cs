using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Recipient
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    [MaxLength(30)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(30)]
    public string LockerNumber { get; set; } = string.Empty;

    public Order Order { get; set; } = null!;
    public ICollection<RecipientPreference> RecipientPreferences { get; set; } = new List<RecipientPreference>();
    public ICollection<RecipientAllergy> RecipientAllergies { get; set; } = new List<RecipientAllergy>();
}
