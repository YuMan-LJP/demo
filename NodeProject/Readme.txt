npm init -y
创建server.js
npm i express
npm i connect-history-api-fallback

在与server.js同级下创建一个static文件夹（Vue编译好的 文件放在这个文件夹里面）
app.use(express.static(__dirname+'/static'))

打包方法一：
npm install -g pkg
package.json增加配置如下：
{
    "bin": "app.js",//应用的入口点，例如：server.js
    "pkg": {
    "assets": ["public/**/*", "views/**/*", "static/**/*"]//静态资源配置
    }
}
pkg . -t node18-win-x64 --out-path=dist/
node18-win-x64需要下载，如果下不了开VPN，注意这个node版本会有影响，可以适当降低或提高版本看看哪个可以编译通过

打包方法二：
打包需要安装nexe，然后执行的过程中，需要安装nasm，然后还需要安装Visual Studio的“使用 C++ 进行桌面开发”工作负载或生成工具中的“C++ 生成工具”工作负载
npm install -g nexe
nexe server.js -o test -t windows --build --verbose
https://github.com/nodejs/node/blob/HEAD/BUILDING.md#windows