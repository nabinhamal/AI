// components/TypingIndicator.js
// Animated dots matching Lumina AI design

export function createTypingIndicator() {
  const wrapper = document.createElement("div");
  wrapper.id = "typingIndicator";
  wrapper.className = "flex gap-4 msg-animate w-full pt-2 pl-1";

  wrapper.innerHTML = `
    <!-- Avatar -->
    <div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-neutral-200 bg-white text-neutral-900 shadow-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>
    </div>
    
    <div class="flex items-center gap-3">
      <!-- Dots bubble -->
      <div class="bg-white border border-neutral-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5 h-[46px]">
        <span class="typing-dot w-1.5 h-1.5 bg-neutral-400 rounded-full inline-block"></span>
        <span class="typing-dot w-1.5 h-1.5 bg-neutral-400 rounded-full inline-block"></span>
        <span class="typing-dot w-1.5 h-1.5 bg-neutral-400 rounded-full inline-block"></span>
      </div>
      <span class="text-[12px] font-medium text-neutral-400">Denis is thinking...</span>
    </div>
  `;

  return wrapper;
}
