// @flow
import gql from 'graphql-tag';
import { UUID } from '@swarm/db';

// Local UUIDs are not affected to server's data
const STATE = UUID.fromString('state').local();

export type Item = {
  id: string,
  uuid: UUID,
  title: string,
  completed: boolean,
};

export const query = gql`
  subscription List($id: UUID!) {
    tasks @node(id: $id) @slice(begin: 0) {
      id
      uuid
      title
      completed
    }
    state @node(id: "${STATE.toString()}") {
      filter
    }
  }
`;

export const updateTask = gql`
  mutation UpdateTask($tid: UUID!, $patch: Payload!) {
    updated: set(id: $tid, payload: $patch)
  }
`;

export const addTask = gql`
  mutation AddTask($tid: UUID!, $task: Payload!, $listID: UUID!) {
    created: set(id: $tid, payload: $task)
    added: add(id: $listID, value: $tid)
  }
`;

export const removeTask = gql`
  mutation RemoveTask($from: UUID!, $id: UUID!) {
    deleted: remove(id: $from, value: $id)
  }
`;

export const setState = gql`
  mutation UpdateAppState($state: Payload!) {
    updated: set(id: "${STATE.toString()}", payload: $state)
  }
`;

export const getFooterInfo = gql`
  subscription GetFooterInfo($id:  UUID!) {
    state @node(id: "${STATE.toString()}") {
      filter
    }
    tasks @node(id: $id) {
      id
      length
      version
      list: id @slice(begin: 0) {
        id: uuid
        completed
      }
    }
  }
`;
