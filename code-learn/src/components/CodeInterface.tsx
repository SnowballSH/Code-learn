import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import "./CodeInterface.css";

interface ChatInterfaceProps {
  onCodeChange: (code: string) => void;
}

export const defaultCode = `# 更改此代码
print('Hello World')`;

function CodeInterface({ onCodeChange }: ChatInterfaceProps) {
  const onChange = useCallback((value: string, viewUpdate: any) => {
    onCodeChange(value);
  }, []);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="chat-title">
        <h3>代码区</h3>
      </div>
      <CodeMirror
        value={defaultCode}
        className="codemirror-area"
        extensions={[python()]}
        onChange={onChange}
        height="100%"
      />
    </div>
  );
}

export default CodeInterface;
