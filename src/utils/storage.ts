/**
 * Utility for managing namespaced localStorage to separate data between Landing and CRM applications
 */

export type AppNamespace = 'landing' | 'crm';

class NamespacedStorage {
  private namespace: string;

  constructor(namespace: AppNamespace) {
    this.namespace = namespace;
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  getItem(key: string): string | null {
    return localStorage.getItem(this.getKey(key));
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(this.getKey(key), value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    const namespacePrefix = `${this.namespace}:`;
    
    keys.forEach(key => {
      if (key.startsWith(namespacePrefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Helper methods for common operations
  getJSON<T>(key: string, defaultValue: T): T {
    const item = this.getItem(key);
    if (!item) return defaultValue;
    
    try {
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }

  setJSON<T>(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value));
  }
}

// Create instances for each application
export const landingStorage = new NamespacedStorage('landing');
export const crmStorage = new NamespacedStorage('crm');

// Helper function to get the appropriate storage based on current app
export function getAppStorage(): NamespacedStorage {
  // Check if we're in CRM context by looking at the current URL or environment
  const isCrm = window.location.port === '8081' || 
                window.location.pathname.includes('/crm') ||
                import.meta.env.VITE_APP === 'crm';
  
  return isCrm ? crmStorage : landingStorage;
}

// Legacy compatibility - gradually migrate to namespaced storage
export const storage = {
  getItem: (key: string) => getAppStorage().getItem(key),
  setItem: (key: string, value: string) => getAppStorage().setItem(key, value),
  removeItem: (key: string) => getAppStorage().removeItem(key),
  clear: () => getAppStorage().clear(),
  getJSON: <T>(key: string, defaultValue: T) => getAppStorage().getJSON(key, defaultValue),
  setJSON: <T>(key: string, value: T) => getAppStorage().setJSON(key, value)
};