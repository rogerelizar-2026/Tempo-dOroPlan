import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { load, save } from "../lib/core";

/** Estado React espelhado em localStorage (sobrevive a recargas e funciona offline) */
export function useStored<T>(
  key: string,
  initial: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => load(key, initial));
  useEffect(() => {
    save(key, value);
  }, [key, value]);
  return [value, setValue];
}
