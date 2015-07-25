import './list.styl';
import Component from '../components/component.react';
import React from 'react';
import listenFirebase from '../firebase/listenfirebase';

@listenFirebase((props, firebase) => ({
  action: props.actions.secrets.onFirebaseSecrets,
  ref: firebase
    .child('secrets')
    .child(props.viewer.id)
}))
export default class List extends Component {

  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
    viewer: React.PropTypes.object.isRequired
  };

  delete(secret) {
    const {actions, viewer} = this.props;
    actions.secrets.delete(secret, viewer);
  }

  render() {
    const {list} = this.props;

    return (
      <div className="secrets-list">
        <ul>
          {list.map(secret =>
            <li key={secret.id}>
              {secret.text}{' '}
              <button onClick={() => this.delete(secret)}>x</button>
            </li>
          )}
        </ul>
      </div>
    );
  }

}
