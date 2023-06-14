import express from "express";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import cors from "cors";
import dotenv from "dotenv";
import type { Message, PromptRequest, PromptResponse } from "./model";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/hello', async (req, res) => {
    res.send('Hello World!');
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PROMPT = `You are helpful AI programming tutor. Your job is to teach a Chinese user programming in Python.
Be kind and helpful. Give concise answers. Do NOT provide the full solution; instead, guide the user through doing the problem step by step, by asking the user a series of guiding questions.
Guide the user to solve the problem by themselves. Answer all questions only in Simplified Chinese.
The user should obtain all input from \`stdin\` and output to \`stdout\`. Assume input is valid and in the example format.

Current problem: 计算列表的算术平均值
Examples:
输入：3 -8 0 5 2   输出：0.4
输入：5 7   输出：6.0`;


async function prompt_gpt(data: PromptRequest): Promise<string | undefined> {
    const message_history: ChatCompletionRequestMessage[] = [
        { role: "system", content: PROMPT },
    ];

    data.history.forEach(message => {
        message_history.push({ role: message.role === 0 ? "assistant" : "user", content: message.msg });
    });

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: message_history,
    });

    return completion.data.choices[0].message?.content;
}

function isPromptRequest(obj: any): obj is PromptRequest {
    return obj && typeof obj === "object" && "history" in obj && Array.isArray(obj.history);
}

app.post('/api/prompt', async (req, res) => {
    if (!isPromptRequest(req.body)) {
        res.status(400).send("Bad Request");
        return;
    }
    let data: PromptRequest = req.body;
    let result = await prompt_gpt(data);
    if (result === undefined) {
        res.status(500).send("Internal Server Error");
        return;
    }
    let response: PromptResponse = {
        result: result,
    };
    res.send(response);
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});