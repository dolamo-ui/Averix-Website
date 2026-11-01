'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type ShowToast = (message: string, ms?: number) => void;

const ToastContext = createContext<ShowToast>(() => {});

/** Call `const toast = useToast(); toast('Saved')` from any component inside <PageFrame>. */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children, defaultMs = 2400 }: { children: ReactNode; defaultMs?: number }) {
  const [state, setState] = useState({ message: '', on: false });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback<ShowToast>(
    (message, ms = defaultMs) => {
      clearTimeout(timer.current);
      setState({ message, on: true });
      timer.current = setTimeout(() => setState((s) => ({ ...s, on: false })), ms);
    },
    [defaultMs],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div id="toast" role="status" aria-live="polite" className={state.on ? 'on' : undefined}>
        {state.message}
      </div>
    </ToastContext.Provider>
  );
}
