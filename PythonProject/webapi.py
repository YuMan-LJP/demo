from flask import Flask, request #需要先安装 pip install flask
from openai import OpenAI #需要先安装 pip install OpenAI
app = Flask(__name__)

@app.route("/")
def welcome():
    return "Hello World!"

@app.route("/aichat")
def aichat():
    if(len(request.args) == 0):
        return "请输入文本"
    strinput = request.args.get("text")
    if(strinput == ""):
        return "请输入文本"
    return deepseek(strinput)

def deepseek(text):
    client = OpenAI(api_key="sk-cac4a9b7ce874b3d966d87473b40100c", base_url="https://api.deepseek.com")
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "You are a helpful assistant"},
            {"role": "user", "content": text},
        ],
        stream=False
    )
    print(response.json())
    return response.choices[0].message.content

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=866, debug=True)

#测试 http://192.168.1.234:866/aichat?text=3.11和3.2哪个大