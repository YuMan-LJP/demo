using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebMvc1.Data;

namespace WebMvc1.Authorization
{
    public class PermissionManager
    {
        ILogger<MyAuthorizationHandler> _logger;
        ApplicationDbContext _context;
        UserManager<ApplicationUser> _userManager;

        public PermissionManager(
            ILogger<MyAuthorizationHandler> logger,
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<IList<string>> GetAllPermissionByUserIdAsync(ApplicationUser user)
        {
            try
            {
                var roles = await _userManager.GetRolesAsync(user);
                var queryRoleId = _context.Set<IdentityRole>().Where(w => roles.Any(a => a == w.Name)).Select(s => s.Id);
                return await _context.Set<MyPermission>().Where(w => queryRoleId.Any(a => a == w.RoleId)).Select(s => s.Name).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
            return new List<string>();
        }

        public async Task<bool> IsHasPermissionAsync(ClaimsPrincipal claimsPrincipal, string[] requestPermissions, bool isRequireAll)
        {
            if (claimsPrincipal == null)
            {
                return false;
            }

            var user = await _userManager.GetUserAsync(claimsPrincipal);
            if (user == null)
            {
                return false;//用户没有登录需要登录
            }

            if (requestPermissions.Length == 0)
            {
                return true;//当没有标记权限时，只要验证登录即可访问
            }

            var permissions = await GetAllPermissionByUserIdAsync(user);
            if (permissions.Count == 0)
            {
                return false;
            }

            _logger.LogInformation($"当前用户拥有的权限：{string.Join("|", permissions)}");

            var intersectList = requestPermissions.Intersect(permissions).ToList();//请求的权限和用户拥有的权限交集
            if (isRequireAll)
            {
                //要满足标记的全部权限才能通过
                if (intersectList.Count == requestPermissions.Length)
                {
                    return true;
                }
            }
            else
            {
                //只要满足至少一个权限即可通过
                if (intersectList.Count > 0)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
