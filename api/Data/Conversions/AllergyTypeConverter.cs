using api.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace api.Data.Conversions;

public class AllergyTypeConverter : ValueConverter<AllergyType, string>
{
    private static readonly IReadOnlyDictionary<AllergyType, string> Labels = new Dictionary<AllergyType, string>
    {
        [AllergyType.Gluten] = "Gluten",
        [AllergyType.Crustaceans] = "Crustaceans",
        [AllergyType.Eggs] = "Eggs",
        [AllergyType.Fish] = "Fish",
        [AllergyType.Peanuts] = "Peanuts",
        [AllergyType.Soybeans] = "Soybeans",
        [AllergyType.Milk] = "Milk",
        [AllergyType.Nuts] = "Nuts",
        [AllergyType.Celery] = "Celery",
        [AllergyType.Mustard] = "Mustard",
        [AllergyType.Sesame] = "Sesame",
        [AllergyType.Sulphites] = "Sulphites",
        [AllergyType.Lupin] = "Lupin",
        [AllergyType.Molluscs] = "Molluscs",
    };

    private static readonly IReadOnlyDictionary<string, AllergyType> Values =
        Labels.ToDictionary(pair => pair.Value, pair => pair.Key);

    public AllergyTypeConverter() : base(
        type => Labels[type],
        label => Values[label])
    {
    }
}
