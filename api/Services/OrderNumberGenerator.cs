namespace api.Services;

public static class OrderNumberGenerator
{
    public static string Generate(DateTime timestamp) =>
        timestamp.ToString("ddMMyy-HHmmssfff");
}
