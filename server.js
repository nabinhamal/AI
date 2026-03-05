import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import NodeCache from "node-cache";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize AI clients & Cache (10 min TTL)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const chatCache = new NodeCache({ stdTTL: 60 * 60 * 24 });

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
    const { messages, threadId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const currentThread = threadId || "default";
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // Track thread metadata (title and timestamp)
    let threadList = chatCache.get("threads") || [];
    const threadIndex = threadList.findIndex((t) => t.id === currentThread);

    if (threadIndex === -1) {
      threadList.push({
        id: currentThread,
        title:
          lastUserMessage.slice(0, 30) +
          (lastUserMessage.length > 30 ? "..." : ""),
        timestamp: Date.now(),
      });
    } else {
      // Refresh timestamp and optionally update title if it's a very early message
      threadList[threadIndex].timestamp = Date.now();
      if (messages.length <= 2) {
        threadList[threadIndex].title =
          lastUserMessage.slice(0, 30) +
          (lastUserMessage.length > 30 ? "..." : "");
      }
    }
    chatCache.set("threads", threadList);

    // Generate a cache key that includes the thread context
    // This allows us to detect repeats in the same conversation
    const cacheKey = `thread:${currentThread}:hist:${JSON.stringify(messages)}`;

    // Check for exact state match first
    const cachedResponse = chatCache.get(cacheKey);
    if (cachedResponse) {
      console.log(`[Cache Hit] Serving thread ${currentThread} from storage.`);
      return res.json({ reply: cachedResponse, cached: true });
    }

    // Secondary check: Did they just ask the same thing in this thread?
    const threadRecentQKey = `thread:${currentThread}:lastQ`;
    const threadRecentAKey = `thread:${currentThread}:lastA`;

    const lastQ = chatCache.get(threadRecentQKey);
    const lastA = chatCache.get(threadRecentAKey);

    if (lastQ === lastUserMessage && lastA) {
      console.log(
        `[Thread Cache Hit] Sequential duplicate detected in thread ${currentThread}.`,
      );
      return res.json({ reply: lastA, cached: true });
    }

    const systemMessage = {
      role: "system",
      content: `You are Denis, a smart personal assistant. Be always polite and helpful.
- If you know the answer to a question, provide it directly.
- Use available tools only if the query requires real-time information, up-to-date data, or if you are unsure of the answer.
- Do not mention the tools or the search process in your final response unless it's relevant to the explanation.

Examples:
User: "What is 2+2?"
Assistant: "2 + 2 is 4."

User: "What is the weather in London right now?"
Assistant: [Calls webSearch] "The current weather in London is 15°C with light rain." (No mention of searching)

Current date and time: ${new Date().toUTCString()}`,
    };

    const fullMessages = [systemMessage, ...messages];
    let retryCount = 0;
    const MAX_RETRIES = 6;

    while (retryCount < MAX_RETRIES) {
      retryCount++;
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
        // 1. Cache the full history state for this specific thread
        chatCache.set(cacheKey, responseMessage.content);

        // 2. Track the LAST question and answer in this thread for sequential repeats
        chatCache.set(`thread:${currentThread}:lastQ`, lastUserMessage, 600);
        chatCache.set(
          `thread:${currentThread}:lastA`,
          responseMessage.content,
          600,
        );

        // 3. Update the persistent message history for this thread
        const updatedHistory = [
          ...messages,
          { role: "assistant", content: responseMessage.content },
        ];
        chatCache.set(`thread:${currentThread}:messages`, updatedHistory, 3600);

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

    // If we exit the loop, it means we hit MAX_RETRIES
    const limitReply =
      "I'm sorry, I'm having trouble finding a definitive answer after several attempts. Please try rephrasing your question.";

    // Still save the failure message so the thread doesn't look broken
    const failHistory = [
      ...messages,
      { role: "assistant", content: limitReply },
    ];
    chatCache.set(`thread:${currentThread}:messages`, failHistory, 3600);

    return res.status(500).json({
      error: "AI Loop Limit Reached",
      reply: limitReply,
    });
  } catch (err) {
    console.error("Chat API Error:", err);
    res.status(500).json({ error: "Failed to generate AI response." });
  }
});
// ─── Thread Persistence endpoints ─────────────────────────────────────────────

// List all active threads
app.get("/api/threads", (req, res) => {
  const threads = chatCache.get("threads") || [];
  res.json(threads);
});

// Get messages for a specific thread
app.get("/api/chat/:threadId", (req, res) => {
  const { threadId } = req.params;
  const messages = chatCache.get(`thread:${threadId}:messages`) || [];
  res.json({ messages });
});

// Delete a thread
app.delete("/api/chat/:threadId", (req, res) => {
  const { threadId } = req.params;

  // Remove from metadata list
  let threads = chatCache.get("threads") || [];
  threads = threads.filter((t) => t.id !== threadId);
  chatCache.set("threads", threads);

  // Clear all cache keys related to this thread
  const keys = chatCache.keys();
  keys.forEach((k) => {
    if (k.startsWith(`thread:${threadId}`)) {
      chatCache.del(k);
    }
  });

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
