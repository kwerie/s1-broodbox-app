using api.Data;
using api.Data.Seeding;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.DependencyInjection;

public static class PersistenceServiceCollectionExtensions
{
    public static IServiceCollection AddPersistence(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<BroodboxDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("Default")));

        return services;
    }

    public static IServiceCollection AddDatabaseSeeding(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var seedUsers = configuration.GetSection("SeedUsers").Get<List<SeedUser>>() ?? [];

        services.AddScoped(serviceProvider => new DatabaseSeeder(
            serviceProvider.GetRequiredService<BroodboxDbContext>(),
            serviceProvider.GetRequiredService<IPasswordHasher<User>>(),
            seedUsers));

        return services;
    }
}
