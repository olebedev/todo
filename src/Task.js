// @flow

import * as React from 'react';
import { UUID } from 'swarm-ron';
import type { Mutation } from 'swarm-react';
import type { Item } from './graphql';

type Props = {
  id: UUID,
  update: Mutation,
  remove: Mutation,
  item: Item,
};

export default class Task extends React.Component<Props> {
  render() {
    const { id, update, remove, item } = this.props;
    return (
      <li key={item.id} className={item.completed ? 'completed' : undefined}>
        <div className="view">
          <input
            id={item.id}
            onChange={() =>
              update({
                tid: item.id,
                patch: { completed: !item.completed },
              })
            }
            className="toggle"
            type="checkbox"
            checked={item.completed}
          />
          <label htmlFor={item.id}>{item.title}</label>
          <button
            className="destroy"
            onClick={() =>
              remove({
                from: id,
                id: item.uuid,
              })
            }
          />
        </div>
      </li>
    );
  }
}
