import { API_BASE_URL } from "src/config/api";

function getStoredAuthToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

function getErrorMessageFromResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json().then((j) => j?.statusMessage || j?.message || JSON.stringify(j));
  }
  return res.text().then((t) => t || res.statusText);
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const {
    method = "GET",
    body,
    headers = {},
    credentials = "include",
  } = options;

  const token = getStoredAuthToken();
  const authHeader =
    token && !("Authorization" in headers) && !("authorization" in headers)
      ? { Authorization: `Bearer ${token}` }
      : {};

  const fetchOptions = {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...authHeader,
      ...headers,
    },
    credentials,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const err = new Error(await getErrorMessageFromResponse(res));
    err.status = res.status;
    throw err;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return await res.json();
  return await res.text();
}

