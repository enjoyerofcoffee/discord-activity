/// <reference types="vite/client" />

// Types for the environment variables the client reads.
// Only variables starting with VITE_ are exposed to the browser.
// Never add the client secret here: it belongs to the server only.
interface ImportMetaEnv {
  readonly VITE_DISCORD_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
