using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using WebMvc1.Data;
using WebMvc1.Dependency;

namespace WebMvc1.Authorization
{
    public class MyViewAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, bool>, IScopeDependency
    {
        IPermissionManager _permissionManager;

        public MyViewAuthorizationHandler(IPermissionManager permissionManager)
        {
            _permissionManager = permissionManager;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, bool isRequireAll)
        {
            var isHasPermission =  await _permissionManager.IsHasPermissionAsync(context.User, requirement.Name.Split(','), isRequireAll);
            if (isHasPermission)
            {
                context.Succeed(requirement);
            }
        }
    }
}
