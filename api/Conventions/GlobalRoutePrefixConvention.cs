using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace api.Conventions;

public class GlobalRoutePrefixConvention(string prefix) : IApplicationModelConvention
{
    private readonly AttributeRouteModel routePrefix = new(new RouteAttribute(prefix));

    public void Apply(ApplicationModel application)
    {
        foreach (var controller in application.Controllers)
        {
            foreach (var selector in controller.Selectors)
            {
                selector.AttributeRouteModel = selector.AttributeRouteModel is null
                    ? routePrefix
                    : AttributeRouteModel.CombineAttributeRouteModel(routePrefix, selector.AttributeRouteModel);
            }
        }
    }
}
