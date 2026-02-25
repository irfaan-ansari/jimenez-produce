import { useState, useCallback } from "react";

type SetValue<T> = T;

export function useLocalStorage<T>(key: string, initialValue?: T) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error setting localStorage key:", key, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error("Error removing localStorage key:", key, error);
    }
  }, [key]);

  return {
    value: storedValue,
    set: setValue,
    remove: removeValue,
  };
}
