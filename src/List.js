// @flow

import * as React from 'react';
import { GraphQL } from 'swarm-react';
import type { Mutation, Response } from 'swarm-react';
import { UUID } from 'swarm-ron';

import { query, updateTask, removeTask } from './graphql';
import Task from './Task';
import type { Item } from './graphql';

export default class List extends React.Component<{ id: UUID }> {
  onToggleAllClick({
    tasks,
    update,
  }: {
    tasks: Item[],
    update: Mutation,
  }): void {
    const allChecked = !tasks.filter(i => !i.completed).length;
    tasks.forEach(i => {
      update({
        tid: i.id,
        patch: { completed: !allChecked },
      });
    });
  }

  render(): React.Node {
    return (
      <span>
        <GraphQL
          query={query}
          variables={{ id: this.props.id }}
          mutations={{ updateTask, removeTask }}>
          {resp => {
            const { filtered, all, allChecked, update, remove } = select(resp);
            return (
              <section className="main">
                <input
                  onChange={() => this.onToggleAllClick({ tasks: all, update })}
                  id="toggle-all"
                  className="toggle-all"
                  type="checkbox"
                  checked={allChecked}
                />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <ul className="todo-list">
                  {filtered.map(item => (
                    <Task
                      key={item.id}
                      id={this.props.id}
                      update={update}
                      remove={remove}
                      item={item}
                    />
                  ))}
                </ul>
              </section>
            );
          }}
        </GraphQL>
      </span>
    );
  }
}

function select(
  response: Response<{ tasks: Item[], state: { filter: string } }>,
): {
  filtered: Item[],
  all: Item[],
  allChecked: boolean,
  update: Mutation,
  remove: Mutation,
} {
  const {
    data,
    mutations: { updateTask: update, removeTask: remove },
  } = response;
  const all = (data || { tasks: [] }).tasks;
  const allChecked = !all.filter(i => !i.completed).length;
  const filtered =
    data && data.state.filter
      ? all.filter(
          i => (data.state.filter === 'active' ? !i.completed : i.completed),
        )
      : all;

  return {
    filtered,
    all,
    allChecked,
    update,
    remove,
  };
}
