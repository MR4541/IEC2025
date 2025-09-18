import os
from dotenv import load_dotenv
from flask import Flask, request, abort
from linebot.v3.webhook import WebhookHandler, Event
from linebot.v3.exceptions import InvalidSignatureError
from linebot.v3.messaging.models import TextMessage
from linebot import LineBotApi, WebhookHandler
from linebot.models import (
    MessageEvent, 
    TextMessage, 
    TextSendMessage,
    ImageSendMessage)
from linebot.exceptions import InvalidSignatureError
import logging
import requests # HTTP POST
import markdown_text_clean

# 加載 .env 文件中的變數
load_dotenv(".env")

# 從環境變數中讀取 LINE 的 Channel Access Token 和 Channel Secret
line_token = os.getenv('LINE_TOKEN')
line_secret = os.getenv('LINE_SECRET')
next_public_server_host = os.getenv('NEXT_PUBLIC_SERVER_HOST')

# volatile 儲存用戶 ID 和對話紀錄
KNOWN_USERS = {}

# 檢查是否設置了環境變數
if not line_token or not line_secret:
    print(f"LINE_TOKEN: {line_token}")  # 調試輸出
    print(f"LINE_SECRET: {line_secret}")  # 調試輸出
    raise ValueError("LINE_TOKEN 或 LINE_SECRET 未設置")

# 初始化 LineBotApi 和 WebhookHandler
line_bot_api = LineBotApi(line_token)
handler = WebhookHandler(line_secret)

# 創建 Flask 應用
app = Flask(__name__)

app.logger.setLevel(logging.DEBUG)

# 設置一個路由來處理 LINE Webhook 的回調請求
@app.route("/", methods=['POST'])
def callback():
    # 取得 X-Line-Signature 標頭
    signature = request.headers['X-Line-Signature']

    # 取得請求的原始內容
    body = request.get_data(as_text=True)
    app.logger.info(f"Request body: {body}")

    # 驗證簽名並處理請求
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)

    return 'OK'

# 設置一個事件處理器來處理 TextMessage 事件
@handler.add(MessageEvent, message=TextMessage)
def handle_message(event: Event):
    if event.message.type == "text":
        user_message = str(event.message.text)  # 使用者的訊息
        app.logger.info(f"收到的訊息: {user_message}")
        if user_message == "$ man IEC2025_bot":
            reply_text = """您好，這裡是慧流小舖的 LINE Bot，使用方式如下：
1. 透過下方的圖文選單前往本服務的介紹與使用說明
2. 使用 AI 財務分析功能，請發送以 \"[AI] \" 開頭的訊息
3. 本服務會紀錄開機後對話的人員，若伺服器有通知或警示會在此發送訊息
4. 如要測試警示功能是否有作用，請使用 \"$ test\""""
            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(text=reply_text)
            )
        elif user_message.startswith("[AI] "):
            user_input = user_message[5:]
            try:
                user_id = str(event.source.user_id)
            except:
                user_id = None
            print(f"user: {user_id}")
            # use push_message because LINE Bot can't reply_message() twice :(
            line_bot_api.push_message(user_id, TextSendMessage("生成 AI 分析可能需要十幾秒的時間，請稍後..."))
            
            # add this msg to history
            if user_id not in KNOWN_USERS:
                KNOWN_USERS[user_id] = []
            KNOWN_USERS[user_id].append({'role':'user', 'content':user_input})
            print(KNOWN_USERS[user_id])
            # send POST to backend AI
            payload = {
                'stream': False,
                'messages': [{'role':'user','content':user_input}]
            }
            try:
                res = requests.post(f"http://{next_public_server_host}/analysis", json=payload)
                reply_text = markdown_text_clean.clean_text(res.text)
                line_bot_api.reply_message(
                    event.reply_token,
                    TextSendMessage(text=reply_text)
                )
                KNOWN_USERS[user_id].append({'role':'assistant', 'content':reply_text})
            except:
                line_bot_api.reply_message(
                    event.reply_token,
                    TextSendMessage(text="[AI] 連接或生成分析失敗！")
                )
                # remove user input
                KNOWN_USERS[user_id].pop()
        elif user_message == "$ test":
            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(text="警示系統建置中...")
            )
            pass
        else:
            # 使用 GPT 生成回應
            reply_text = ("你說了：" + user_message)

            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(text=reply_text)
            )
    # debug
    print("===============",KNOWN_USERS,"================",sep="\n\n")

# 應用程序入口點
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=6000)
