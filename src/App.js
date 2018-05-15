// @flow

import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import SwarmDB from 'swarm-db';
import { Provider, GraphQL } from 'swarm-react';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

import './index.css';
import Header from './Header';
import List from './List';
import Footer from './Footer';

const Todo = ({ match: { params } }) => (
  <span>
    <Header id={params.id} />
    <List id={params.id} />
    <Footer id={params.id} />
  </span>
);

const CreateTodo = () => (
  <GraphQL>
    {({ uuid }) => {
      // waiting for swarm to be initialized
      if (uuid) {
        return <Redirect to={`/${uuid().toString()}`} />;
      }
      return <div className="creating">Creating todo list ...</div>;
    }}
  </GraphQL>
);

const App = ({ swarm }: { swarm: SwarmDB }) => {
  return (
    <Provider swarm={swarm}>
      <Router basename="/todo">
        <Switch>
          <Route exact path="/:id" component={Todo} />
          <Route component={CreateTodo} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
