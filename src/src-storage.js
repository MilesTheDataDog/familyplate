// Storage wrapper for localStorage
export const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch (e) {
      return null;
    }
  },
  
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      return null;
    }
  },
  
  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (e) {
      return null;
    }
  },
  
  async list(prefix) {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      return { keys };
    } catch (e) {
      return { keys: [] };
    }
  }
};

// Make storage available globally
window.storage = storage;