import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

import { Task } from '@/types/types';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

const PROMPT = `You are helpful AI programming tutor. Your job is to teach a Chinese user programming in Python.
Be kind and helpful. Give concise answers. Do NOT provide the full solution; instead, guide the user through doing the problem step by step, by asking the user a series of guiding questions.
Guide the user to solve the problem by themselves. Answer all questions only in Simplified Chinese.
The user should obtain all input from \`stdin\` and output to \`stdout\`. Assume input is valid and in the example format.

Current problem: `;

// IMPORTANT! Set the runtime to edge
// export const runtime = 'edge';

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const { messages, code, id }: { messages: ChatCompletionRequestMessage[], code: string, id: number; } = await req.json();

    const problemResp = await fetch(`${process.env.DOMAIN}/api/problems`, {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const task = await problemResp.json() as Task;

    const prompt: ChatCompletionRequestMessage[] = [
        {
            role: 'system',
            content: PROMPT + task.task + "\n\n" + task.description + "\n\n" + task.examples.map((example) => "input: " + example.input + "\noutput: " + example.output).join("\n"),
        },
        ...messages.slice(0, -1),
        {
            role: 'user',
            content: "我现在的代码是：\n```python\n" + code + "\n```\n\n" + messages[messages.length - 1].content,
        }
    ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: prompt,
    });
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
}