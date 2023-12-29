using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace WebMvc1.Data
{
    public class ApplicationUser : IdentityUser
    {
        //拓展字段以下三个字段

        [PersonalData]
        public string? CustomTag { get; set; }

        [Required]
        [StringLength(200)]
        [PersonalData]
        public string Name { get; set; } = "";

        [PersonalData]
        public DateTime? Birthday { get; set; }
    }
}
