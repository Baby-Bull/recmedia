import { useEffect, useRef } from "react";

const useLatest = <T extends unknown>(current: T) => {
  const storedValue = useRef(current);
  useEffect(() => {
    storedValue.current = current;
  });
  return storedValue;
};

export default useLatest;
