'use client';

// Keeps one short message (like "Comment added") that any page can read.
// It lives in the layout, so the message stays when you move to another page.
import { createContext, useContext, useState } from 'react';

// The box that holds the message. The empty string means "no message".
const MessageContext = createContext({ message: '', showMessage: () => {} });

// Put this around the pages so they can share the message.
export function MessageProvider({ children }) {
  const [message, setMessage] = useState('');

  // Pages call this to set a message, for example showMessage('Comment added')
  function showMessage(text) {
    setMessage(text);
  }

  return (
    <MessageContext.Provider value={{ message, showMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

// A short way for a component to read the message or set a new one.
export function useMessage() {
  return useContext(MessageContext);
}
