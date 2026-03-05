// components/EmptyState.js
// Welcome screen matching Lumina AI screenshot

export function createEmptyState({
  userName = "Guest",
  onSuggestionClick,
} = {}) {
  const suggestions = [
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
      text: "Summarize a long article or document",
    },
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      text: "Write a python script to parse CSV files",
    },
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      text: "Draft a polite email to decline a meeting",
    },
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      text: "Explain quantum computing to a 5-year old",
    },
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      text: "Search the web for the latest tech news",
    },
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`,
      text: "Brainstorm 5 names for a new startup",
    },
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      text: "Help me debug a React component",
    },
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
      text: "Plan a 3-day trip to Tokyo",
    },
  ];

  const el = document.createElement("div");
  el.id = "emptyState";
  el.className = "flex flex-col justify-center min-h-[50vh] pt-12";

  el.innerHTML = `
    <div class="mb-8 md:mb-10 text-left">
      <h1 class="text-[26px] md:text-[32px] font-bold text-neutral-900 leading-tight mb-1">Hi, ${userName}</h1>
      <h2 class="text-[26px] md:text-[32px] font-bold text-neutral-600 leading-tight">What can I help you with?</h2>
      <p class="text-[12px] md:text-[13px] text-neutral-400 mt-3 md:mt-4 leading-relaxed font-medium">
        Choose a prompt below or write your own to start chatting with Denis.
      </p>
    </div>

    <!-- Suggestion grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 pb-8" id="suggestionGrid">
      ${suggestions
        .map(
          (s) => `
        <button
          class="suggestion-btn text-left flex items-center gap-3 p-3 md:p-3.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] transition w-full"
          data-text="${s.text}"
        >
          <div class="text-neutral-400 shrink-0">${s.icon}</div>
          <span class="text-[11px] md:text-[12px] font-medium text-neutral-600 leading-snug">${s.text}</span>
        </button>
      `,
        )
        .join("")}
    </div>
  `;

  // Wire up suggestion clicks
  el.querySelectorAll(".suggestion-btn").forEach((btn) => {
    btn.addEventListener("click", () => onSuggestionClick?.(btn.dataset.text));
  });

  return el;
}
