// components/Alert.js
// Custom modal alert/confirm dialog — replaces window.alert() and window.confirm()

/**
 * Show a custom alert/confirm dialog.
 * Returns a Promise that resolves to true (confirm) or false (cancel).
 *
 * @param {Object} options
 * @param {"info"|"warning"|"danger"} options.type
 * @param {string} options.title
 * @param {string} options.message
 * @param {string} [options.confirmText]
 * @param {string} [options.cancelText]
 * @param {boolean} [options.showCancel] — set false for alert-only mode
 */
export function showAlert({
  type = "info",
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
} = {}) {
  return new Promise((resolve) => {
    // ── Backdrop ──────────────────────────────────────────────────────────
    const backdrop = document.createElement("div");
    backdrop.className = [
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-black/60 backdrop-blur-sm",
      "opacity-0 transition-opacity duration-200",
    ].join(" ");

    // ── Dialog ────────────────────────────────────────────────────────────
    const dialog = document.createElement("div");
    dialog.className = [
      "relative bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl",
      "w-full max-w-sm mx-4 p-6",
      "translate-y-4 opacity-0 transition-all duration-200",
    ].join(" ");

    // ── Icon colors ───────────────────────────────────────────────────────
    const iconConfig = {
      info: {
        bg: "bg-indigo-500/10",
        ring: "ring-indigo-500/20",
        icon: infoIcon(),
        dot: "bg-indigo-400",
      },
      warning: {
        bg: "bg-amber-500/10",
        ring: "ring-amber-500/20",
        icon: warningIcon(),
        dot: "bg-amber-400",
      },
      danger: {
        bg: "bg-red-500/10",
        ring: "ring-red-500/20",
        icon: dangerIcon(),
        dot: "bg-red-400",
      },
    };
    const cfg = iconConfig[type] || iconConfig.info;

    // ── Button colors ─────────────────────────────────────────────────────
    const btnClass = {
      info: "bg-indigo-600 hover:bg-indigo-500 text-white",
      warning: "bg-amber-500 hover:bg-amber-400 text-neutral-950",
      danger: "bg-red-600 hover:bg-red-500 text-white",
    }[type];

    dialog.innerHTML = `
      <div class="flex items-start gap-4 mb-5">
        <div class="shrink-0 w-10 h-10 rounded-xl ${cfg.bg} ring-1 ${cfg.ring} flex items-center justify-center">
          ${cfg.icon}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-semibold text-white leading-tight mb-1">${title}</h3>
          <p class="text-sm text-neutral-400 leading-relaxed">${message}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 justify-end">
        ${
          showCancel
            ? `<button id="alertCancel"
                class="px-4 py-2 text-sm text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition font-medium">
                ${cancelText}
               </button>`
            : ""
        }
        <button id="alertConfirm"
          class="px-4 py-2 text-sm rounded-xl font-medium transition ${btnClass}">
          ${confirmText}
        </button>
      </div>
    `;

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    // ── Animate in ────────────────────────────────────────────────────────
    requestAnimationFrame(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");
      dialog.classList.remove("translate-y-4", "opacity-0");
      dialog.classList.add("translate-y-0", "opacity-100");
    });

    // ── Close helper ──────────────────────────────────────────────────────
    const close = (result) => {
      backdrop.classList.remove("opacity-100");
      backdrop.classList.add("opacity-0");
      dialog.classList.add("translate-y-4", "opacity-0");
      setTimeout(() => backdrop.remove(), 200);
      resolve(result);
    };

    dialog
      .querySelector("#alertConfirm")
      .addEventListener("click", () => close(true));
    if (showCancel) {
      dialog
        .querySelector("#alertCancel")
        .addEventListener("click", () => close(false));
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) close(false);
      });
    }

    // ── Keyboard: Enter = confirm, Escape = cancel ─────────────────────
    const onKey = (e) => {
      if (e.key === "Enter") {
        close(true);
        document.removeEventListener("keydown", onKey);
      }
      if (e.key === "Escape") {
        close(false);
        document.removeEventListener("keydown", onKey);
      }
    };
    document.addEventListener("keydown", onKey);
  });
}

// ── SVG Icons ────────────────────────────────────────────────────────────────
const svgWrap = (color, path) =>
  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const infoIcon = () =>
  svgWrap(
    "#818cf8",
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  );
const warningIcon = () =>
  svgWrap(
    "#fbbf24",
    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  );
const dangerIcon = () =>
  svgWrap(
    "#f87171",
    '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  );
