const DEFAULT_API_URL = "http://localhost:8000/api/v1";

export const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

export const WS_BASE_URL =
  import.meta.env.VITE_WS_URL ||
  (() => {
    try {
      const url = new URL(API_BASE_URL);
      const protocol = url.protocol === "https:" ? "wss:" : "ws:";
      return `${protocol}//${url.host}${url.pathname}`;
    } catch {
      const startsWithHttps = API_BASE_URL.startsWith("https");
      return startsWithHttps
        ? API_BASE_URL.replace(/^https/, "wss")
        : API_BASE_URL.replace(/^http/, "ws");
    }
  })();
