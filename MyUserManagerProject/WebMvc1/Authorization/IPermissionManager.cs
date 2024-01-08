using System.Security.Claims;
using WebMvc1.Data;
using WebMvc1.Dependency;

namespace WebMvc1.Authorization
{
    public interface IPermissionManager : ITransientDependency
    {
        Task<IList<string>> GetAllPermissionByUserIdAsync(ApplicationUser user);

        Task<bool> IsHasPermissionAsync(ClaimsPrincipal claimsPrincipal, string[] requestPermissions, bool isRequireAll);
    }
}
