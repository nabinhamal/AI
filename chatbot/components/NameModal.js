// components/NameModal.js
// Modal for entering the user's name on first load

const SESSION_USER_NAME = "lumina_user_name";

export function getSavedName() {
  return sessionStorage.getItem(SESSION_USER_NAME) || "";
}

export function saveName(name) {
  if (name) sessionStorage.setItem(SESSION_USER_NAME, name.trim());
}

export function clearName() {
  sessionStorage.removeItem(SESSION_USER_NAME);
}

export function showNameModal() {
  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className =
      "fixed inset-0 z-50 flex items-center justify-center modal-backdrop opacity-0 transition-opacity duration-200 p-4";

    backdrop.innerHTML = `
      <div id="nmCard"
        class="relative bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-sm p-6 translate-y-6 opacity-0 transition-all duration-300">

        <!-- Header -->
        <div class="flex flex-col items-center mb-6 text-center">
           <div class="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shadow-sm mb-4">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>
           </div>
          <h2 class="text-lg font-bold text-neutral-900">Welcome to Denis AI</h2>
          <p class="text-neutral-500 text-xs md:text-sm mt-2 leading-relaxed">
        Let's get started. Denis is ready to help you with your daily tasks and
        questions.
      </p>
        </div>

        <div class="mb-6">
          <input id="nmInput" type="text" placeholder="e.g. Gustavo"
            class="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-[15px] text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 transition shadow-sm text-center font-medium" />
        </div>

        <!-- Actions -->
        <button type="button" id="nmSave"
          class="w-full px-4 py-3 text-[14px] font-semibold text-white bg-neutral-900 hover:bg-black rounded-xl transition active:scale-95 shadow-md cursor-pointer">
          Continue
        </button>

      </div>
    `;

    document.body.appendChild(backdrop);
    const card = backdrop.querySelector("#nmCard");
    const inputEl = backdrop.querySelector("#nmInput");

    // Animate in
    requestAnimationFrame(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");
      card.classList.remove("translate-y-6", "opacity-0");
      card.classList.add("translate-y-0", "opacity-100");
      setTimeout(() => inputEl.focus(), 300);
    });

    let resolved = false;
    const close = (name) => {
      if (resolved) return;
      resolved = true;
      backdrop.classList.remove("opacity-100");
      backdrop.classList.add("opacity-0");
      card.classList.add("translate-y-6", "opacity-0");
      setTimeout(() => backdrop.remove(), 250);
      resolve(name);
    };

    const submit = () => {
      const name = inputEl.value.trim() || "Guest";
      saveName(name);
      close(name);
    };

    backdrop.querySelector("#nmSave").addEventListener("mousedown", (e) => {
      e.preventDefault();
      submit();
    });

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    });
  });
}
