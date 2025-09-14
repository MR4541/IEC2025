import requests
import random
import time

if __name__ == '__main__':
    while True:
        order = [
            {'item_id': x, 'quantity': random.randint(1, 10)}
            for x in random.sample(range(4), random.randint(0, 3))
        ]
        requests.post('http://localhost:5000/order', json=order)
        time.sleep(random.randint(1, 5))

