import AddSecret from '../secrets/add.react';
import Component from '../components/component.react';
import DocumentTitle from 'react-document-title';
import ListSecret from '../secrets/list.react';
import Logout from '../auth/logout.react';
import React from 'react';
import requireAuth from '../auth/requireauth.react';
import {format} from '../intl/store';

@requireAuth
export default class Index extends Component {

  static propTypes = {
    actions: React.PropTypes.object.isRequired,
    msg: React.PropTypes.object.isRequired,
    secrets: React.PropTypes.object.isRequired,
    users: React.PropTypes.object.isRequired
  };

  render() {
    const {
      actions, msg,
      secrets: {add: secret, list},
      users: {viewer}
    } = this.props;

    return (
      <DocumentTitle title={msg.me.title}>
        <div className="me-page">
          <p>{format(msg.me.welcome, {email: viewer.email})}</p>
          <AddSecret {...{actions, msg, secret, viewer}} />
          <ListSecret {...{actions, list, viewer}} />
          <Logout {...{actions, msg}} />
        </div>
      </DocumentTitle>
    );
  }

}
