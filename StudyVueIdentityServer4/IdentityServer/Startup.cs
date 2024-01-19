using IdentityServerHost.Quickstart.UI;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddControllers();
            services.AddControllersWithViews();//补充
            services.AddIdentityServer(options =>
            {
                options.UserInteraction = new IdentityServer4.Configuration.UserInteractionOptions
                {
                    LoginUrl = "http://localhost:5003/#/Login",
                    LogoutUrl = "http://localhost:5003/#/Logout",

                };
            })
                .AddDeveloperSigningCredential()
                .AddInMemoryIdentityResources(IdentityConfig.IdentityResources)//声明可以获得的资源
                .AddInMemoryApiScopes(IdentityConfig.ApiScopes)//声明API范围
                .AddInMemoryClients(IdentityConfig.Clients)//声明客户端
                .AddTestUsers(TestUsers.Users);//使用默认测试用户

            //JS-allow Ajax calls to be made from http://localhost:5003 to https://localhost:5001.
            services.AddCors(options =>
            {
                //this defines a CORS policy called "default"
                options.AddPolicy("default", policy =>
                {
                    policy.WithOrigins("http://localhost:5003")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //JS-Add the CORS middleware to the pipeline in Configure:
            app.UseCors("default");

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseIdentityServer();//添加IdentityServer中间件

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapDefaultControllerRoute();//补充
            });
        }
    }
}
