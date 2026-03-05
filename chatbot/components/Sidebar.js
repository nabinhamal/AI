// components/Sidebar.js
// Match Lumina AI dark sidebar

export function createSidebar({ userName = "Guest", onNewChat } = {}) {
  const el = document.createElement("aside");
  el.id = "sidebar";
  el.className =
    "flex flex-col w-[260px] shrink-0 h-full bg-[#111111] transition-all duration-300";

  el.innerHTML = `
    <!-- Header -->
    <div class="px-5 pt-8 pb-6 flex items-center justify-between">
      <div class="flex items-center gap-3 text-white font-semibold tracking-wide">
        <svg class="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>
       Denis
      </div>
      <button class="text-neutral-500 hover:text-white transition"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></button>
    </div>

    <div class="px-4 mb-6">
      <button id="newChatBtn" class="w-full flex items-center justify-between text-white text-[13px] font-medium bg-[#1c1c1c] hover:bg-[#2a2a2a] border border-[#2a2a2a] py-2.5 px-3 rounded-xl transition">
        <div class="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Chat
        </div>
        <div class="flex items-center gap-1.5 opacity-50">
          <span class="bg-[#333] px-1 rounded text-[10px]">⌘</span>
          <span class="bg-[#333] px-1 rounded text-[10px]">N</span>
        </div>
      </button>
    </div>

    <!-- Main Navigation -->
    <div class="px-3 space-y-1 mb-6">
      <div class="flex items-center gap-2.5 px-3 py-4 border-b border-emerald-900/20">
        <div class="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span class="font-bold text-white text-[15px] tracking-tight">Denis AI</span>
      </div>
      <button class="w-full flex items-center gap-3 text-neutral-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Community
      </button>
      <button class="w-full flex items-center gap-3 text-neutral-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        Commands
      </button>
    </div>

    <!-- History -->
    <div class="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
      <div class="flex items-center justify-between mb-3">
        <p class="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">Recent Chats</p>
      </div>
      <div id="historyList" class="space-y-1.5">
        <!-- Dynamic history items will be injected here -->
        <div class="text-[12px] text-neutral-600 italic px-2">No history yet</div>
      </div>
    </div>

    <!-- Footer Profile -->
    <div class="p-4 pt-2">
      <!-- Trial alert -->
      <div class="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4 mb-4">
        <div class="text-white text-sm font-medium mb-1">Your trial ends in 14 days</div>
        <p class="text-neutral-500 text-[11px] leading-relaxed mb-3">Enjoy working with reports, extract data, advanced search experience and much more.</p>
        <button class="w-full bg-[#d4ff00] hover:bg-[#c2eb00] text-black font-semibold text-xs py-2 rounded-lg transition shadow-[0_0_12px_rgba(212,255,0,0.15)]">
          <span class="mr-1">↗</span> Upgrade
        </button>
      </div>

      <!-- User row -->
      <div class="flex items-center justify-between cursor-pointer hover:bg-[#1a1a1a] p-2 -mx-2 rounded-lg transition">
        <div class="flex items-center gap-3">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=222&color=fff&rounded=true" class="w-8 h-8 rounded-full shadow-inner" alt="User">
          <div class="flex flex-col">
            <span class="text-[13px] text-white font-medium truncate">${userName}</span>
            <span class="text-[11px] text-neutral-500">Trial</span>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  `;

  el.querySelector("#newChatBtn").addEventListener("click", () =>
    onNewChat?.(),
  );
  return el;
}

export function renderHistory(sidebar, threads, { onSelect, onDelete }) {
  const list = sidebar.querySelector("#historyList");
  if (!list) return;

  if (!threads || threads.length === 0) {
    list.innerHTML = `<div id="historyPlaceholder" class="text-[12px] text-neutral-600 italic px-2">No history yet</div>`;
    return;
  }

  const placeholder = list.querySelector("#historyPlaceholder");
  if (placeholder) placeholder.remove();

  list.innerHTML = "";
  // Sort by timestamp descending
  const sorted = [...threads].sort((a, b) => b.timestamp - a.timestamp);

  sorted.forEach((thread) => {
    const item = document.createElement("div");
    item.className =
      "group flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-[#1c1c1c] transition-all cursor-pointer msg-animate";

    item.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0">
        <svg class="text-neutral-500 group-hover:text-neutral-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span class="text-[13px] text-neutral-400 group-hover:text-white truncate font-medium">${
          thread.title || "Untitled Chat"
        }</span>
      </div>
      <button class="delete-thread-btn opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-neutral-500 hover:text-red-400 transition" title="Delete thread">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    `;

    item.addEventListener("click", (e) => {
      if (e.target.closest(".delete-thread-btn")) return;
      onSelect?.(thread.id);
    });

    item.querySelector(".delete-thread-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      onDelete?.(thread.id);
    });

    list.appendChild(item);
  });
}

export function addHistoryItem(sidebar, title) {
  // Now handled by renderHistory for better consistency,
  // but keeping the signature for simple append if needed.
}

export function toggleSidebar(sidebar) {
  // Mobile drawer logic targets the wrapper which has the 'hidden md:block' classes
  const wrapper =
    sidebar.parentElement || document.getElementById("sidebar-root");

  // If we're on mobile (it has the hidden class by default via md:block)
  // we toggle a class that forces it to show as a sliding drawer
  if (wrapper && wrapper.classList.contains("hidden")) {
    wrapper.classList.remove("hidden");
    wrapper.classList.add(
      "fixed",
      "inset-y-0",
      "left-0",
      "z-50",
      "shadow-2xl",
      "m-2",
      "w-auto",
    );

    // Add a temporary backdrop listener
    const backdrop = document.createElement("div");
    backdrop.id = "mobileSidebarBackdrop";
    backdrop.className = "fixed inset-0 bg-black/50 z-40 md:hidden";
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", () => toggleSidebar(sidebar));
  } else if (wrapper && wrapper.classList.contains("fixed")) {
    // Closing mobile drawer
    wrapper.classList.add("hidden");
    wrapper.classList.remove(
      "fixed",
      "inset-y-0",
      "left-0",
      "z-50",
      "shadow-2xl",
      "m-2",
      "w-auto",
    );
    document.getElementById("mobileSidebarBackdrop")?.remove();
  } else {
    // Desktop behavior (margin-left negative sliding)
    const isHidden = sidebar.style.marginLeft === "-260px";
    sidebar.style.marginLeft = isHidden ? "0px" : "-260px";
  }
}
