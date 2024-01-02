(function () {
    //测试
    console.log("UserName", webmvc1.userInfo.userName);
    console.log(webmvc1.constant.operationName.create, webmvc1.permission.isGranted(webmvc1.constant.operationName.create));
    console.log(webmvc1.constant.operationName.update, webmvc1.permission.isGranted(webmvc1.constant.operationName.update));
    console.log(webmvc1.constant.operationName.delete, webmvc1.permission.isGranted(webmvc1.constant.operationName.delete));
    console.log(webmvc1.constant.operationName.approve, webmvc1.permission.isGranted(webmvc1.constant.operationName.approve));
    console.log(webmvc1.constant.operationName.reject, webmvc1.permission.isGranted(webmvc1.constant.operationName.reject));

    if (webmvc1.permission.isGranted(webmvc1.constant.operationName.create)) {
        //TODO...
    }
})();
