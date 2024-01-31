import { useCallback, useLayoutEffect, useState } from "react";

import useOnScreenKeyboardScrollFix from "./UseOnScreenKeyboardScrollFix";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  const getHeight = useCallback(() => (window.visualViewport ? window.visualViewport.height : window.innerHeight), []);
  const getWidth = useCallback(() => (window.visualViewport ? window.visualViewport.width : window.innerWidth), []);

  useOnScreenKeyboardScrollFix();

  useLayoutEffect(() => {
    function updateSize() {
      setSize([getWidth(), getHeight()]);
    }
    window.addEventListener("resize", updateSize);
    window.addEventListener("orientationchange", updateSize);
    // This is needed on iOS to resize the viewport when the Virtual/OnScreen
    // Keyboard opens. This does not trigger any other event, or the standard
    // resize event.
    window.visualViewport?.addEventListener("resize", updateSize);
    updateSize();
    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("orientationchange", updateSize);
      window.visualViewport?.removeEventListener("resize", updateSize);
    };
  }, [getHeight, getWidth]);
  return size;
};

export default useWindowSize;
