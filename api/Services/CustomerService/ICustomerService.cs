namespace api.Services.CustomerService;

public interface ICustomerService
{
    Task<Models.Customer?> GetCustomerByIdAsync(int customerId);
}

