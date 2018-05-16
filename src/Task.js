// @flow

import * as React from 'react';
import type { Mutation } from 'swarm-react';
import type { Item } from './graphql';

type Props = {
  item: Item,
  remove: () => void,
  toggle: () => void,
};

export default class Task extends React.Component<Props> {
  render() {
    const { toggle, remove, item } = this.props;
    return (
      <li key={item.id} className={item.completed ? 'completed' : undefined}>
        <div className="view">
          <input
            id={item.id}
            onChange={toggle}
            className="toggle"
            type="checkbox"
            checked={item.completed}
          />
          <label htmlFor={item.id}>{item.title}</label>
          <button className="destroy" onClick={remove} />
        </div>
      </li>
    );
  }
}
