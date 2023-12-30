using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using WebMvc1.Data;

namespace WebMvc1.Authorization
{
    public class MyViewAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, bool>
    {
        PermissionManager _permissionManager;

        public MyViewAuthorizationHandler(PermissionManager permissionManager)
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
