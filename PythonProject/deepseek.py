from openai import OpenAI #需要先安装 pip install OpenAI

client = OpenAI(api_key="sk-cac4a9b7ce874b3d966d87473b40100c", base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "你好"},
    ],
    stream=False
)

print(response.choices[0].message.content)
