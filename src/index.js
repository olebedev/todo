// @flow

import * as React from 'react';
import ReactDOM from 'react-dom';

import SwarmDB from 'swarm-db';
import { LocalStorage as Storage } from 'swarm-client';
import { Verbose } from 'swarm-client/lib/connection';

import App from './App';

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
  .catch(err => {
    console.error(err);
  });

ReactDOM.render(
  <App swarm={swarm} />,
  // $FlowFixMe
  rootEl,
);

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
