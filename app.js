import OpenAI from "openai";
import { tavily } from "@tavily/core";
import Groq from "groq-sdk";
import readline from "readline";
import "dotenv/config";

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const messages = [
    {
      role: "system",
      content: `You are Denis,a smart personal assistant.Be always polite.
      You have access to following tools:
      1. webSearch({query}: {query:string}) //Search the web for the latest information and real time data.
      current date and time:${new Date().toUTCString()},
      `,
    },
  ];

  while (true) {
    const question = await new Promise((resolve) =>
      rl.question("You: ", resolve),
    );

    //bye
    if (question === "bye") {
      break;
    }

    messages.push({
      role: "user",
      content: question,
    });

    //tool call loop
    while (true) {
      const response = await client.chat.completions.create({
        temperature: 0,
        model: "openai/gpt-oss-20b",
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description: "Search the web for the latest information",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The city and state, eg Kathmandu, Nepal",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      messages.push(response.choices[0].message);

      const toolCalls = response.choices[0].message.tool_calls;

      if (!toolCalls) {
        console.log(`Assistant: ${response.choices[0].message.content}`);
        break;
      }

      for (const tool of toolCalls) {
        console.log(`Tool: `, tool);
        const funcName = tool.function.name;
        const args = tool.function.arguments;

        if (funcName === "webSearch") {
          const toolresult = await webSearch(JSON.parse(args));
          console.log(`Result: ${toolresult}`);

          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: funcName,
            content: toolresult,
          });
        }
      }
    }
  }
  rl.close();
}

main();

async function webSearch({ query }) {
  //here we will do tavily api call
  console.log(`Calling web search`);

  const response = await tvly.search(query);
  console.log(response);

  const finalResponse = response.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResponse;
}
