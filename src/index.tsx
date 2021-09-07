/** DEPENDENCIES */
import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

/** COMPOMENTS */
import App from './common/components/App/App';

/** STYLES */
import './common/styles/reset.scss';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
