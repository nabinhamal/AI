// components/EnvDB.js
// A small wrapper around IndexedDB for storing the FileSystemFileHandle to the .env file

const DB_NAME = "Denis_AI_DB";
const STORE_NAME = "envStore";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveEnvHandle(handle) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(handle, "envHandle");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getEnvHandle() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get("envHandle");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearEnvHandle() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).delete("envHandle");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function parseEnvFromHandle(handle) {
  if (!handle) return { groq: "", tavily: "" };

  // Verify permission
  const options = { mode: "read" };
  if ((await handle.queryPermission(options)) !== "granted") {
    if ((await handle.requestPermission(options)) !== "granted") {
      throw new Error("Permission to read .env file was denied on the disk.");
    }
  }

  const file = await handle.getFile();
  const text = await file.text();

  let groq = "";
  let tavily = "";
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([^=]+?)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^['"]|['"]$/g, "");
      if (key === "GROQ_API_KEY") groq = val;
      if (key === "TAVILY_API_KEY") tavily = val;
    }
  }
  return { groq, tavily };
}
