const LOCAL_API_URL = "http://127.0.0.1:8000";

function isLocalHostname(hostname) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && isLocalHostname(window.location.hostname)) {
    return LOCAL_API_URL;
  }

  // For remotely hosted frontends, require an explicit API URL so we don't
  // silently fall back to localhost inside the visitor's browser.
  return "";
}
