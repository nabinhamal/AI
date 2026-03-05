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

## �️ Safety & Reliability

- **Infinite Loop Prevention**: The backend limits AI tool calls to a maximum of **6 retries** per request.
- **Custom Error Handling**: Returns a friendly message when complexity limits are reached.
- **Thread Isolation**: Each user session is tracked via `threadId`.

---

## �📂 Project Structure

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

Follow these steps to get the project running locally:

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configuration

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env
```

Open the `.env` file and provide your `GROQ_API_KEY` and `TAVILY_API_KEY`.

### 4. Running the Application

#### Start the Backend Server

```bash
node server.js
```

The backend will run at `http://localhost:3000`.

#### Access the Frontend

1. **Directly**: Open `chatbot/index.html` in your browser.
2. **Live Server (Recommended)**: If using VS Code, use the "Live Server" extension to serve the `chatbot` directory. It usually runs at `http://localhost:5500`.

---

## 🚀 Usage

Wait for the green status indicator in the top bar to pulse—this means the connection to the backend is active.

1. **New Session**: Click "New Chat" in the sidebar to start a fresh thread.
2. **Search**: Ask for real-time data; Denis will autonomously use Tavily Search to find facts.
3. **History**: Previous chats are saved in the "Recent Chats" section of the sidebar. Click any item to reload that conversation.
4. **Clean Exit**: Click the Home icon or "Clear Conversation" to reset your view.

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
