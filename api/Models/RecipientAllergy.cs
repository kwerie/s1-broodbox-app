using Microsoft.EntityFrameworkCore;

namespace api.Models;

[PrimaryKey(nameof(RecipientId), nameof(AllergyId))]
public class RecipientAllergy
{
    public int RecipientId { get; set; }

    public int AllergyId { get; set; }

    public Recipient Recipient { get; set; } = null!;
    public Allergy Allergy { get; set; } = null!;
}
