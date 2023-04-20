import { useEffect, useState } from "react";
import "./App.css";

import ChatInterface from "../components/ChatInterface";
import CodeInterface, { defaultCode } from "../components/CodeInterface";

import type {
  Message,
  PromptAPIRequest,
  PromptAPIResponse,
  Task,
} from "../types/types";

async function getTask(): Promise<Task> {
  return {
    id: 1,
    task: "目标 - 计算列表的算术平均值",
    description:
      "用input()函数输入一个列表，然后用print()函数输出这个列表的算术平均值。算数平均值是所有数字的总和除以数字的个数。",
    examples: [
      {
        input: "3 -8 0 5 2",
        output: "0.4",
      },
      {
        input: "5 7",
        output: "6.0",
      },
    ],
  } as Task;
}

function App() {
  const [task, setTask] = useState<Task>();

  useEffect(() => {
    getTask().then((task) => setTask(task));
  }, []);

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [code, setCode] = useState<string>(defaultCode);
  const [requesting, setRequesting] = useState<boolean>(false);

  const handleSendMessage = (message: string) => {
    if (requesting) return;
    setRequesting(true);

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
        setRequesting(false);
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
        <ChatInterface
          onSendMessage={handleSendMessage}
          messages={messages}
          allowSubmit={!requesting}
        />
      </div>

      <div className="task">
        {task ? (
          <div>
            <h1>{task.task}</h1>
            <p>{task.description}</p>
            <hr />
            <h2>示例</h2>
            <div>
              {task.examples.map((example, index) => (
                <div key={index}>
                  <p>
                    <b>输入：</b>
                    {example.input}
                    &nbsp;&nbsp;&nbsp;
                    <b>输出：</b>
                    {example.output}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="codearea">
        <CodeInterface onCodeChange={handleCodeChange} />
      </div>
    </div>
  );
}

export default App;
