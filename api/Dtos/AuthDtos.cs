using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public record LoginRequest(
    [Required][EmailAddress] string Email,
    [Required] string Password);

public record AuthResponse(string Token);
