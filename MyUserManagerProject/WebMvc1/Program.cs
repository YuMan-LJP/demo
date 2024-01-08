using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.EntityFrameworkCore;
using WebMvc1.Authorization;
using WebMvc1.Data;
using WebMvc1.Dependency;
using WebMvc1.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(Constants.MoreAdmin, policy => policy.RequireRole(Constants.AdminRole, Constants.SuperAdminRole));//使用Policy来配置多个角色进行授权
});

builder.Services.Configure<IdentityOptions>(options =>
{
    // Default Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Default Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);//锁定时间
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.AccessDeniedPath = "/Identity/Account/AccessDenied";
    options.Cookie.Name = "WebMcv1";
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
    options.LoginPath = "/Identity/Account/Login";
    // ReturnUrlParameter requires 
    //using Microsoft.AspNetCore.Authentication.Cookies;
    options.ReturnUrlParameter = CookieAuthenticationDefaults.ReturnUrlParameter;
    options.SlidingExpiration = true;
});

//知识拓展：
//AddTransient： 每次service请求都是获得不同的实例，暂时性模式：暂时性对象始终不同，无论是不是同一个请求（同一个请求里的不同服务）同一个客户端，每次都是创建新的实例
//AddScoped： 对于同一个请求返回同一个实例，不同的请求返回不同的实例，作用域模式：作用域对象在一个客户端请求中是相同的，但在多个客户端请求中是不同的
//AddSingleton： 每次都是获得同一个实例， 单一实例模式：单一实例对象对每个对象和每个请求都是相同的，可以说是不同客户端不同请求都是相同的
//AddTransient的生命周期：请求获取-（GC回收-主动释放），每一次获取的对象都不是同一个
//AddScoped的生命周期：请求开始-请求结束，在这次请求中获取的对象都是同一个 
//AddSingleton的生命周期：项目启动-项目关闭，相当于静态类，只会有一个  
//权重：
//AddSingleton→AddTransient→AddScoped
//注意：
//由于AddScoped对象是在请求的时候创建的，所以不能在AddSingleton对象中使用，甚至也不能在AddTransient对象中使用

// Authorization handlers.
//builder.Services.AddScoped<IAuthorizationHandler, NormalUserAuthorizationHandler>();//引入普通用户授权校验
//builder.Services.AddSingleton<IAuthorizationHandler, AdminAuthorizationHandler>();//引入管理员用户授权校验
//builder.Services.AddSingleton<IAuthorizationHandler, SuperAdminAuthorizationHandler>();//引入超级管理员授权校验

//builder.Services.AddScoped<IAuthorizationHandler, MyViewAuthorizationHandler>();//引入视图授权校验
//builder.Services.AddScoped<IAuthorizationHandler, MyAuthorizationHandler>();//有连接数据库相关方法注入改用AddScoped，不能用AddSingleton

//builder.Services.AddTransient(typeof(PermissionManager));//引入权限管理类
builder.Services.AddDependencyService();

builder.Services.AddMemoryCache();//引入内存缓存

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();
