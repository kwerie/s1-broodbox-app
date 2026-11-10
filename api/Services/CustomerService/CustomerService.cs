using api.Repositories;

namespace api.Services.CustomerService;

public class CustomerService(
    ICustomerRepository _customerRepository
) : ICustomerService
{
    public Task<Models.Customer?> GetCustomerByIdAsync(int customerId)
    {
        return _customerRepository.GetCustomerByIdAsync(customerId);
    }
}

