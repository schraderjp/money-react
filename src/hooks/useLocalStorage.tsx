import { useState, useEffect } from "react";

type InitialValue = any;

const useLocalStorage = (key: string, initialValue: InitialValue) => {
  const [value, setValue] = useState(getInitialValue());

  function getInitialValue() {
    let stored = localStorage.getItem(key);
    if (stored !== null) return JSON.parse(stored);
    if (typeof initialValue === "function") {
      return initialValue();
    } else {
      return initialValue;
    }
  }

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
};

export default useLocalStorage;
