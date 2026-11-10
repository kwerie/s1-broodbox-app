using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

public class CustomerRepository(
    BroodboxDbContext _dbContext
) : ICustomerRepository
{
    public Task<Customer?> GetCustomerByIdAsync(int customerId)
    {
        return _dbContext.Customers.Where(c => c.UserId == customerId).FirstOrDefaultAsync();
    }
}

