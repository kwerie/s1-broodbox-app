using api.Models;
using api.Services;
using Microsoft.EntityFrameworkCore;

namespace api.Data.Seeding;

public class SampleDataSeeder(BroodboxDbContext dbContext)
{
    public async Task SeedAsync()
    {
        var catalog = new SeedCatalog(
            await EnsureDishesAsync(),
            await EnsureAllergiesAsync(),
            await EnsurePreferencesAsync());

        foreach (var profile in CustomerProfiles)
        {
            await SeedCustomerAsync(profile, catalog);
        }

        await dbContext.SaveChangesAsync();
    }

    private async Task SeedCustomerAsync(CustomerProfile profile, SeedCatalog catalog)
    {
        var user = await dbContext.Users
            .Include(existing => existing.Customer)
            .FirstOrDefaultAsync(existing => existing.Email == profile.Email);

        if (user is null)
        {
            return;
        }

        var customer = user.Customer;
        if (customer is null)
        {
            customer = CreateCustomer(user, profile);
            dbContext.Customers.Add(customer);
        }

        if (await dbContext.Orders.AnyAsync(order => order.CustomerId == customer.Id))
        {
            return;
        }

        var address = await dbContext.Addresses
            .FirstOrDefaultAsync(existing => existing.CustomerId == customer.Id);
        if (address is null)
        {
            address = CreateAddress(customer, profile.Address);
            dbContext.Addresses.Add(address);
        }

        var orderedAt = DateTime.UtcNow;
        foreach (var order in profile.Orders)
        {
            dbContext.Orders.Add(CreateOrder(customer, address, orderedAt, order, catalog));
        }
    }

    private static Customer CreateCustomer(User user, CustomerProfile profile) => new()
    {
        UserId = user.Id,
        Name = profile.Name,
        CustomerNumber = profile.CustomerNumber,
        CompanyName = profile.CompanyName,
    };

    private static Address CreateAddress(Customer customer, AddressProfile address) => new()
    {
        Customer = customer,
        Type = "primary",
        IsDefaultShipping = true,
        IsDefaultInvoice = true,
        Street = address.Street,
        HouseNumber = address.HouseNumber,
        PostalCode = address.PostalCode,
        City = address.City,
    };

    private static Order CreateOrder(
        Customer customer,
        Address address,
        DateTime orderedAt,
        OrderProfile order,
        SeedCatalog catalog)
    {
        var recipient = new Recipient
        {
            Name = order.RecipientName,
            LockerNumber = order.LockerNumber,
        };

        foreach (var allergyType in order.Allergies)
        {
            recipient.RecipientAllergies.Add(new RecipientAllergy { Allergy = catalog.Allergies[allergyType] });
        }

        foreach (var preference in order.Preferences)
        {
            recipient.RecipientPreferences.Add(new RecipientPreference { Preference = catalog.Preferences[preference] });
        }

        var placedAt = orderedAt.Add(order.Offset);

        return new Order
        {
            Customer = customer,
            OrderNumber = OrderNumberGenerator.Generate(placedAt),
            OrderedAt = placedAt,
            Status = order.Status,
            InvoiceAddress = address,
            ShippingAddress = address,
            Note = order.Allergies.Count > 0 ? new Note { Description = "bevat allergieën" } : null,
            OrderDishes = { new OrderDish { Dish = catalog.Dishes[order.DishName], Quantity = order.Quantity } },
            Recipients = { recipient },
        };
    }

    private async Task<IReadOnlyDictionary<string, Dish>> EnsureDishesAsync()
    {
        var wanted = new[]
        {
            new Dish { Name = "Broodje Gezond", PreparationTime = 8, Price = 4.95m },
            new Dish { Name = "Broodje Kaas", PreparationTime = 5, Price = 3.50m },
            new Dish { Name = "Broodje Kroket", PreparationTime = 6, Price = 3.75m },
            new Dish { Name = "Broodje Ham", PreparationTime = 5, Price = 3.95m },
            new Dish { Name = "Yoghurt met granola", PreparationTime = 4, Price = 3.95m },
            new Dish { Name = "Vers fruitsalade", PreparationTime = 5, Price = 4.25m },
            new Dish { Name = "Croissant", PreparationTime = 3, Price = 2.50m },
            new Dish { Name = "Wentelteefjes", PreparationTime = 10, Price = 5.50m },
            new Dish { Name = "Omelet", PreparationTime = 8, Price = 4.75m },
            new Dish { Name = "Havermout met fruit", PreparationTime = 6, Price = 3.75m },
            new Dish { Name = "Tomatensoep", PreparationTime = 5, Price = 4.25m },
            new Dish { Name = "Pompoensoep", PreparationTime = 5, Price = 4.50m },
            new Dish { Name = "Caesarsalade", PreparationTime = 10, Price = 6.95m },
            new Dish { Name = "Quiche Lorraine", PreparationTime = 12, Price = 5.75m },
            new Dish { Name = "Kip wrap", PreparationTime = 8, Price = 5.25m },
            new Dish { Name = "Pastasalade", PreparationTime = 9, Price = 5.95m },
        };

        return await UpsertAsync(
            wanted,
            dish => dish.Name,
            dbContext.Dishes,
            (target, source) =>
            {
                target.PreparationTime = source.PreparationTime;
                target.Price = source.Price;
            });
    }

