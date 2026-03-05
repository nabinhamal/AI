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
import { showNameModal, getSavedName } from "./components/NameModal.js";

const SERVER_URL = "http://localhost:3000";

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
  // Check backend health
  try {
    const res = await fetch(`${SERVER_URL}/api/health`);
    if (!res.ok) throw new Error();
  } catch (e) {
    showToast({ type: "error", message: "Cannot connect to server API." });
  }

  // 1. Get or prompt for User Name
  let userName = getSavedName();
  if (!userName) {
    userName = await showNameModal();
  }

  // 2. Mount UI
  sidebar = createSidebar({ userName, onNewChat: confirmClear });
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

  // 3. Bind Sidebar Toggles
  sidebarToggle?.addEventListener("click", () => toggleSidebar(sidebar));
  mobileMenuBtn?.addEventListener("click", () => toggleSidebar(sidebar));

  // 4. Welcome toast
  showToast({
    type: "success",
    message: `Welcome back, ${userName}! AI is ready.`,
    duration: 4000,
  });
})();

// ─── Helpers ─────────────────────────────────────────────────────────────────
function autoGrow(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 200) + "px";
}
function updateSendBtn() {
  sendBtn.disabled = inputEl.value.trim() === "";
}
function scrollToBottom() {
  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
}
function appendMessage(role, content) {
  messagesEl.appendChild(createChatMessage(role, content));
}

// ─── Input / Send Event Listeners ────────────────────────────────────────────
inputEl?.addEventListener("input", () => {
  autoGrow(inputEl);
  updateSendBtn();
});

inputEl?.addEventListener("keydown", (e) => {
  // Send on Enter (without Shift)
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (!sendBtn.disabled) sendMessage();
  }
});

sendBtn?.addEventListener("click", () => {
  if (!sendBtn.disabled) sendMessage();
});

clearBtn?.addEventListener("click", confirmClear);

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
    const res = await fetch(`${SERVER_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    const reply = data.reply || "No response received.";

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
