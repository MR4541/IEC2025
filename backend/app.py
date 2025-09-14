from flask import Flask, jsonify, request
from datetime import datetime
from zoneinfo import ZoneInfo

app = Flask(__name__)

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

@app.route('/')
def hello():
    return '<p>Hello, world!</p>'

@app.route('/finance')
def get_finance():
    finance = {
        'revenue': 750000,
        'cost': 350000,
        'expense': 270000,
        'otherIncome': 10000,
        'tax': 50000,
    }
    res = jsonify(finance)
    res.headers['Access-Control-Allow-Origin'] = '*'
    return res

@app.route('/stock')
def get_stock():
    res = jsonify(stock_history)
    res.headers['Access-Control-Allow-Origin'] = '*'
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
    return 'ok'

