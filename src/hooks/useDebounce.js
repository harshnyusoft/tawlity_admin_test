import { useEffect, useState } from 'react';

/**
 * useDebounce - Debounce a value by a given delay
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in ms
 * @returns {any} - Debounced value
 */
export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
} 