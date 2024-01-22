using System.ComponentModel;
using System;

namespace WebMvc.Models
{
    public class UserModel
    {
        public int Id { get; set; }

        [Description("User Name")]
        public string UserName { get; set; }

        [Description("Email Address")]
        public string EmailAddress { get; set; }

        public string Password { get; set; }

        [Description("Surname")]
        public string Surname { get; set; }

        [Description("Name")]
        public string Name { get; set; }

        [Description("Age")]
        public int Age { get; set; }

        [Description("Default Lanuage")]
        public string DefaultLanuage { get; set; }

        [Description("Address")]
        public string Address { get; set; }

        [Description("Phone Number")]
        public string PhoneNumber { get; set; }

        [Description("Create Time")]
        public DateTime CreateTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}
