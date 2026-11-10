import { useEffect, useState } from 'react';

export type LoadState = 'loading' | 'slow' | 'ready' | 'error';

export function useImageAsset(source: string) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>('loading');
  const url = attempt ? `${source}?retry=${attempt}` : source;

  useEffect(() => {
    let active = true;
    const image = new Image();
    setState('loading');
    const timer = window.setTimeout(() => {
      if (active) setState('slow');
    }, 15000);
    const finish = (next: LoadState) => {
      if (!active) return;
      window.clearTimeout(timer);
      setState(next);
    };
    image.onload = () => finish('ready');
    image.onerror = () => finish('error');
    image.src = url;
    return () => {
      active = false;
      window.clearTimeout(timer);
      image.onload = image.onerror = null;
    };
  }, [url]);

  const retry = () => {
    setState('loading');
    setAttempt((value) => value + 1);
  };
  return { url, state, retry };
}

export function LoadNotice({
  state,
  subject,
  onRetry,
}: {
  state: LoadState;
  subject: string;
  onRetry: () => void;
}) {
  if (state === 'ready') return null;
  return (
    <div className="load-notice" role="status" aria-live="polite">
      <span>
        {state === 'error'
          ? `Couldn't load ${subject}.`
          : state === 'slow'
            ? `${subject} is taking longer to load.`
            : `Loading ${subject}…`}
      </span>
      {(state === 'error' || state === 'slow') && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
