// components/ApiKeyModal.js
// Modal for uploading a local .env file

let memoryKeys = {
  groq: "",
  tavily: "",
};

export function getSavedKeys() {
  return { ...memoryKeys };
}

export function clearKeys() {
  memoryKeys.groq = "";
  memoryKeys.tavily = "";
}

export function showApiKeyModal() {
  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className =
      "fixed inset-0 z-50 flex items-center justify-center modal-backdrop opacity-0 transition-opacity duration-200 p-4";

    backdrop.innerHTML = `
      <div id="akCard"
        class="relative bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-md p-6 translate-y-6 opacity-0 transition-all duration-300">

        <!-- Header -->
        <div class="flex items-start gap-4 mb-6">
           <div class="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0 shadow-sm">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
           </div>
          <div>
            <h2 class="text-base font-bold text-neutral-900">Upload .env File</h2>
            <p class="text-[13px] text-neutral-500 mt-1 leading-relaxed font-medium">
              Select your local .env file containing GROQ_API_KEY and TAVILY_API_KEY. Keys are kept securely in memory for this session only.
            </p>
          </div>
        </div>

        <div class="mb-6 relative">
          <input type="file" id="envFileInput" accept=".env" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div class="border-2 border-dashed border-neutral-300 text-neutral-500 rounded-xl px-4 py-8 text-center bg-neutral-50 hover:bg-neutral-100 transition shadow-sm flex flex-col items-center justify-center gap-2">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span id="envFileLabel" class="text-[14px] font-medium">Click to select .env file</span>
          </div>
          <p id="envFileError" class="text-red-500 text-xs mt-2 hidden">Invalid file or missing GROQ_API_KEY.</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <button type="button" id="akSkip"
            class="flex-1 px-4 py-2.5 text-[14px] font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 hover:border-neutral-300 rounded-xl transition cursor-pointer">
            Skip to Demo
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(backdrop);
    const card = backdrop.querySelector("#akCard");
    const fileInput = backdrop.querySelector("#envFileInput");
    const fileLabel = backdrop.querySelector("#envFileLabel");
    const errorLabel = backdrop.querySelector("#envFileError");

    // Animate in
    requestAnimationFrame(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");
      card.classList.remove("translate-y-6", "opacity-0");
      card.classList.add("translate-y-0", "opacity-100");
    });

    let resolved = false;
    const close = (result) => {
      if (resolved) return;
      resolved = true;
      backdrop.classList.remove("opacity-100");
      backdrop.classList.add("opacity-0");
      card.classList.add("translate-y-6", "opacity-0");
      setTimeout(() => backdrop.remove(), 250);
      resolve(result);
    };

    // File Parse Logic
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      fileLabel.textContent = file.name;
      errorLabel.classList.add("hidden");

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        let groq = "";
        let tavily = "";

        // Extremely naive .env parse logic
        const lines = text.split(/\r?\n/);
        for (const line of lines) {
          const match = line.match(/^\s*([^=]+?)\s*=\s*(.*)$/);
          if (match) {
            const key = match[1].trim();
            const val = match[2].trim().replace(/^['"]|['"]$/g, ""); // strip quotes

            if (key === "GROQ_API_KEY") groq = val;
            if (key === "TAVILY_API_KEY") tavily = val;
          }
        }

        if (groq) {
          memoryKeys.groq = groq;
          memoryKeys.tavily = tavily;
          fileLabel.classList.add("text-emerald-500");
          setTimeout(() => close({ groq, tavily }), 600);
        } else {
          errorLabel.classList.remove("hidden");
          fileLabel.textContent = "Click to select .env file";
          fileInput.value = "";
        }
      };

      reader.onerror = () => {
        errorLabel.textContent = "Error reading file";
        errorLabel.classList.remove("hidden");
      };

      reader.readAsText(file);
    });

    backdrop.querySelector("#akSkip").addEventListener("mousedown", (e) => {
      e.preventDefault();
      close(null);
    });
  });
}
