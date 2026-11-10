namespace api.Services.AllergyService;

public interface IAllergyService
{
    Task<IEnumerable<Models.Allergy>> GetAllergiesAsync();
}
