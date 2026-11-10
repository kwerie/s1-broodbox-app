using api.Repositories;
using api.Services.AddressService;
using api.Services.AllergyService;
using api.Services.CustomerService;
using api.Services.DishService;
using api.Services.OrderService;

namespace api.DependencyInjection;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IDishService, DishService>();
        services.AddScoped<IAllergyService, AllergyService>();
        services.AddScoped<IAddressService, AddressService>();

        return services;
    }

    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IDishRepository, DishRepository>();
        services.AddScoped<IAllergyRepository, AllergyRepository>();
        services.AddScoped<IAddressRepository, AddressRepository>();

        return services;
    }
}
