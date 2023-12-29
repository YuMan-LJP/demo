using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace WebMvc1.Data
{
    public class MyPermission
    {
        [Key]
        [Required]
        [StringLength(200)]
        public string PermissionId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreationTime { get; set; }

        public string? RoleId { get; set; }

        public virtual IdentityRole? Role { get; set; }

        public string? UserId { get; set; }

        public virtual ApplicationUser? User { get; set; }
    }
}
