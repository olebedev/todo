// @flow

import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import SwarmDB from 'swarm-db';
import { UUID } from 'swarm-ron';
import { Provider, GraphQL } from 'swarm-react';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

import './index.css';
import Header from './Header';
import List from './List';
import Footer from './Footer';

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

const Todo = ({ match: { params } }) => {
  const uuid = UUID.fromString(params.id);
  if (uuid.isError() || uuid.isZero()) {
    return <CreateTodo />;
  }
  return (
    <span>
      <Header id={params.id} />
      <List id={params.id} />
      <Footer id={params.id} />
    </span>
  );
};

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
