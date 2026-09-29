import { useEffect, useState } from 'react';

/**
 * Debounces a rapidly-changing value. The Angular version fired an API call on
 * every keystroke of the patient search box; this is the fix for that.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
