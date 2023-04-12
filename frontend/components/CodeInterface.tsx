import React, { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import "./CodeInterface.css";

function CodeInterface() {
  const onChange = useCallback((value: string, viewUpdate: any) => {
    //console.log("value:", value);
  }, []);
  return (
    <CodeMirror
      value="print('Hello World')"
      className="codemirror-area"
      extensions={[python()]}
      onChange={onChange}
      height="100%"
    />
  );
}

export default CodeInterface;
