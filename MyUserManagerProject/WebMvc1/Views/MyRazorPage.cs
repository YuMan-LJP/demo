using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace WebMvc1.Views
{
    public abstract class MyRazorPage<TModel> : RazorPage<TModel>
    {
        [RazorInject]
        public IAuthorizationService AuthorizationService { get; set; }

        protected virtual async Task<bool> IsHasPermissionAsync(params string[] permissions)
        {
            var isAuthorized = await AuthorizationService.AuthorizeAsync(User, false, new OperationAuthorizationRequirement { Name = string.Join(",", permissions) });
            return isAuthorized.Succeeded;
        }

        protected virtual async Task<bool> IsHasPermissionAsync(bool isRequireAll, params string[] permissions)
        {
            var isAuthorized = await AuthorizationService.AuthorizeAsync(User, isRequireAll, new OperationAuthorizationRequirement { Name = string.Join(",", permissions) });
            return isAuthorized.Succeeded;
        }
    }
}
