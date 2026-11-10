namespace api.Models;

public class Order
{
    public int Id { get; set; }

    public string OrderNumber { get; set; } = null!;

    public DateTime OrderedAt { get; set; }

    public OrderStatus Status { get; set; }

    public int InvoiceAddressId { get; set; }

    public int ShippingAddressId { get; set; }

    public int CustomerId { get; set; }

    public Customer Customer { get; set; } = null!;
    public Address InvoiceAddress { get; set; } = null!;
    public Address ShippingAddress { get; set; } = null!;
    public Note? Note { get; set; }
    public ICollection<Recipient> Recipients { get; set; } = new List<Recipient>();
    public ICollection<OrderDish> OrderDishes { get; set; } = new List<OrderDish>();
}
