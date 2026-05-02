import { useCallback, useEffect, useRef, useState } from 'react';

type State<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

/**
 * Mini-hook para llamadas async sin tener que meter `react-query`.
 * Soporta refetch manual y se cancela en unmount.
 */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
): State<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const mounted = useRef(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoFn = useCallback(fn, deps);

  const refetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await memoFn();
      if (mounted.current) setState({ data, loading: false, error: null });
    } catch (error) {
      if (mounted.current) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }
  }, [memoFn]);

  useEffect(() => {
    mounted.current = true;
    refetch();
    return () => {
      mounted.current = false;
    };
  }, [refetch]);

  return { ...state, refetch };
}
