// @flow

import * as React from 'react';
import ReactDOM from 'react-dom';

import SwarmDB from 'swarm-db';
import { LocalStorage as Storage } from 'swarm-client';
import { Verbose } from 'swarm-client/lib/connection';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

// workaround previous hash navigation
(function() {
  const prev = window.location.hash.replace(/^(#?\/?)/, '');
  if (prev) window.history.pushState({}, document.title, `/todo/${prev}`);
})();

const rootEl = document.getElementsByClassName('todoapp')[0];

const swarm = new SwarmDB({
  storage: new Storage(),
  upstream: new Verbose('ws://0.0.0.0:31415'),
  db: { name: 'default', clockLen: 7 },
});

swarm
  .ensure()
  .then(() => {
    console.log('initialized');
  })
  .catch(panic);

swarm.client.panic = panic;

ReactDOM.render(
  <App swarm={swarm} />,
  // $FlowFixMe
  rootEl,
);
registerServiceWorker();

if (module.hot) {
  // $FlowFixMe
  module.hot.accept('./App', () => {
    // $FlowFixMe
    const Next = require('./App').default;
    ReactDOM.render(
      <Next swarm={swarm} />,
      // $FlowFixMe
      rootEl,
    );
  });
}

function panic(err) {
  console.error(err);
  console.warn('the page will be reloaded in 5 seconds');
  setTimeout(() => {
    localStorage.clear();
    window.location.reload();
  }, 5000);
}
