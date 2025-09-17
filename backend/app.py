from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import requests
import json
from datetime import datetime
from zoneinfo import ZoneInfo

app = Flask(__name__)
CORS(app)

ingredients = ['麵包', '生菜', '鮪魚', '蛋']

foods = [
    {
        'name': '三明治',
        'ingredients': [0, 1, 2, 3],
        'price': 70,
    },
    {
        'name': '沙拉',
        'ingredients': [1, 2, 3],
        'price': 60,
    },
    {
        'name': '蛋餅',
        'ingredients': [2, 3],
        'price': 50,
    },
    {
        'name': '荷包蛋',
        'ingredients': [3],
        'price': 15,
    },
]

stock_history = [{
    'time': datetime.now(ZoneInfo('Asia/Taipei')).timestamp(),
    ingredients[0]: 1000,
    ingredients[1]: 1000,
    ingredients[2]: 1000,
    ingredients[3]: 1000,
}]

ingredient_usages = [(x, 0) for x in ingredients]

incomes = {
    'revenue': 750000,
    'cost': 350000,
    'expense': 270000,
    'otherIncome': 10000,
    'tax': 50000,
}

@app.route('/')
def hello():
    return '<p>Hello, world!</p>'

@app.route('/finance')
def get_finance():
    res = jsonify(incomes)
    return res

@app.route('/stock')
def get_stock():
    res = jsonify(stock_history)
    return res

@app.route('/shortage')
def get_warning():
    shortages = [k for (k, v) in ingredient_usages if stock_history[-1][k] / (v + 0.1) < 1000]
    res = jsonify(shortages)
    return res

@app.route('/order', methods=['POST'])
def process_order():
    order = request.json
    assert type(order) == list
    stock_history.append(stock_history[-1].copy())
    entry = stock_history[-1]
    entry['time'] = datetime.now(ZoneInfo('Asia/Taipei')).timestamp()
    for item in order:
        food = foods[item['item_id']]
        for ingr in food['ingredients']:
            entry[ingredients[ingr]] -= item['quantity']
            entry[ingredients[ingr]] = max(0, entry[ingredients[ingr]])
    if len(stock_history) >= 5:
        start = stock_history[-5]
        end = stock_history[-1]
        duration = end['time'] - start['time']
        ingredient_usages = [(k, (v - end[k]) / duration) for k, v in start.items() if k != 'time']
    return 'ok'

@app.route('/analysis', methods=['POST'])
def analyze():
    instructions = [
        '你是一家中小企業的財務顧問',
        '這家企業的財報如下，單位為新台幣：',
        '營收：' + str(incomes['revenue']),
        '營業成本：' + str(incomes['cost']),
        '營業費用：' + str(incomes['expense']),
        '業外收入：' + str(incomes['otherIncome']),
        '所得稅：' + str(incomes['tax']),
    ]
    messages = [{'role': 'developer', 'content': x} for x in instructions]
    assert type(request.json) == list
    messages += request.json
    payload = {
        'messages': messages,
        'stream': True,
    }
    llm_url = 'http://localhost:18753/v1/chat/completions'
    res = requests.post(llm_url, json=payload, stream=True)
    def completion():
        for line in res.iter_lines():
            if not line: continue
            data = json.loads(line[len('data: '):])
            token = data['choices'][0]
            if token['finish_reason']: break
            delta = token['delta']['content']
            if delta: yield delta
    return Response(completion())

