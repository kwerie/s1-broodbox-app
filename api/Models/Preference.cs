using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Preference
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string Description { get; set; } = string.Empty;

    public ICollection<RecipientPreference> RecipientPreferences { get; set; } = new List<RecipientPreference>();
}
