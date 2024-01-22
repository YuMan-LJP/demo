
using Common;
using Common.ObjectExtension;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace ConsoleApp.CompareTest
{
    public class UserModel
    {
        [ObjectValuePropertyIgnore]//忽略作为Value属性比较
        public int Id { get; set; }

        [ObjectKeyProperty]//设置为Key属性比较
        public string UserName { get; set; }

        [ObjectKeyProperty]//设置为Key属性比较
        public string EmailAddress { get; set; }

        public string Surname { get; set; }

        public string Name { get; set; }

        public int Age { get; set; }

        public string DefaultLanuage { get; set; }

        public string Address { get; set; }

        public string PhoneNumber { get; set; }

        public string CreateMD5()
        {
            var siginObj = new
            {
                Surname,
                Name,
                Age,
                DefaultLanuage,
                Address,
                PhoneNumber
            };
            return SecurityHelper.MD5EncryptByUTF8(JsonConvert.SerializeObject(siginObj));
        }
    }
}
