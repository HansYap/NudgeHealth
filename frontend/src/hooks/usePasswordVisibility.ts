import { useCallback, useState } from "react";

interface UsePasswordVisibilityReturn {
  isVisible: boolean;
  inputType: "password" | "text";
  toggle: () => void;
}

export function usePasswordVisibility(
  initialVisible = false
): UsePasswordVisibilityReturn {
  const [isVisible, setIsVisible] = useState(initialVisible);

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return {
    isVisible,
    inputType: isVisible ? "text" : "password",
    toggle,
  };
}
