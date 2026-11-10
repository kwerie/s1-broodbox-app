using api.Repositories;

namespace api.Services.AllergyService;

public class AllergyService(IAllergyRepository _allergyRepository) : IAllergyService
{
    public Task<IEnumerable<Models.Allergy>> GetAllergiesAsync() => _allergyRepository.GetAllergiesAsync();
}
