import { useCallback, useEffect } from "react";
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  onClickOutside: () => void
) => {
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onClickOutside();
    }
  }, [ref, onClickOutside]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);
};