import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AuthExample from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <AuthExample />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
