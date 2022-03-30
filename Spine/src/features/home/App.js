import React from 'react';
import SpineLayout from './SpineLayout';

export default function App({ children }) {
  return (
    <div className="home-app">
      <div className="page-container">{children}</div>
      <SpineLayout></SpineLayout>
    </div>
  );
}
