import { useEffect, useState } from "react";
import "./App.css";

import ChatInterface from "../components/ChatInterface";
import CodeInterface from "../components/CodeInterface";

import type {
  Message,
  PromptAPIRequest,
  PromptAPIResponse,
} from "../types/types";

function getTask() {
  return "目标 - 计算数组的算术平均值";
}

function App() {
  const [task, setTask] = useState("");

  useEffect(() => {
    setTask(getTask());
  }, []);

  const [messages, setMessages] = useState<Array<Message>>([]);

  const handleSendMessage = (message: string) => {
    const new_messages = [
      ...messages,
      {
        role: 1,
        msg: message,
      },
    ];

    fetch("http://localhost:8080/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history: new_messages,
      } as PromptAPIRequest),
    }).then((res) => {
      res.json().then((data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 0,
            msg: (data as PromptAPIResponse).result,
          },
        ]);
      });
    });

    setMessages(new_messages);
  };

  return (
    <div className="parent">
      <div className="chatbar">
        <ChatInterface onSendMessage={handleSendMessage} messages={messages} />
      </div>

      <div className="task">
        <h1>{task}</h1>
      </div>

      <div className="codearea">
        <CodeInterface />
      </div>
    </div>
  );
}

export default App;
