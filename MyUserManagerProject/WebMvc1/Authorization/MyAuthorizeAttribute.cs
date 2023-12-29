using Microsoft.AspNetCore.Authorization;

namespace WebMvc1.Authorization
{
    public class MyAuthorizeAttribute : AuthorizeAttribute, IAuthorizationRequirement, IAuthorizationRequirementData
    {
        public MyAuthorizeAttribute(params string[] permissions)
        {
            Permissions = permissions;
        }

        public MyAuthorizeAttribute(bool isRequireAll, params string[] permissions)
        {
            RequireAllPermissions = isRequireAll;
            Permissions = permissions;
        }

        /// <summary>
        /// 声明权限名称
        /// </summary>
        public string[] Permissions { get; set; }

        /// <summary>
        /// 必须满足全部权限才能访问
        /// </summary>
        public bool RequireAllPermissions { get; set; } = false;

        public IEnumerable<IAuthorizationRequirement> GetRequirements()
        {
            yield return this;
        }
    }
}
