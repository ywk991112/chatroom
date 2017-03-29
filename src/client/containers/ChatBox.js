import React from 'react';

import MessageList from '../components/MessageList';
import sendMessage from '../actions';
import '../css/chatBox.scss';

let ChatBox = ({ channel, sendMessage }) => {
  <div className="chat-app_right">
    <div className="heading">
      <div className="current-target">{ channel.username }</div>
    </div>
    <div className="message-list">
      {
      }
    </div>
    <div className="footer">
      <input className="new-message" type="text" />
    </div>
  </div>
}

const mapStateToProps = (state) => ({
  channel: state.channel
})

const mapDispatchToProps ={
  sendMessage: sendMessage
}

ChatBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);


export default ChatBox;
