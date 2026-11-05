using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Allergy
{
    public int Id { get; set; }

    [MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Description { get; set; } = string.Empty;

    public ICollection<RecipientAllergy> RecipientAllergies { get; set; } = new List<RecipientAllergy>();
}
