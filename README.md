# 🤖 Denis — AI-Powered Web Chatbot & Dashboard

Denis is a sophisticated, full-stack conversational AI assistant powered by **Groq LLM** and **Tavily Web Search**. It combines a premium, high-fidelity web interface with a powerful Node.js backend to provide real-time information and intelligent assistance.

---

## ✨ Features

- **Premium Web UI**: Responsive, sleek interface with glassmorphism, smooth transitions, and dark mode support.
- **Server-Side AI**: Powered by Groq's extremely fast inference engine (running `openai/gpt-oss-20b`).
- **Real-Time Web Search**: Integrated Tavily Search for up-to-date factual information.
- **Smart Right Sidebar**:
  - **Live Financial Dashboard**: Real-time stats with sparkline charts.
  - **AI Settings**: Model selection and system prompt configuration.
- **Server Health Monitor**: A pulsing status indicator in the topbar that polls backend connectivity every 10 seconds.
- **Persistent Logic**: Conversation history and context management are handled securely on the server.
- **Cross-Origin Support**: Fully compatible with VS Code Live Server (CORS enabled).

---

## 🧠 Technical Architecture

### 1. LLM Inference (Groq)

The brain of Denis is hosted on [Groq](https://groq.com/). The backend handles the tool-calling loop, allowing the AI to autonomously decide when to search the web for better accuracy.

### 2. Tool Calling Flow

```text
User Question → Backend API → LLM
                             ↓
                      [Needs Search?] → Yes → Tavily Search API
                             ↓                        ↓
                      [Final Answer] ← LLM ← [Search Results]
```

### 3. Server Health Polling

The frontend periodically checks the `/api/health` endpoint.

- 🟢 **Green**: Server online and responding.
- 🔴 **Red**: Server offline or unreachable.

---

## 📂 Project Structure

```
llm/
├── chatbot/              # Frontend Application
│   ├── components/       # Reusable UI modules (Sidebar, Toast, etc.)
│   ├── index.html        # Entry point
│   ├── script.js         # Frontend controller
│   └── style.css         # Main styles (Vanilla CSS + Tailwind)
├── server.js             # Node.js Express Backend
├── .env                  # Private API keys
├── package.json          # Dependencies & Scripts
└── README.md             # Documentation
```

---

## 📡 API Documentation

### **Health Check**

`GET /api/health`

- **Description**: Returns the server status.
- **Response**: `{ "status": "ok" }`

### **Chat Response**

`POST /api/chat`

- **Description**: Sends a message to the AI.
- **Payload**:
  ```json
  {
    "messages": [{ "role": "user", "content": "What's the weather?" }]
  }
  ```
- **Response**: `{ "reply": "The current weather is..." }`

### **Configuration**

`GET /api/config`

- **Description**: Fetches public configurations (Note: API keys are handled server-side).

---

## ⚙️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Groq API Key](https://console.groq.com/)
- [Tavily API Key](https://app.tavily.com/)

### 1. Installation

```bash
git clone <your-repo-url>
cd llm
npm install
```

### 2. Configuration

Create a `.env` file in the root:

```env
PORT=3000
GROQ_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
```

### 3. Start the Server

```bash
node server.js
```

### 4. Access the App

- **Default**: Open `http://localhost:3000`
- **Live Server**: If using VS Code Live Server, open `index.html` on port `5500`. The app will automatically connect to the backend on port `3000`.

---

## 🛠️ Main Dependencies

| Package        | Purpose                                            |
| -------------- | -------------------------------------------------- |
| `express`      | Web server and API routing                         |
| `groq-sdk`     | Official Groq Client for LLM interactions          |
| `@tavily/core` | Real-time AI-optimized web search                  |
| `cors`         | Cross-Origin Resource Sharing for Dev environments |
| `dotenv`       | Environment variable management                    |

---

## 📜 License

ISC
