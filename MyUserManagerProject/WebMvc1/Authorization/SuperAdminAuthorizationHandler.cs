using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using WebMvc1.Data;

namespace WebMvc1.Authorization
{
    [Obsolete("作废，改用特性校验")]
    public class SuperAdminAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, string>
    {
        private readonly ILogger<MyAuthorizationHandler> _logger;

        public SuperAdminAuthorizationHandler(ILogger<MyAuthorizationHandler> logger)
        {
            _logger = logger;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, string resource)
        {
            _logger.LogInformation(resource);

            if (context.User == null || resource == null)
            {
                return Task.CompletedTask;
            }
            if (!context.User.IsInRole(Constants.SuperAdminRole))
            {
                return Task.CompletedTask;
            }
            if (requirement.Name != Constants.OperationName.Create &&
                requirement.Name != Constants.OperationName.Update &&
                requirement.Name != Constants.OperationName.Delete &&
                requirement.Name != Constants.OperationName.Approve &&
                requirement.Name != Constants.OperationName.Reject)
            {
                return Task.CompletedTask;
            }

            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
