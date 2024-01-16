using IdentityModel.Client;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace TestClient
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("开始测试");

            Console.WriteLine("访问授权认证服务器");
            var client = new HttpClient();
            var disco = await client.GetDiscoveryDocumentAsync("https://localhost:5001");
            if (disco.IsError)
            {
                Console.WriteLine(disco.Error);
                return;
            }

            Console.WriteLine("请求token");
            var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
            {
                Address = disco.TokenEndpoint,

                ClientId = "client",
                ClientSecret = "D0C6E0F9-1A36-43E9-9E25-72240088DE1C",
                Scope = "api1"
            });

            if (tokenResponse.IsError)
            {
                Console.WriteLine(tokenResponse.Error);
                return;
            }

            Console.WriteLine(tokenResponse.Json);

            Console.WriteLine("访问资源服务器");
            var apiClient = new HttpClient();
            apiClient.SetBearerToken(tokenResponse.AccessToken);

            var response = await apiClient.GetAsync("https://localhost:5002/identity");
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine(response.StatusCode);
                Console.WriteLine("失败");
            }
            else
            {
                var content = await response.Content.ReadAsStringAsync();
                Console.WriteLine(content);
                Console.WriteLine("成功");
            }

            Console.ReadLine();
        }
    }
}
