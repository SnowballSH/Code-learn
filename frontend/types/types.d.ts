interface Message {
  role: number;
  msg: string;
}

interface PromptAPIRequest {
  history: Array<Message>;
}

interface PromptAPIResponse {
  result: string;
}

interface Example {
  input: string;
  output: string;
}

interface Task {
  id: number;
  task: string;
  description: string;
  examples: Array<Example>;
}

export type { Message, PromptAPIRequest, PromptAPIResponse, Task };
