import os
from dotenv import load_dotenv
import requests # HTTP POST
import random

load_dotenv(".env")
next_public_server_host = os.getenv('NEXT_PUBLIC_SERVER_HOST')

NOTIFY_CONTENTS = [
"""【原物料不足通知】
系統檢測：今日 麵包 庫存僅剩 5 份，已低於安全存量。請留意供應情況。""",
"""【自動訂貨進度】
您設定的「生菜 自動補貨」已於 09:30 下單完成，預計明日 07:00 配送到店。""",
"""【庫存異常警示】
異常偵測：鮪魚 使用量於上午 8 點至 9 點激增 100%，請確認是否有大量訂單或庫存紀錄錯誤。""",
"""【系統提醒】
蛋 庫存剩餘 2 盒，依照平均消耗量，預估 1 小時內將用罄。建議立即補貨。""",
"""【訂單完成通知】
自動訂貨單號 #A0921 已完成配送，麵包 50 份 已入庫，請確認實際數量。""",
"""【服務狀態】
本系統將於凌晨 02:00～03:00 進行例行維護，期間可能無法即時查詢庫存。""",
"""【原物料使用統計】
今晨 蛋餅 銷售達 32 份，對應 蛋 消耗 2.5 盒，目前庫存剩餘 1 盒。""",
"""【安全存量警示】
生菜 已低於安全存量 (剩餘 3 份)，已自動觸發緊急補貨程序。""",
"""【自動補貨失敗】
鮪魚 自動訂貨單 #B1132 於供應商端出現異常，訂單未能成立，請人工處理。""",
"""【每日總覽】
截至 11:00：
漢堡：售出 18 份（麵包 -18，蛋 -10，生菜 -5，鮪魚 -10）
沙拉：售出 10 份（生菜 -10，鮪魚 -5，蛋 -2）
總庫存剩餘：麵包 27，生菜 4，鮪魚 8，蛋 1"""
]

# -1 for random, <= -2 for stop
def send_notify(content_i=-1):
    try:
        if content_i <= -1 or content_i >= len(NOTIFY_CONTENTS):
            res = requests.post(f"http://{next_public_server_host}/notify", data=random.choice(NOTIFY_CONTENTS))
        else:
            res = requests.post(f"http://{next_public_server_host}/notify", data=NOTIFY_CONTENTS[content_i])
        if(res.status_code != 200):
            print("[notify_test.send_notify] POST request failed with status code", res.status_code)
        else:
            print("[notify_test.send_notify] POST request successfully send !!!")
    except:
        print("[notify_test.send_notify] POST request failed")

if __name__ == "__main__":
    while(1):
        i = int(input())
        if i >= -1:
            send_notify(i)
        else:
            break