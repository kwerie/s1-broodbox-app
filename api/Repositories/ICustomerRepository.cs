namespace api.Repositories;

public interface ICustomerRepository
{
    Task<Models.Customer?> GetCustomerByIdAsync(int customerId);
}

