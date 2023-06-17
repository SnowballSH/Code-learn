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
