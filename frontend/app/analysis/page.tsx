'use client'

import { useEffect, useState } from 'react';
import { Context, IncomeStatement } from '@/lib/types'
import Markdown from 'react-markdown';
import styles from './page.module.scss';

interface LLMMessage {
  role: string;
  content: string;
}

const incomes: IncomeStatement = {
  revenue: 750000,
  cost: 350000,
  expense: 270000,
  otherIncome: 10000,
  tax: 50000,
};

async function getResponse(chatContext: Context<LLMMessage[]>) {
  const res = await fetch('http://localhost:18753/v1/chat/completions', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      messages: chatContext.value,
      stream: true
    })
  });
  const reader = res.body?.getReader();
  let content = '';
  while (true) {
    const result = await reader?.read();
    if (result?.done) break;
    const text = new TextDecoder().decode(result?.value);
    const lines = text.split('\n');
    for (let i=0; i < lines.length-1; i++) {
      if (lines[i]) {
        try {
          const data = JSON.parse(lines[i].slice(6));
          const word = data.choices[0].delta.content;
          if (word) {
            content += word;
            chatContext.setValue([...chatContext.value, {
              role: 'assistant',
              content: content,
            }]);
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}

function ChatBubble({ message }: { message: LLMMessage }) {
  let style = {};
  switch (message.role) {
    case 'developer': return;
    case 'assistant':
      break;
    case 'user':
      style = {
        marginLeft: 'auto',
        marginRight: 0,
      };
      break;
  }
  return (
    <div className={styles.chatBubble} style={style}>
      <Markdown>{message.content}</Markdown>
    </div>
  );
}

function Chat({ chatContext }: { chatContext: Context<LLMMessage[]> }) {
  useEffect(() => {
    if (chatContext.value.at(-1)?.role === 'user') {
      getResponse(chatContext);
    }
  })

  return (
    <div className={styles.chat}>
      {chatContext.value.map((msg, i) => <ChatBubble key={i} message={msg}/>)}
    </div>
  );
}

function Prompt({ chatContext }: { chatContext: Context<LLMMessage[]> }) {
  const [ promptText, setPromptText ] = useState('');
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      chatContext.setValue([...chatContext.value, {
        role: 'user',
        content: promptText,
      }]);
      setPromptText('');
    }}>
      <input className={styles.prompt} type='text' value={promptText} onChange={(e) => setPromptText(e.target.value)} />
    </form>
  );
}

function LLMInstructions(instructions: string[]): LLMMessage[] {
  return instructions.map((value) => {
    return { role: 'developer', content: value };
  });
}

export default function Analysis() {
  const [ messages, setMessages ] = useState(LLMInstructions([
    '你是一家中小企業的財務顧問',
    '這家企業的財報如下，單位為新台幣：',
    '營收：' + incomes.revenue,
    '營業成本：' + incomes.cost,
    '營業費用：' + incomes.expense,
    '業外收入：' + incomes.otherIncome,
    '所得稅：' + incomes.tax,
  ]));

  const chatContext: Context<LLMMessage[]> = {
    value: messages,
    setValue: setMessages,
  };

  return (
    <main className={styles.pageContent}>
      <Chat chatContext={chatContext} />
      <Prompt chatContext={chatContext} />
    </main>
  );
}

