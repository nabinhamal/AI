// components/ChatMessage.js
// Matches Lumina AI clean white chat bubbles

export function createChatMessage(role, content) {
  const wrapper = document.createElement("div");
  // Lumina has left-aligned avatars for both, but typically user is right or distinct.
  // We'll keep a clean layout: Assistant on left, User on right.
  wrapper.className = `flex gap-4 msg-animate w-full ${
    role === "user" ? "flex-row-reverse" : "flex-row"
  }`;

  const avatar = document.createElement("div");
  avatar.className = `shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
    role === "user"
      ? "bg-neutral-900 text-white overflow-hidden"
      : "bg-white border border-neutral-200 text-neutral-900"
  }`;

  if (role === "user") {
    avatar.innerHTML = `<img src="https://i.pravatar.cc/150?u=a04258" class="w-full h-full object-cover">`;
  } else {
    avatar.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>`;
  }

  const bubble = document.createElement("div");
  bubble.className = `prose-msg leading-relaxed text-[15px] max-w-[85%] px-5 py-3.5 rounded-2xl ${
    role === "user"
      ? "bg-neutral-100/80 text-neutral-900 rounded-tr-sm"
      : "bg-transparent text-neutral-900"
  }`;

  bubble.innerHTML = formatContent(content);

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);

  return wrapper;
}

function formatContent(text) {
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || "text"}">${escapeHtml(code.trim())}</code></pre>`;
  });
  text = text.replace(
    /`([^`]+)`/g,
    "<code class='bg-neutral-100 border border-neutral-200 text-neutral-800 px-1 rounded text-[13px]'>$1</code>",
  );
  text = text.replace(
    /\*\*(.+?)\*\*/g,
    "<strong class='font-semibold text-black'>$1</strong>",
  );
  text = text.replace(/\n/g, "<br>");
  return `<p>${text}</p>`;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
