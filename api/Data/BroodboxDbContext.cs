using api.Data.Conversions;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class BroodboxDbContext(DbContextOptions<BroodboxDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Note> Notes => Set<Note>();
    public DbSet<Recipient> Recipients => Set<Recipient>();
    public DbSet<Preference> Preferences => Set<Preference>();
    public DbSet<RecipientPreference> RecipientPreferences => Set<RecipientPreference>();
    public DbSet<Allergy> Allergies => Set<Allergy>();
    public DbSet<RecipientAllergy> RecipientAllergies => Set<RecipientAllergy>();
    public DbSet<Dish> Dishes => Set<Dish>();
    public DbSet<OrderDish> OrderDishes => Set<OrderDish>();
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();
    public DbSet<DishIngredient> DishIngredients => Set<DishIngredient>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();

        modelBuilder.Entity<Customer>()
            .HasOne(customer => customer.User)
            .WithOne(user => user.Customer)
            .HasForeignKey<Customer>(customer => customer.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Note>()
            .HasOne(note => note.Order)
            .WithOne(order => order.Note)
            .HasForeignKey<Note>(note => note.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Address>()
            .HasOne(address => address.Customer)
            .WithMany(customer => customer.Addresses)
            .HasForeignKey(address => address.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Dish>()
            .Property(dish => dish.Price)
            .HasPrecision(10, 2);

        modelBuilder.Entity<OrderDish>()
            .Property(orderDish => orderDish.Quantity)
            .HasDefaultValue(1);

        modelBuilder.Entity<Allergy>()
            .Property(allergy => allergy.Type)
            .HasConversion(new AllergyTypeConverter())
            .HasMaxLength(20);

        modelBuilder.Entity<Order>()
            .Property(order => order.Status)
            .HasConversion(new OrderStatusConverter())
            .HasMaxLength(20);

        modelBuilder.Entity<Order>()
            .Property(order => order.OrderNumber)
            .HasMaxLength(16);

        modelBuilder.Entity<Order>()
            .HasIndex(order => order.OrderNumber)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .HasIndex(order => order.CustomerId)
            .IsUnique()
            .HasFilter("\"Status\" = 'Draft'");

        modelBuilder.Entity<Order>()
            .HasOne(order => order.Customer)
            .WithMany(customer => customer.Orders)
            .HasForeignKey(order => order.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(order => order.InvoiceAddress)
            .WithMany()
            .HasForeignKey(order => order.InvoiceAddressId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(order => order.ShippingAddress)
            .WithMany()
            .HasForeignKey(order => order.ShippingAddressId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
