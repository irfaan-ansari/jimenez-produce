export const storage = {
  get<T>(key: string, fallback?: T): T | undefined {
    if (typeof window === "undefined") return fallback;

    try {
      const value = window.localStorage.getItem(key);

      if (!value) return fallback;

      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T) {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },

  remove(key: string) {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
