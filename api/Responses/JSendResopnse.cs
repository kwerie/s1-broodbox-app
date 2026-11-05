using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;

namespace api.Responses;

public abstract class AbstractJSendResponse<T> : IActionResult
{
    public abstract string Status { get; }
    [JsonIgnore]
    public uint StatusCode { get; init; } = 200;
    public T? Data { get; set; }

    public async Task ExecuteResultAsync(ActionContext context)
    {
        var result = new ObjectResult(this)
        {
            StatusCode = (int)StatusCode
        };

        await result.ExecuteResultAsync(context);
    }
}

public class JSendResponse<T> : AbstractJSendResponse<T>
{
    public override string Status { get; }

    public JSendResponse(uint statusCode, string status, T? data)
    {
        StatusCode = statusCode;
        Status = status;
        Data = data;
    }
}

public class SuccessResponse<T>(T? data, uint statusCode = StatusCodes.Status200OK) : JSendResponse<T>(statusCode, "success", data);

public class FailResponse<T> : JSendResponse<T>
{
    public FailResponse(T? data, uint statusCode = StatusCodes.Status400BadRequest) : base(statusCode, "fail", data)
    {
        if (statusCode < 400 || statusCode >= 500)
        {
            throw new ArgumentException("Status code for fail response must be in the range 400-499.");
        }
    }
}

public class ErrorResponse<T> : JSendResponse<T>
{
    public ErrorResponse(T? data, uint statusCode = StatusCodes.Status500InternalServerError) : base(statusCode, "error", data)
    {
        if (statusCode < 500)
        {
            throw new ArgumentException("Status code for fail response must be greater than or equal to 500.");
        }
    }
}

public static class JSend
{
    public static SuccessResponse<T> Success<T>(T? data, uint statusCode = StatusCodes.Status200OK) => new(data, statusCode);

    public static SuccessResponse<object> Success(uint statusCode = StatusCodes.Status200OK) => new(null, statusCode);

    public static FailResponse<T> Fail<T>(T? data, uint statusCode = StatusCodes.Status400BadRequest) => new(data, statusCode);

    public static FailResponse<object> Fail(uint statusCode = StatusCodes.Status400BadRequest) => new(null, statusCode);

    public static ErrorResponse<T> Error<T>(T? data, uint statusCode = StatusCodes.Status500InternalServerError) => new(data, statusCode);

    public static ErrorResponse<object> Error(uint statusCode = StatusCodes.Status500InternalServerError) => new(null, statusCode);
}
