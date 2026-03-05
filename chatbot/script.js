// script.js — Main app entry point

import {
  createSidebar,
  addHistoryItem,
  toggleSidebar,
} from "./components/Sidebar.js";
import { createEmptyState } from "./components/EmptyState.js";
import { createChatMessage } from "./components/ChatMessage.js";
import { createTypingIndicator } from "./components/TypingIndicator.js";
import { showAlert } from "./components/Alert.js";
import { showToast } from "./components/Toast.js";
import {
  showApiKeyModal,
  getSavedKeys,
  clearKeys,
} from "./components/ApiKeyModal.js";
import { showNameModal, getSavedName } from "./components/NameModal.js";
import "dotenv/config";

// ─── State ──────────────────────────────────────────────────────────────────
let messageCount = 0;
let conversationHistory = []; // full message history sent to Groq

// ─── DOM References ──────────────────────────────────────────────────────────
const sidebarRoot = document.getElementById("sidebar-root");
const emptyStateRoot = document.getElementById("emptyState-root");
const messagesEl = document.getElementById("messages");
const chatArea = document.getElementById("chatArea");
const sendBtn = document.getElementById("sendBtn");
const inputEl = document.getElementById("messageInput");
const clearBtn = document.getElementById("clearBtn");
const sidebarToggle = document.getElementById("sidebarToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const apiKeyBtn = document.getElementById("apiKeyBtn");

const rightSidebar = document.getElementById("right-sidebar");
const rightSidebarToggle = document.getElementById("rightSidebarToggle");
const closeRightSidebarBtn = document.getElementById("closeRightSidebarBtn");

let sidebar;
let emptyState;

// ─── Right Sidebar Toggle ────────────────────────────────────────────────────
function toggleRightSidebar() {
  if (!rightSidebar) return;

  // On mobile/tablet, rightSidebar is hidden by default. If we toggle it open,
  // we remove `translate-x-full` and add `translate-x-0`
  const isClosed =
    rightSidebar.classList.contains("hidden") ||
    rightSidebar.classList.contains("translate-x-full");

  if (isClosed) {
    rightSidebar.classList.remove("hidden", "translate-x-full");
    rightSidebar.classList.add("translate-x-0", "opacity-100");
  } else {
    rightSidebar.classList.remove("translate-x-0");
    rightSidebar.classList.add("translate-x-full");
    setTimeout(() => {
      // only hide after transition completes to avoid snapping out of view
      if (rightSidebar.classList.contains("translate-x-full")) {
        rightSidebar.classList.add("hidden");
      }
    }, 300);
  }
}

rightSidebarToggle?.addEventListener("click", toggleRightSidebar);
closeRightSidebarBtn?.addEventListener("click", toggleRightSidebar);

// ─── Init on load ─────────────────────────────────────────────────────────────
(async function init() {
  const { groq, tavily } = getSavedKeys();
  updateKeyBadge();

  // 1. Get or prompt for User Name
  let userName = getSavedName();
  if (!userName) {
    userName = await showNameModal();
  }

  // 2. Mount UI with User Name
  sidebar = createSidebar({
    userName,
    onNewChat: confirmClear,
  });
  sidebarRoot.appendChild(sidebar);

  emptyState = createEmptyState({
    userName,
    onSuggestionClick: (text) => {
      inputEl.value = text;
      autoGrow(inputEl);
      updateSendBtn();
      sendMessage();
    },
  });
  emptyStateRoot.appendChild(emptyState);

  // 3. Bind Sidebar Toggles now that sidebar is mounted
  sidebarToggle?.addEventListener("click", () => toggleSidebar(sidebar));
  mobileMenuBtn?.addEventListener("click", () => toggleSidebar(sidebar));

  // 4. Show API Key status
  if (!groq && !tavily) {
    showToast({
      type: "info",
      message: `Welcome, ${userName}! Running in demo mode. Add keys anytime via ⚙ Settings.`,
      duration: 4000,
    });
  } else {
    showToast({
      type: "success",
      message: `Welcome back, ${userName}! AI is ready.`,
    });
  }
})();

// ─── Topbar API Key Button ────────────────────────────────────────────────────
apiKeyBtn?.addEventListener("click", async () => {
  const existing = getSavedKeys();
  const result = await showApiKeyModal({ prefill: existing });
  if (result) {
    showToast({ type: "success", message: "API keys saved for this session." });
    updateKeyBadge();
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function autoGrow(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 200) + "px";
}
function updateSendBtn() {
  sendBtn.disabled = inputEl.value.trim() === "";
}
function updateKeyBadge() {
  const badge = document.getElementById("keyStatusBadge");
  if (!badge) return;
  const { groq } = getSavedKeys();
  if (groq) {
    badge.textContent = "⚙ Keys active";
    badge.className = "hidden sm:inline text-xs text-emerald-400 font-medium";
  } else {
    badge.textContent = "⚙ Add .env file";
    badge.className =
      "hidden sm:inline text-xs text-neutral-500 hover:text-neutral-300 cursor-pointer font-medium";
    badge.onclick = () => document.getElementById("apiKeyBtn")?.click();
  }
}
function scrollToBottom() {
  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
}
function appendMessage(role, content) {
  messagesEl.appendChild(createChatMessage(role, content));
}

// ─── Clear ───────────────────────────────────────────────────────────────────
async function confirmClear() {
  if (messageCount === 0) return;
  const ok = await showAlert({
    type: "danger",
    title: "Clear conversation?",
    message: "All messages will be deleted and conversation history reset.",
    confirmText: "Clear chat",
    cancelText: "Keep it",
  });
  if (ok) {
    messagesEl.innerHTML = "";
    messageCount = 0;
    conversationHistory = [];
    emptyState.style.display = "";
    showToast({ type: "success", message: "Conversation cleared." });
  }
}

// ─── Send Message ─────────────────────────────────────────────────────────────
async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  inputEl.value = "";
  inputEl.style.height = "auto";
  updateSendBtn();

  if (messageCount === 0) {
    emptyState.style.display = "none";
    addHistoryItem(sidebar, text.length > 32 ? text.slice(0, 32) + "…" : text);
  }
  messageCount++;

  // Push user message into conversation history
  conversationHistory.push({ role: "user", content: text });
  appendMessage("user", text);

  const typing = createTypingIndicator();
  messagesEl.appendChild(typing);
  scrollToBottom();

  try {
    const { groq, tavily } = getSavedKeys();
    let reply;

    if (groq) {
      reply = await callGroqWithTools(conversationHistory, groq, tavily);
    } else {
      reply = await demoResponse(text);
    }

    // Store assistant reply in history
    conversationHistory.push({ role: "assistant", content: reply });

    typing.remove();
    appendMessage("assistant", reply);
  } catch (err) {
    typing.remove();
    const errMsg = err.message || "Something went wrong.";
    appendMessage("assistant", `⚠️ ${errMsg}`);
    showToast({ type: "error", message: errMsg });
    console.error(err);
  }

  scrollToBottom();
}

// ─── Real Groq + Tavily API Call ──────────────────────────────────────────────
async function callGroqWithTools(history, groqKey, tavilyKey) {
  const systemMessage = {
    role: "system",
    content: `You are Denis, a smart personal assistant. Be always polite and helpful.
You have access to the following tools:
1. webSearch({query}: {query:string}) — Search the web for latest information and real-time data.
Current date and time: ${new Date().toUTCString()}`,
  };

  const messages = [systemMessage, ...history];

  const tools = tavilyKey
    ? [
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
      ]
    : undefined;

  // ── Tool call loop ──────────────────────────────────────────────────────
  while (true) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages,
        tools,
        tool_choice: tools ? "auto" : undefined,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Groq API error ${res.status}`);
    }

    const data = await res.json();
    const choice = data.choices[0];

    // Push assistant message to loop messages
    messages.push(choice.message);

    // If no tool calls → final answer
    if (!choice.message.tool_calls || choice.message.tool_calls.length === 0) {
      return choice.message.content;
    }

    // Handle tool calls
    for (const tool of choice.message.tool_calls) {
      if (tool.function.name === "webSearch" && tavilyKey) {
        const args = JSON.parse(tool.function.arguments);
        const searchResult = await callTavily(args.query, tavilyKey);
        messages.push({
          role: "tool",
          tool_call_id: tool.id,
          name: "webSearch",
          content: searchResult,
        });
      }
    }
  }
}

// ─── Tavily Web Search ────────────────────────────────────────────────────────
async function callTavily(query, tavilyKey) {
  showToast({
    type: "info",
    message: `🔍 Searching: "${query.slice(0, 40)}..."`,
    duration: 2500,
  });

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: tavilyKey,
      query,
      search_depth: "basic",
      max_results: 5,
    }),
  });

  if (!res.ok)
    throw new Error("Tavily search failed. Check your Tavily API key.");

  const data = await res.json();
  return data.results.map((r) => `${r.title}\n${r.content}`).join("\n\n");
}

// ─── Demo mode responses ──────────────────────────────────────────────────────
async function demoResponse(text) {
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
  const q = text.toLowerCase();

  if (q.match(/hi|hello|hey/))
    return "Hello! 👋 I'm **Denis**, your AI assistant. I'm currently running in demo mode — add your Groq API key via the **⚙ Settings** button to unlock real AI responses!";
  if (q.match(/who are you|what are you/))
    return "I'm **Denis**, a smart AI assistant powered by Groq's LLM and Tavily web search. In demo mode I use pre-written responses. Add your API keys to chat with the real AI!";
  if (q.match(/api|key|groq|tavily/))
    return "To use real AI, click the **⚙ Add API keys** button in the top bar. Enter your [Groq](https://console.groq.com) and [Tavily](https://app.tavily.com) API keys. They're stored **only in your browser session** — never sent to any server.";
  if (q.match(/llm|language model|how.*(work|ai)/))
    return "**Large Language Models (LLMs)** are neural networks trained on massive text corpora.\n\nThey work by predicting the next token given all previous context — doing this billions of times produces coherent, intelligent text.\n\n`Architecture: Transformer → Attention → Prediction → Text`\n\nModels like LLaMA 4, GPT-4, and Gemini all follow this pattern at different scales.";
  if (q.match(/news|latest|today|current/))
    return "I'd search the web for that! 🔍\n\nIn demo mode I can't access real-time data. Add your **Tavily API key** to enable live web search.";
  if (q.match(/weather/))
    return "I can look up real-time weather with Tavily web search! 🌤️\n\nAdd your **Groq + Tavily API keys** via ⚙ Settings to get live weather data for any location.";
  if (q.match(/code|program|script|function/))
    return "Happy to help with code! 💻\n\nHere's a quick example:\n```javascript\nasync function fetchData(url) {\n  const res = await fetch(url);\n  return res.json();\n}\n```\nAdd your **Groq API key** to ask me complex coding questions with full context-aware answers.";
  if (q.match(/poem|joke|story|creative/))
    return "**A Coder's Haiku** ✍️\n\n*Lines of logic flow,*\n*Bugs crawl in the silent night,*\n*Coffee saves the dawn.*\n\n— Denis AI 🤖";
  if (q.match(/thank/))
    return "You're very welcome! 😊 Add your Groq API key for full AI conversations.";
  return `You said: *"${text}"*\n\nI'm in **demo mode** right now. Click **⚙ Add API keys** in the top bar to connect your Groq account and get real AI responses with web search!`;
}
