using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using WebMvc1.Data;

namespace WebMvc1.Authorization
{
    public class MyAuthorizationHandler : AuthorizationHandler<MyAuthorizeAttribute>
    {
        PermissionManager _permissionManager;

        public MyAuthorizationHandler(PermissionManager permissionManager)
        {
            _permissionManager = permissionManager;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, MyAuthorizeAttribute requirement)
        {
            var isHasPermission = await _permissionManager.IsHasPermissionAsync(context.User, requirement.Permissions, requirement.RequireAllPermissions);
            if (isHasPermission)
            {
                context.Succeed(requirement);
            }
        }

        //protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, MyAuthorizeAttribute requirement)
        //{
        //    var isRequireAll = requirement.RequireAllPermissions;//TODO...

        //    if (context.User.IsInRole(Constants.NormalUserRole))
        //    {
        //        _logger.LogInformation(Constants.NormalUserRole);

        //        if (requirement.Permissions.Contains(Constants.OperationName.Create) ||
        //            requirement.Permissions.Contains(Constants.OperationName.Update) ||
        //            requirement.Permissions.Contains(Constants.OperationName.Delete))
        //        {
        //            context.Succeed(requirement);
        //        }
        //    }
        //    else if (context.User.IsInRole(Constants.AdminRole))
        //    {
        //        _logger.LogInformation(Constants.AdminRole);

        //        if (requirement.Permissions.Contains(Constants.OperationName.Approve) ||
        //            requirement.Permissions.Contains(Constants.OperationName.Reject))
        //        {
        //            context.Succeed(requirement);
        //        }
        //    }
        //    else if (context.User.IsInRole(Constants.SuperAdminRole))
        //    {
        //        _logger.LogInformation(Constants.SuperAdminRole);

        //        if (requirement.Permissions.Contains(Constants.OperationName.Create) ||
        //            requirement.Permissions.Contains(Constants.OperationName.Update) ||
        //            requirement.Permissions.Contains(Constants.OperationName.Delete) ||
        //            requirement.Permissions.Contains(Constants.OperationName.Approve) ||
        //            requirement.Permissions.Contains(Constants.OperationName.Reject))
        //        {
        //            context.Succeed(requirement);
        //        }
        //    }
        //    return Task.CompletedTask;
        //}
    }
}
