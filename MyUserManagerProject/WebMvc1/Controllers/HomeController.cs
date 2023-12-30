using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebMvc1.Authorization;
using WebMvc1.Data;
using WebMvc1.Models;

namespace WebMvc1.Controllers
{
    
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IAuthorizationService _authorizationService;

        public HomeController(
            ILogger<HomeController> logger,
            IAuthorizationService authorizationService)
        {
            _logger = logger;
            _authorizationService = authorizationService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        #region �Զ���������ȨУ��
        [MyAuthorize(Constants.OperationName.Create)]
        public async Task<IActionResult> TestCreate()
        {
            //var isAuthorized = await _authorizationService.AuthorizeAsync(User, "����", new OperationAuthorizationRequirement { Name = Constants.OperationName.Create });
            //if (!isAuthorized.Succeeded)
            //{
            //    return Forbid();
            //}
            return await Task.FromResult(Content("���Դ�������"));
        }

        [MyAuthorize(Constants.OperationName.Update)]
        public async Task<IActionResult> TestUpdate()
        {
            //var isAuthorized = await _authorizationService.AuthorizeAsync(User, "����", new OperationAuthorizationRequirement { Name = Constants.OperationName.Update });
            //if (!isAuthorized.Succeeded)
            //{
            //    return Forbid();
            //}
            return await Task.FromResult(Content("�����޸�����"));
        }

        [MyAuthorize(Constants.OperationName.Delete)]
        public async Task<IActionResult> TestDelete()
        {
            //var isAuthorized = await _authorizationService.AuthorizeAsync(User, "����", new OperationAuthorizationRequirement { Name = Constants.OperationName.Delete });
            //if (!isAuthorized.Succeeded)
            //{
            //    return Forbid();
            //}
            return await Task.FromResult(Content("����ɾ������"));
        }

        [MyAuthorize(Constants.OperationName.Approve)]
        public async Task<IActionResult> TestApprove()
        {
            //var isAuthorized = await _authorizationService.AuthorizeAsync(User, "����", new OperationAuthorizationRequirement { Name = Constants.OperationName.Approve });
            //if (!isAuthorized.Succeeded)
            //{
            //    return Forbid();
            //}
            return await Task.FromResult(Content("������������"));
        }

        [MyAuthorize(Constants.OperationName.Reject)]
        public async Task<IActionResult> TestReject()
        {
            //var isAuthorized = await _authorizationService.AuthorizeAsync(User, "����", new OperationAuthorizationRequirement { Name = Constants.OperationName.Reject });
            //if (!isAuthorized.Succeeded)
            //{
            //    return Forbid();
            //}
            return await Task.FromResult(Content("���Ծܾ�����"));
        }

        [MyAuthorize(Constants.OperationName.Create, Constants.OperationName.Update, Constants.OperationName.Delete, Constants.OperationName.Approve, Constants.OperationName.Reject)]
        public async Task<IActionResult> TestRead()
        {
            return await Task.FromResult(Content("���Զ�ȡ����"));
        }

        [MyAuthorize(true, Constants.OperationName.Create, Constants.OperationName.Update, Constants.OperationName.Approve)]
        public async Task<IActionResult> TestReadV2()
        {
            return await Task.FromResult(Content("���Զ�ȡ����V2"));
        } 
        #endregion

        #region ��ɫ��ȨУ��
        [Authorize(Roles = Constants.NormalUserRole)]
        public async Task<IActionResult> TestNormalUserRole()
        {
            return await Task.FromResult(Content("���԰���ɫ����-NormalUserRole"));
        }

        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> TestAdminRole()
        {
            return await Task.FromResult(Content("���԰���ɫ����-AdminRole"));
        }

        [Authorize(Roles = Constants.SuperAdminRole)]
        public async Task<IActionResult> TestSuperAdminRole()
        {
            return await Task.FromResult(Content("���԰���ɫ����-SuperAdminRole"));
        }

        [Authorize(Roles = $"{Constants.AdminRole}, {Constants.SuperAdminRole}")]
        public async Task<IActionResult> TestMoreAdminRole()
        {
            return await Task.FromResult(Content("���԰���ɫ����-AdminRole��SuperAdminRole"));
        }

        [Authorize(Constants.MoreAdmin)]//ʹ��Policy�����ö����ɫ������Ȩ
        public async Task<IActionResult> TestMoreAdminRoleV2()
        {
            return await Task.FromResult(Content("���԰���ɫ����-AdminRole��SuperAdminRole V2"));
        } 
        #endregion
    }
}
