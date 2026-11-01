export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`tax_hub_${key}`);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage, using default`, err);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`tax_hub_${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to write ${key} to localStorage`, err);
  }
}

export function clearTaxHubStorage(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('tax_hub_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Failed to clear tax-hub storage', err);
  }
}
