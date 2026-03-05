// components/EmptyState.js
// Welcome screen matching Lumina AI screenshot

export function createEmptyState({
  userName = "Guest",
  onSuggestionClick,
} = {}) {
  const suggestions = [
    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
      text: "Consolidate financial data from all subsidiaries",
    },

    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      text: "Generate the monthly income statement",
    },

    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      text: "Reconcile the bank accounts for March",
    },

    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      text: "Book a journal entry",
    },

    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
      text: "Provide a 12-month cash flow forecast",
    },

    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      text: "Generate the quarterly profit and loss statement",
    },

    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
      text: "Show the budget variance for Q1 compared to actuals",
    },

    {
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
      text: "Create a real-time financial performance dashboard",
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
        Choose a prompt below or write your own to start chatting with Lumina.
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
