const chatHistory = document.getElementById('chat-history');

const incomeStatement = {
  revenue: 750000,
  cost: 350000,
  expense: 270000,
  otherIncome: 10000,
  tax: 50000,
};

let messages = [
  {
    "role": "developer",
    "content": "你是一家中小企業的財務顧問"
  },
  {
    "role": "developer",
    "content": "這家企業的財報如下，單位為新台幣："
  },
  {
    "role": "developer",
    "content": "營收：" + incomeStatement.revenue
  },
  {
    "role": "developer",
    "content": "營業成本：" + incomeStatement.cost
  },
  {
    "role": "developer",
    "content": "營業費用：" + incomeStatement.expense
  },
  {
    "role": "developer",
    "content": "業外收入：" + incomeStatement.otherIncome
  },
  {
    "role": "developer",
    "content": "所得稅：" + incomeStatement.tax
  },
];

async function printResponse() {
  const bubble = document.createElement('div');
  bubble.className = 'bubble assistant-bubble';
  chatHistory.insertBefore(bubble, chatHistory.firstChild);
  const res = await fetch("http://localhost:18753/v1/chat/completions", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "messages": messages,
      "stream": true
    })
  });
  const reader = res.body.getReader();
  content = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = new TextDecoder().decode(value);
    const lines = text.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].slice(6);
      if (line) {
        try {
          const data = JSON.parse(line);
          const word = data.choices[0].delta.content;
          if (word) content += data.choices[0].delta.content;
        } catch (e) {
          console.log(line);
        }
      }
    }
    bubble.innerHTML = marked.parse(content);
  }
  messages.push({
    "role": "assistant",
    "content": content
  });
}

async function promptKeyDown(input) {
  if (event.key != 'Enter') return;
  const bubble = document.createElement('div');
  bubble.className = 'bubble user-bubble';
  chatHistory.insertBefore(bubble, chatHistory.firstChild);
  bubble.innerHTML = input.value;
  messages.push({
    "role": "user",
    "content": input.value
  });
  input.value = '';
  await printResponse();
}

document.getElementById('prompt').value = '';

