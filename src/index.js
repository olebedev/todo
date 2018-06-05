// @flow

import * as React from 'react';
import ReactDOM from 'react-dom';
import isTouch from 'is-touch-device';
import SwarmDB, { LocalStorage as Storage, Verbose } from '@swarm/db';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

window.document.body.dataset['touch'] = isTouch();
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
    window.addEventListener('focus', () => {
      swarm.close();
      swarm.open();
    });
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
