// components/ApiKeyModal.js
// Keys are fetched from /api/config — dotenv runs server-side, not in the browser.

// Express server base URL — update this if you change the port
const SERVER_URL = "http://localhost:3000";

let memoryKeys = { groq: "", tavily: "" };

// Fetch keys from the Express server at module load time
export const keysReady = fetch(`${SERVER_URL}/api/config`)
  .then((r) => r.json())
  .then(({ groq, tavily }) => {
    if (groq) memoryKeys.groq = groq;
    if (tavily) memoryKeys.tavily = tavily;
  })
  .catch(() => console.warn("/api/config unavailable — running in demo mode."));

export function getSavedKeys() {
  return { ...memoryKeys };
}

export function clearKeys() {
  memoryKeys.groq = "";
  memoryKeys.tavily = "";
}
