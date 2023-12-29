using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

        public async Task<IList<string>> GetAllPermissionByUserId(ApplicationUser user)
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
    }
}
