import { useEffect, useState } from "react";
import "./App.css";

import ChatInterface from "../components/ChatInterface";

function getTask() {
  return "目标 - 计算数组的算术平均值";
}

function App() {
  const [task, setTask] = useState("");

  useEffect(() => {
    setTask(getTask());
  }, []);

  const handleSendMessage = (message: string) => {
    // Process the message here, e.g., send it to ChatGPT
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const [messages, setMessages] = useState<Array<string>>([]);

  return (
    <div className="parent">
      <div className="chatbar">
        <ChatInterface onSendMessage={handleSendMessage} messages={messages} />
      </div>

      <div className="task">
        <h1>{task}</h1>
      </div>

      <div className="codearea">3</div>
    </div>
  );
}

export default App;
