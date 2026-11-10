using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class AllergyRepository(BroodboxDbContext _dbContext) : IAllergyRepository
{
    public async Task<IEnumerable<Allergy>> GetAllergiesAsync() =>
        await _dbContext.Allergies.OrderBy(allergy => allergy.Type).ToListAsync();
}
