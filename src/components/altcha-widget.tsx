'use client';

import { useSyncExternalStore } from 'react';
import 'altcha';
import type {} from 'altcha/types/react';

interface AltchaWidgetProps {
  /** URL of the route that issues challenges. */
  challengeUrl: string;
  /** Called with the payload to send to the server once the challenge is solved. */
  onVerified: (payload: string) => void;
}

const subscribe = () => () => {};

export function AltchaWidget({ challengeUrl, onVerified }: Readonly<AltchaWidgetProps>) {
  // The widget is a web component, so render it on the client only.
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const attachListeners = (widget: HTMLElement | null) => {
    if (!widget) return;

    const handleStateChange = (ev: Event) => {
      const { state, payload } = (ev as CustomEvent<{ state: string; payload?: string }>).detail ?? {};
      if (state === 'verified' && payload) {
        onVerified(payload);
      }
    };

    widget.addEventListener('statechange', handleStateChange);
    return () => widget.removeEventListener('statechange', handleStateChange);
  };

  if (!isClient) {
    return null;
  }

  return <altcha-widget ref={attachListeners} challenge={challengeUrl}></altcha-widget>;
}
