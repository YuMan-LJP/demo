from flask import Flask, request #需要先安装 pip install flask
app = Flask(__name__)

@app.route("/")
def welcome():
    return "Hello World!"

# 测试Get请求，启动后网址输入：http://192.168.1.234:866/home?jsonInput=123
@app.route("/home")
def home():
    strinput = request.args.get("jsonInput")
    return strinput

# 测试Post请求，启动后网址输入：http://192.168.1.234:866/register，表单填写：key:name,value:123
@app.route('/register', methods=['POST'])
def register():
    print(request.headers)
    # print(request.stream.read()) # 读表单的话就不要用，否则下面的form取不到数据
    print(request.form)
    print(request.form['name'])
    print(request.form.get('name'))
    print(request.form.getlist('name'))
    print(request.form.get('nickname', default='little apple'))
    return 'welcome'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=866, debug=True)