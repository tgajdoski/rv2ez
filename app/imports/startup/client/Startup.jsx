import React from 'react';
import ReactDOM from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/App.jsx';

// Startup the application by rendering the App layout component.
Meteor.startup(async () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root'),
  );
  root.render(<App />);
});
