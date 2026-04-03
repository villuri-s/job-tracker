const TOKEN_KEY = "token";
const USERNAME_KEY = "username";

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedJson = decodeURIComponent(
      atob(normalizedPayload)
        .split("")
        .map((character) => `%${`00${character.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(decodedJson);
  } catch {
    return null;
  }
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || "";

export const isTokenExpired = (token = getStoredToken()) => {
  if (!token) {
    return true;
  }

  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return Date.now() >= payload.exp * 1000;
};

export const getStoredUsername = () => {
  const storedUsername = localStorage.getItem(USERNAME_KEY);

  if (storedUsername) {
    return storedUsername;
  }

  const payload = decodeJwtPayload(getStoredToken());
  return payload?.username || payload?.sub || "User";
};

export const hasValidSession = () => {
  const token = getStoredToken();
  return Boolean(token) && !isTokenExpired(token);
};

export const saveSession = (token, username) => {
  localStorage.setItem(TOKEN_KEY, token);

  if (username) {
    localStorage.setItem(USERNAME_KEY, username);
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
};
