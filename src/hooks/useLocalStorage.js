import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // State ni localStorage dan o'qish
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Agar item bor bo'lsa, parse qil, bo'lmasa initialValue ni ishlat
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log('LocalStorage o\'qishda xatolik:', error);
      return initialValue;
    }
  });

  // State o'zgarganda localStorage ga yozish
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log('LocalStorage yozishda xatolik:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}