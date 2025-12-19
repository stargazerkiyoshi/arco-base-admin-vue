const parse = <T>(value: string | null): T | null => {
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

export const storage = {
  set: (key: string, value: unknown): void => {
    if (value === undefined) {
      localStorage.removeItem(key);
      return;
    }
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  },
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    const raw = localStorage.getItem(key);
    const parsed = parse<T>(raw);
    return parsed === null ? defaultValue : parsed;
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  },
};

export default storage;
