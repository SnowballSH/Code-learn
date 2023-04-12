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

export type { Message, PromptAPIRequest, PromptAPIResponse };
