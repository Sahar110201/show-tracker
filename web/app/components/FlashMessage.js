'use client';

// The green bar at the top of the page that shows the shared message.
// It sits in the layout, so it works on every page.
import { useEffect } from 'react';
import { useMessage } from './MessageContext';

export default function FlashMessage() {
  const { message, showMessage } = useMessage();

  // When a new message arrives, hide it again after 4 seconds.
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => showMessage(''), 4000);

    // React runs this when the message changes, so old timers are cleared.
    return () => clearTimeout(timer);
  }, [message, showMessage]);

  // Nothing to show yet
  if (!message) {
    return null;
  }

  return (
    <p className="flash" role="status">
      {message}
      <button type="button" className="flash-close" onClick={() => showMessage('')}>
        Close
      </button>
    </p>
  );
}
