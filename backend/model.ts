export interface Message {
    role: number,
    msg: string,
}

export interface PromptRequest {
    history: Message[],
}

export interface PromptResponse {
    result: string,
}
