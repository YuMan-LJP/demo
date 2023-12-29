using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using WebMvc1.Data;

namespace WebMvc1.Authorization
{
    public class MyAuthorizationHandler : AuthorizationHandler<MyAuthorizeAttribute>
    {
        ILogger<MyAuthorizationHandler> _logger;
        UserManager<ApplicationUser> _userManager;
        PermissionManager _permissionManager;

        public MyAuthorizationHandler(
            ILogger<MyAuthorizationHandler> logger,
            UserManager<ApplicationUser> userManager,
            PermissionManager permissionManager)
        {
            _logger = logger;
            _userManager = userManager;
            _permissionManager = permissionManager;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, MyAuthorizeAttribute requirement)
        {
            if (context.User == null)
            {
                return;
            }

            var user = await _userManager.GetUserAsync(context.User);
            if (user == null)
            {
                return;
            }

            var permissions = await _permissionManager.GetAllPermissionByUserId(user);
            if (permissions.Count == 0)
            {
                return;
            }

            _logger.LogInformation($"当前用户拥有的权限：{string.Join("|", permissions)}");

            var isRequireAll = requirement.RequireAllPermissions;
            var intersectList = requirement.Permissions.Intersect(permissions).ToList();//接口要求的权限和用户拥有的权限交集
            if (isRequireAll)
            {
                //要满足标记的全部权限才能通过
                if (intersectList.Count == requirement.Permissions.Length)
                {
                    context.Succeed(requirement);
                }
            }
            else
            {
                //只要满足至少一个权限即可通过
                if (intersectList.Count > 0)
                {
                    context.Succeed(requirement);
                }
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
