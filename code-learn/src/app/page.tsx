'use client';

import { useEffect, useState } from "react";
import "./page.css";

import ChatInterface from "../components/ChatInterface";
import CodeInterface, { defaultCode } from "../components/CodeInterface";

import type {
  Task,
} from "../types/types";

async function getTask(): Promise<Task> {
  const problemResp = await fetch("http://localhost:3000/api/problems", {
    method: "POST",
    body: JSON.stringify({ id: 0 }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await problemResp.json() as Task;
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
            <ChatInterface code={code} id={0} />
          }
        </div>

        <div className="task">
          {task ? (
            <>
              <div className="task-name">
                <div className="task-title">
                  <h3>目标 - {task.task}</h3>
                </div>
                <div className="task-body">
                  <p>{task.description}</p>
                </div>
              </div>
              <div className="task-example">
                <div className="task-title">
                  <h3>样例</h3>
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