    private async Task<IReadOnlyDictionary<AllergyType, Allergy>> EnsureAllergiesAsync()
    {
        var wanted = new[]
        {
            new Allergy { Type = AllergyType.Gluten, Description = "Bevat glutenbevattende granen" },
            new Allergy { Type = AllergyType.Crustaceans, Description = "Bevat schaaldieren" },
            new Allergy { Type = AllergyType.Eggs, Description = "Bevat eieren" },
            new Allergy { Type = AllergyType.Fish, Description = "Bevat vis" },
            new Allergy { Type = AllergyType.Peanuts, Description = "Bevat pinda's" },
            new Allergy { Type = AllergyType.Soybeans, Description = "Bevat soja" },
            new Allergy { Type = AllergyType.Milk, Description = "Bevat melk (lactose)" },
            new Allergy { Type = AllergyType.Nuts, Description = "Bevat noten" },
            new Allergy { Type = AllergyType.Celery, Description = "Bevat selderij" },
            new Allergy { Type = AllergyType.Mustard, Description = "Bevat mosterd" },
            new Allergy { Type = AllergyType.Sesame, Description = "Bevat sesamzaad" },
            new Allergy { Type = AllergyType.Sulphites, Description = "Bevat zwaveldioxide en sulfiet" },
            new Allergy { Type = AllergyType.Lupin, Description = "Bevat lupine" },
            new Allergy { Type = AllergyType.Molluscs, Description = "Bevat weekdieren" },
        };

        return await UpsertAsync(
            wanted,
            allergy => allergy.Type,
            dbContext.Allergies,
            (_, _) => { });
    }

    private async Task<IReadOnlyDictionary<string, Preference>> EnsurePreferencesAsync()
    {
        var wanted = new[]
        {
            new Preference { Description = "Vegetarisch" },
            new Preference { Description = "Glutenvrij brood" },
            new Preference { Description = "Extra saus" },
        };

        return await UpsertAsync(
            wanted,
            preference => preference.Description,
            dbContext.Preferences,
            (_, _) => { });
    }

    private static async Task<IReadOnlyDictionary<TKey, TEntity>> UpsertAsync<TEntity, TKey>(
        IReadOnlyList<TEntity> wanted,
        Func<TEntity, TKey> keySelector,
        DbSet<TEntity> set,
        Action<TEntity, TEntity> update)
        where TEntity : class
        where TKey : notnull
    {
        var existing = await set.ToListAsync();

        var result = new Dictionary<TKey, TEntity>();
        foreach (var entity in wanted)
        {
            var key = keySelector(entity);
            var match = existing.FirstOrDefault(current => keySelector(current).Equals(key));
            if (match is null)
            {
                set.Add(entity);
                result[key] = entity;
            }
            else
            {
                update(match, entity);
                result[key] = match;
            }
        }

        return result;
    }

    private static readonly IReadOnlyList<CustomerProfile> CustomerProfiles =
    [
        new CustomerProfile(
            "customer@broodbox.test",
            "Jan Jansen",
            "KL-0001",
            "Broodbox Demo BV",
            new AddressProfile("Dorpsstraat", 12, "1234 AB", "Utrecht"),
            [
                new OrderProfile("Broodje Gezond", 3, TimeSpan.FromDays(-7), OrderStatus.Done, "Team Marketing", "A12", Preferences: ["Vegetarisch"]),
                new OrderProfile("Broodje Kaas", 2, TimeSpan.FromDays(-2), OrderStatus.InPreparation, "Team Sales", "B03", Allergies: [AllergyType.Milk]),
                new OrderProfile("Broodje Kroket", 1, TimeSpan.FromHours(-6), OrderStatus.Accepted, "Team Support", "C21"),
                new OrderProfile("Broodje Gezond", 4, TimeSpan.FromMinutes(-30), OrderStatus.Received, "Team Finance", "D07", Allergies: [AllergyType.Nuts], Preferences: ["Glutenvrij brood"]),
            ]),
        new CustomerProfile(
            "customer2@broodbox.test",
            "Pieter de Vries",
            "KL-0002",
            "Lunchroom De Vries",
            new AddressProfile("Kerkweg", 88, "4321 CD", "Rotterdam"),
            [
                new OrderProfile("Broodje Ham", 5, TimeSpan.FromDays(-5), OrderStatus.Done, "Team Logistiek", "E05", Preferences: ["Extra saus"]),
                new OrderProfile("Broodje Kaas", 2, TimeSpan.FromDays(-1), OrderStatus.Accepted, "Team HR", "F11", Allergies: [AllergyType.Gluten], Preferences: ["Glutenvrij brood"]),
                new OrderProfile("Broodje Kroket", 6, TimeSpan.FromHours(-3), OrderStatus.Received, "Team IT", "G09"),
            ]),
    ];

    private sealed record SeedCatalog(
        IReadOnlyDictionary<string, Dish> Dishes,
        IReadOnlyDictionary<AllergyType, Allergy> Allergies,
        IReadOnlyDictionary<string, Preference> Preferences);

    private sealed record CustomerProfile(
        string Email,
        string Name,
        string CustomerNumber,
        string CompanyName,
        AddressProfile Address,
        IReadOnlyList<OrderProfile> Orders);

    private sealed record AddressProfile(
        string Street,
        int HouseNumber,
        string PostalCode,
        string City);

    private sealed record OrderProfile(
        string DishName,
        int Quantity,
        TimeSpan Offset,
        OrderStatus Status,
        string RecipientName,
        string LockerNumber,
        IReadOnlyList<AllergyType> Allergies = null!,
        IReadOnlyList<string> Preferences = null!)
    {
        public IReadOnlyList<AllergyType> Allergies { get; } = Allergies ?? [];
        public IReadOnlyList<string> Preferences { get; } = Preferences ?? [];
    }
}
