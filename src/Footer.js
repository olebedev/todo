// @flow

import * as React from 'react';
import { GraphQL } from 'swarm-react';
import type { Response, Mutation } from 'swarm-react';

import { getFooterInfo, setState, removeTask } from './graphql';
import type { Item } from './graphql';

export default class Footer extends React.Component<{ id: string }> {
  onClearClick = ({
    items,
    remove,
  }: {
    items: Item[],
    remove: Mutation,
  }): void => {
    items.filter(i => i.completed).forEach(item => {
      remove({
        from: this.props.id,
        id: item.id,
      });
    });
  };

  onFilterClick = ({ event, set }: { event: Event, set: Mutation }): void => {
    event.preventDefault();
    // $FlowFixMe
    set({ state: { filter: event.target.hash.slice(2) } });
  };

  render() {
    return (
      <GraphQL
        query={getFooterInfo}
        variables={{ id: this.props.id }}
        mutations={{ setState, removeTask }}>
        {resp => {
          const { selected, count, set, remove, items } = select(resp);

          return (
            <footer className="footer">
              <span className="todo-count">
                <strong>{count}</strong> item{count !== 1 && 's'} left
              </span>
              <ul className="filters">
                <li>
                  <a
                    onClick={event => this.onFilterClick({ event, set })}
                    className={selected['']}
                    href="#/">
                    All
                  </a>
                </li>
                <li>
                  <a
                    className={selected.active}
                    onClick={event => this.onFilterClick({ event, set })}
                    href="#/active">
                    Active
                  </a>
                </li>
                <li>
                  <a
                    className={selected.completed}
                    onClick={event => this.onFilterClick({ event, set })}
                    href="#/completed">
                    Completed
                  </a>
                </li>
              </ul>
              <button
                onClick={() => this.onClearClick({ items, remove })}
                className="clear-completed">
                Clear completed
              </button>
            </footer>
          );
        }}
      </GraphQL>
    );
  }
}

function select({
  data,
  mutations: { setState: set, removeTask: remove },
}: Response<*>): {
  count: number,
  selected: {
    [string]: string,
  },
  set: Mutation,
  remove: Mutation,
  items: Item[],
} {
  const selected = {
    [data ? data.state.filter || '' : '']: 'selected',
  };
  const count = data
    ? data.tasks.list.filter(item => !item.completed).length
    : 0;
  const items = data ? data.tasks.list : [];
  return { selected, count, set, remove, items };
}
