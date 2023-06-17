'use client';

import { useEffect, useState } from "react";
import "./page.css";

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

function Home() {
  const [task, setTask] = useState<Task>();

  useEffect(() => {
    getTask().then((task) => setTask(task));
  }, []);

  const [code, setCode] = useState<string>(defaultCode);

  const handleCodeChange = (code: string) => {
    setCode(code);
  };

  return (
    <>
      <div className="parent">
        <div className="chatbar">
          {
            <ChatInterface code={code} />
          }
        </div>

        <div className="task">
          {task ? (
            <>
              <div className="task-name">
                <div className="task-title">
                  <h3>{task.task}</h3>
                </div>
                <div className="task-body">
                  <p>{task.description}</p>
                </div>
              </div>
              <div className="task-example">
                <div className="task-title">
                  <h3>示例</h3>
                </div>
                <div className="task-body">
                  <div>
                    {task.examples.map((example, index) => (
                      <div key={index}>
                        <p>
                          <b>输入：{example.input}</b>

                          <b>输出：{example.output}</b>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="codearea">
          <CodeInterface onCodeChange={handleCodeChange} />
        </div>
      </div>
    </>
  );
}

export default Home;
