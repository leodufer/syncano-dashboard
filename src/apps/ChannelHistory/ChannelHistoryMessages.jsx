import React from 'react';
import { withRouter } from 'react-router';
import Reflux from 'reflux';

import ChannelHistoryStore from './ChannelHistoryStore';

import ChannelHistory from './ChannelHistory';

const ChannelHistoryMessages = React.createClass({
  mixins: [Reflux.connect(ChannelHistoryStore)],

  render() {
    const { channelName } = this.props.params;

    return <ChannelHistory channelName={channelName} />;
  }
});

export default withRouter(ChannelHistoryMessages);
