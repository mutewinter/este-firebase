import './add.styl';
import Component from '../components/component.react';
import React from 'react';

export default class Add extends Component {

  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    msg: React.PropTypes.object.isRequired,
    secret: React.PropTypes.object.isRequired,
    viewer: React.PropTypes.object.isRequired
  };

  onInputKeyDown(e) {
    if (e.key !== 'Enter') return;
    if (!e.target.value.trim()) return;
    const {actions, secret, viewer} = this.props;
    actions.secrets.add(secret, viewer);
  }

  render() {
    const {
      actions: {secrets: actions},
      msg: {secrets: {add: msg}},
      secret
    } = this.props;

    return (
      <div className="secrets-add">
        <input
          autoFocus
          name="text"
          onChange={actions.setAddField}
          onKeyDown={::this.onInputKeyDown}
          placeholder={msg.placeholder}
          value={secret.text}
        />
      </div>
    );
  }

}
