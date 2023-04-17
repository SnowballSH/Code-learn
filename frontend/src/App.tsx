import { useEffect, useState } from "react";
import "./App.css";

import ChatInterface from "../components/ChatInterface";
import CodeInterface, { defaultCode } from "../components/CodeInterface";

import type {
  Message,
  PromptAPIRequest,
  PromptAPIResponse,
} from "../types/types";

function getTask() {
  return "目标 - 计算列表的算术平均值";
}

function App() {
  const [task, setTask] = useState("");

  useEffect(() => {
    setTask(getTask());
  }, []);

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [code, setCode] = useState<string>(defaultCode);

  const handleSendMessage = (message: string) => {
    const new_messages = [
      ...messages,
      {
        role: 1,
        msg: "我现在的代码是：\n```python\n" + code + "\n```",
      },
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

    setMessages((prevMessages) => [...prevMessages, { role: 1, msg: message }]);
  };

  const handleCodeChange = (code: string) => {
    setCode(code);
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
        <CodeInterface onCodeChange={handleCodeChange} />
      </div>
    </div>
  );
}

export default App;
