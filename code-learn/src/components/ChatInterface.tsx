'use client';

import { useState, useRef, FormEvent } from "react";
import dynamic from 'next/dynamic';
import "./ChatInterface.css";

import { useChat, Message } from 'ai/react';

import "@uiw/react-markdown-preview/markdown.css";

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

interface ChatInterfaceProps {
  code: string;
}

function ChatInterface({
  code,
}: ChatInterfaceProps) {
  // reference to the chat display div
  const chatDisplayRef = useRef<HTMLDivElement>(null);

  // Enter = submit, Shift Enter = new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  const [allowSubmit, setAllowSubmit] = useState<boolean>(true);

  const onFinish = (message: Message) => {
    setAllowSubmit(true);
  };

  // broad submit function
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAllowSubmit(false);
    handleSubmit(e);
  };

  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
    onFinish,
    body: {
      code: code,
    }
  });

  return (
    <div className="chat-interface">
      <div className="chat-title">
        <h3>小助手</h3>
      </div>
      <MarkdownPreview />
      <div className="chat-display" ref={chatDisplayRef}>
        {messages.map(m => (
          <div
            style={{
              maxWidth: "90%",
              width: "fit-content",
              margin: m.role === "assistant" ? "10px auto 10px 10px" : "10px 10px 10px auto",
            }}
            key={m.id}
          >
            <MarkdownPreview
              source={m.content}
              style={{
                backgroundColor: m.role === "assistant" ? "#bae8e8" : "#C8FB78",
                borderRadius: "10px",
                padding: "14px",
              }}
            />
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="chat-input-form">
        <textarea
          className="chat-input"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="问你想问的问题..."
        />
        <button type="submit" className="send-button" disabled={!allowSubmit}>
          发送
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;
