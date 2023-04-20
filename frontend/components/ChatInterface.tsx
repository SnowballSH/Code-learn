import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import "./ChatInterface.css";

import type { Message } from "../types/types";

import MarkdownPreview from "@uiw/react-markdown-preview";

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Array<Message>;
  allowSubmit: boolean;
}

function ChatInterface({
  onSendMessage,
  messages,
  allowSubmit,
}: ChatInterfaceProps) {
  const [inputText, setInputText] = useState<string>("");

  // reference to the chat display div
  const chatDisplayRef = useRef<HTMLDivElement>(null);

  // automatically scroll to bottom when new messages are added
  const scrollToBottom = (): void => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // handle sending messages
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputText.trim() === "") return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputText(e.target.value);
  };

  // Enter = submit, Shift Enter = new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-display" ref={chatDisplayRef}>
        {messages.map((message, index) => (
          <div key={index}>
            <p className="message">
              <b>{message.role == 0 ? "助手" : "你"}: </b>
            </p>
            <MarkdownPreview
              source={message.msg}
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <textarea
          className="chat-input"
          value={inputText}
          onChange={handleChange}
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
