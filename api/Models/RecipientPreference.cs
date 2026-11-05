using Microsoft.EntityFrameworkCore;

namespace api.Models;

[PrimaryKey(nameof(RecipientId), nameof(PreferenceId))]
public class RecipientPreference
{
    public int RecipientId { get; set; }

    public int PreferenceId { get; set; }

    public Recipient Recipient { get; set; } = null!;
    public Preference Preference { get; set; } = null!;
}
