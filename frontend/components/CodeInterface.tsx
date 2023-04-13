import React, { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import "./CodeInterface.css";

interface ChatInterfaceProps {
  onCodeChange: (code: string) => void;
}

export const defaultCode = "print('Hello World')";

function CodeInterface({ onCodeChange }: ChatInterfaceProps) {
  const onChange = useCallback((value: string, viewUpdate: any) => {
    onCodeChange(value);
  }, []);
  return (
    <CodeMirror
      value={defaultCode}
      className="codemirror-area"
      extensions={[python()]}
      onChange={onChange}
      height="100%"
    />
  );
}

export default CodeInterface;
