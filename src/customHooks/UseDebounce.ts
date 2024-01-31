import { useCallback, useEffect, useRef } from "react";

import useLatest from "./UseLatest";

const useDebounce = <CallbackArgs extends unknown[]>(
  // eslint-disable-next-line no-unused-vars
  callback: (...args: CallbackArgs) => void,
  wait = 250, // miliseconds
  fireImmediately = false,
  // eslint-disable-next-line no-unused-vars
): ((...args: CallbackArgs) => void) => {
  const storedCallback = useLatest(callback);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const deps = [wait, fireImmediately, storedCallback];
  useEffect(
    () =>
      // clean up: remove timeout when component unmount or deps change
      () => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
        timeout.current = undefined;
      },
    deps,
  );
  // eslint-disable-next-line consistent-return
  return useCallback((...args) => {
    const { current } = timeout;
    // Calls immediately if set true
    if (!current && fireImmediately) {
      timeout.current = setTimeout(() => {
        timeout.current = undefined;
      }, wait);
      return storedCallback.current.apply(null, args as any);
    }
    // Clear the timeout every call and start waiting again
    if (current) {
      clearTimeout(current);
    }
    // Waits for `wait` before invoking the callback
    timeout.current = setTimeout(() => {
      timeout.current = undefined;
      storedCallback.current.apply(null, args as any);
    }, wait);
  }, deps);
};

export default useDebounce;
