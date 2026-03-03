# 🤖 Denis — AI-Powered CLI Chatbot

Denis is a smart terminal-based conversational AI assistant powered by **Groq LLM** and **Tavily Web Search**. It can answer questions in real time by searching the web and maintaining a full conversation history — just like ChatGPT, but in your terminal.

---

## 🧠 How the AI Works

This chatbot is built around three core AI concepts:

### 1. Large Language Model (LLM) via Groq

The brain of the chatbot is a **Large Language Model** (LLM) hosted on [Groq](https://groq.com/). Groq provides extremely fast inference for open-source models (like GPT-class models) through its API.

- The LLM receives a `messages` array containing the **system prompt**, the **full conversation history**, and any **tool results**.
- It generates a response either as plain text or as a **tool call** (requesting a web search).
- The model used: `openai/gpt-oss-20b`

### 2. Tool Calling (Function Calling)

The LLM is given access to a `webSearch` tool. When it detects that a question needs up-to-date or factual information, it **autonomously decides to call the tool** instead of guessing.

**Flow:**

```
User asks a question
       ↓
LLM decides: "I need a web search"
       ↓
LLM returns a tool_call (not a text answer)
       ↓
App calls Tavily web search with the query
       ↓
Search results are passed back to the LLM
       ↓
LLM reads results and returns a final answer
```

This loop repeats until the LLM returns a plain text answer (no more tool calls).

### 3. Web Search via Tavily

[Tavily](https://tavily.com/) is an AI-optimized search API that returns clean, relevant content from the web — perfect for feeding into an LLM as context.

### 4. Conversation Memory

Every message (user, assistant, tool results) is stored in a `messages` array and sent with every request. This gives the chatbot **full memory of the conversation** within a session.

---

## 📁 Project Structure

```
llm/
├── app.js          # Main chatbot logic
├── .env            # API keys (never commit this!)
├── .gitignore      # Ignores .env and node_modules
├── package.json    # Project dependencies
└── README.md       # You are here
```

---

## ⚙️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Groq API Key](https://console.groq.com/)
- A [Tavily API Key](https://app.tavily.com/)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd llm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

### 4. Load environment variables

Since Node.js doesn't auto-load `.env`, use one of these methods:

**Option A — Using `dotenv` package (recommended):**

```bash
npm install dotenv
```

Then add this to the top of `app.js`:

```js
import "dotenv/config";
```

**Option B — Inline when running:**

```bash
GROQ_API_KEY=xxx TAVILY_API_KEY=xxx node app.js
```

**Option C — Using `node --env-file`** (Node.js v20.6+):

```bash
node --env-file=.env app.js
```

---

## 🚀 Usage

```bash
node app.js
```

You'll see a prompt in your terminal:

```
You:
```

Start typing! For example:

```
You: What is the latest news about AI?
You: Who won the Champions League 2024?
You: What is the weather in Kathmandu today?
You: bye
```

Type **`bye`** to exit the chat.

---

## 💬 Example Conversation

```
You: What is today's date?
Assistant: Today is Monday, 3 March 2026.

You: Who is the current president of the USA?
Tool:  { function: { name: 'webSearch', arguments: '{"query":"current president USA 2026"}' } }
Result: ...web content...
Assistant: The current president of the United States is ...

You: bye
```

---

## 🛠️ Dependencies

| Package        | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `groq-sdk`     | Connects to the Groq LLM API for fast AI inference   |
| `@tavily/core` | Performs real-time web searches via Tavily AI Search |
| `openai`       | OpenAI-compatible client (used for API structure)    |
| `readline`     | Built-in Node.js module for reading terminal input   |

---

## 🔑 API Keys

| Key              | Where to get it                               |
| ---------------- | --------------------------------------------- |
| `GROQ_API_KEY`   | [console.groq.com](https://console.groq.com/) |
| `TAVILY_API_KEY` | [app.tavily.com](https://app.tavily.com/)     |

---

## 📜 License

ISC
