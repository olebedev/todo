// @flow

import * as React from 'react';
import { GraphQL } from 'swarm-react';
import type { Mutation } from 'swarm-react';
import { UUID } from 'swarm-ron';

import { addTask } from './graphql';

export default class Header extends React.Component<{ id: UUID }> {
  onSubmit({
    add,
    id,
    event,
  }: {
    id: UUID,
    event: Event,
    add: Mutation,
  }): void {
    event.preventDefault();
    // $FlowFixMe
    const title = event.currentTarget.firstChild.value.trim();
    if (title) {
      // $FlowFixMe
      event.currentTarget.firstChild.value = '';
      add({
        tid: id,
        task: { title, completed: false },
        listID: this.props.id,
      });
    }
  }

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <GraphQL mutations={{ addTask }}>
          {({ mutations: { addTask: add }, uuid }) => (
            <form onSubmit={event => this.onSubmit({ event, add, id: uuid() })}>
              <input
                className="new-todo"
                placeholder="What needs to be done?"
                autoFocus
              />
            </form>
          )}
        </GraphQL>
      </header>
    );
  }
}
