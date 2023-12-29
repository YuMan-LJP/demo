using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace WebMvc1.Data
{
    public static class Constants
    {
        public class OperationName
        {
            public const string Create = "Create";
            public const string Update = "Update";
            public const string Delete = "Delete";
            public const string Approve = "Approve";
            public const string Reject = "Reject";
        }

        public const string NormalUserRole = "NormalUserRole";
        public const string AdminRole = "AdminRole";
        public const string SuperAdminRole = "SuperAdminRole";

        public const string MoreAdmin = "MoreAdmin";
    }
}
