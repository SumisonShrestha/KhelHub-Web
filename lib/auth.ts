const TOKEN_KEY = "khelhub_token";
const USER_KEY = "khelhub_user";

export const authStorage = {
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  setUser: (user: unknown) =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: () => {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },
  removeUser: () => localStorage.removeItem(USER_KEY),

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
