namespace api.Repositories;

public interface IAllergyRepository
{
    Task<IEnumerable<Models.Allergy>> GetAllergiesAsync();
}
