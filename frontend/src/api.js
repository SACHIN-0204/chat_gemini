const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
};

const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, {
    method: "POST",
    body: JSON.stringify(body),
  }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export default api;