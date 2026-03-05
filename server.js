import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize AI clients
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ─── Chat endpoint ────────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const systemMessage = {
      role: "system",
      content: `You are Denis, a smart personal assistant. Be always polite and helpful.
You have access to the following tools:
1. webSearch({query}: {query:string}) — Search the web for latest information and real-time data.
Current date and time: ${new Date().toUTCString()}`,
    };

    const fullMessages = [systemMessage, ...messages];

    while (true) {
      const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: fullMessages,
        temperature: 0.7,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the web for the latest information and real-time data",
              parameters: {
                type: "object",
                properties: {
                  query: { type: "string", description: "The search query" },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      const responseMessage = response.choices[0].message;
      fullMessages.push(responseMessage);

      if (
        !responseMessage.tool_calls ||
        responseMessage.tool_calls.length === 0
      ) {
        return res.json({ reply: responseMessage.content });
      }

      // Handle tool calls
      for (const tool of responseMessage.tool_calls) {
        if (tool.function.name === "webSearch") {
          const args = JSON.parse(tool.function.arguments);
          console.log(`Searching for: ${args.query}`);

          let searchResult;
          try {
            const tvlyRes = await tvly.search(args.query);
            searchResult = tvlyRes.results.map((r) => r.content).join("\n\n");
          } catch (e) {
            console.error("Tavily Error:", e);
            searchResult = "Web search failed or no results found.";
          }

          fullMessages.push({
            role: "tool",
            tool_call_id: tool.id,
            name: "webSearch",
            content: searchResult,
          });
        }
      }
    }
  } catch (err) {
    console.error("Chat API Error:", err);
    res.status(500).json({ error: "Failed to generate AI response." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
