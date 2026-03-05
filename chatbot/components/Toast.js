// components/Toast.js
// Lightweight toast notification system

// Singleton container — appended once to the body
let container = null;

function getContainer() {
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className =
      "fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none";
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Show a toast notification.
 * @param {Object} options
 * @param {"success"|"error"|"info"|"warning"} options.type
 * @param {string} options.message
 * @param {number} [options.duration] — ms before auto-dismiss (default 3500)
 */
export function showToast({
  type = "info",
  message = "",
  duration = 3500,
} = {}) {
  const cfg =
    {
      success: {
        bar: "bg-emerald-500",
        icon: checkIcon(),
        text: "text-emerald-400",
      },
      error: {
        bar: "bg-red-500",
        icon: xIcon(),
        text: "text-red-400",
      },
      warning: {
        bar: "bg-amber-400",
        icon: warnIcon(),
        text: "text-amber-400",
      },
      info: {
        bar: "bg-indigo-500",
        icon: infoIcon(),
        text: "text-indigo-400",
      },
    }[type] || {};

  const toast = document.createElement("div");
  toast.className = [
    "pointer-events-auto relative flex items-center gap-3",
    "bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl",
    "px-4 py-3 min-w-[260px] max-w-xs overflow-hidden",
    "opacity-0 translate-y-2 transition-all duration-300",
  ].join(" ");

  toast.innerHTML = `
    <!-- Colored left bar -->
    <div class="absolute left-0 top-0 bottom-0 w-1 ${cfg.bar} rounded-l-xl"></div>

    <!-- Icon -->
    <div class="shrink-0 ml-1 ${cfg.text}">${cfg.icon}</div>

    <!-- Message -->
    <span class="text-sm text-neutral-200 leading-snug flex-1">${message}</span>

    <!-- Dismiss button -->
    <button class="toast-dismiss shrink-0 text-neutral-600 hover:text-neutral-300 transition ml-1">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <!-- Progress bar -->
    <div class="toast-progress absolute bottom-0 left-0 h-0.5 ${cfg.bar} opacity-40 rounded-full" style="width:100%;transition:width ${duration}ms linear"></div>
  `;

  getContainer().appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.remove("opacity-0", "translate-y-2");
      toast.classList.add("opacity-100", "translate-y-0");
      // Shrink progress bar
      toast.querySelector(".toast-progress").style.width = "0%";
    });
  });

  const dismiss = () => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector(".toast-dismiss").addEventListener("click", dismiss);
  setTimeout(dismiss, duration);
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const svg = (path) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const checkIcon = () => svg('<polyline points="20 6 9 17 4 12"/>');
const xIcon = () =>
  svg(
    '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  );
const warnIcon = () =>
  svg(
    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  );
const infoIcon = () =>
  svg(
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  );
