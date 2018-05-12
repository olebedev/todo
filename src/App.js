// @flow

import * as React from 'react';
import { UUID } from 'swarm-ron';
import SwarmDB from 'swarm-db';
import { Provider } from 'swarm-react';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

import './index.css';
import Header from './Header';
import List from './List';
import Footer from './Footer';

class App extends React.Component<{ swarm: SwarmDB }, { id: ?UUID }> {
  constructor(props: *, context: *) {
    super(props, context);
    // grab a list id from the hash, trim '#/' prefix
    const id = UUID.fromString(window.location.hash.slice(2));
    this.state = {
      id: !id.isZero() && !id.isError() ? id : null,
    };

    if (!this.state.id || this.state.id.isZero()) {
      // create new uuid  but wait for
      // swarm to be initialized first
      this.props.swarm.ensure().then(() => {
        const id = this.props.swarm.uuid();
        this.setState(
          { id },
          () => (window.location.hash = `#/${id.toString()}`),
        );
      });
    }

    window.addEventListener('hashchange', this.onHashChange);
  }

  onHashChange = (): void => {
    const id = UUID.fromString(window.location.hash.slice(2));
    console.log('hash changed to', id);
    if (!id.isError() && !id.isZero()) {
      this.setState({ id });
    } else {
      // change window.location back to valid id
      window.location.hash = `#/${(this.state.id || '').toString()}`;
    }
  };

  componentWillUnmount(): void {
    window.removeEventListener('hashchange', this.onHashChange);
  }

  render() {
    const { id } = this.state;
    if (!id) return <div>loading...</div>;
    return (
      <Provider swarm={this.props.swarm}>
        <span>
          <Header id={id} />
          <List id={id} />
          <Footer id={id} />
        </span>
      </Provider>
    );
  }
}

export default App;
