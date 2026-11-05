using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Data.Seeding;

public class DatabaseSeeder(
    BroodboxDbContext dbContext,
    IPasswordHasher<User> passwordHasher,
    IReadOnlyList<SeedUser> seedUsers)
{
    public async Task SeedAsync()
    {
        foreach (var seedUser in seedUsers)
        {
            var user = await dbContext.Users.SingleOrDefaultAsync(existing => existing.Email == seedUser.Email);
            if (user is null)
            {
                user = new User { Email = seedUser.Email };
                dbContext.Users.Add(user);
            }

            user.Role = seedUser.Role;
            user.Password = passwordHasher.HashPassword(user, seedUser.Password);
        }

        await dbContext.SaveChangesAsync();
    }
}
