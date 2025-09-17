'use client'

import { useState, useEffect, useRef } from 'react';
import { Context } from '@/lib/types'
import Markdown from 'react-markdown';
import styles from './page.module.scss';

interface LLMMessage {
  role: string;
  content: string;
}

async function getResponse(chatContext: Context<LLMMessage[]>) {
  const res = await fetch(`http://${process.env.NEXT_PUBLIC_SERVER_HOST}/analysis`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(chatContext.value),
  });
  console.log(res);
  const reader = res.body?.getReader();
  let content = '';
  while (true) {
    const result = await reader?.read();
    if (result?.done) break;
    const text = new TextDecoder().decode(result?.value);
    content += text;
    chatContext.setValue([...chatContext.value, {
      role: 'assistant',
      content: content,
    }]);
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
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatContext])

  return (
    <div className={styles.chat}>
      {chatContext.value.map((msg, i) => <ChatBubble key={i} message={msg}/>)}
      <div ref={bottomRef} />
    </div>
  );
}

function Prompt({ chatContext }: { chatContext: Context<LLMMessage[]> }) {
  const [ promptText, setPromptText ] = useState('');
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      chatContext.value.push({
        role: 'user',
        content: promptText,
      });
      getResponse(chatContext);
      setPromptText('');
    }}>
      <input className={styles.prompt} type='text' value={promptText} onChange={(e) => setPromptText(e.target.value)} />
    </form>
  );
}

export default function Analysis() {
  const [ messages, setMessages ] = useState<LLMMessage[]>([]);

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

