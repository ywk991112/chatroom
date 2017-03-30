import React from 'react';
import { connect } from 'react-redux';

import MessageList from '../components/MessageList';
import { sendMessage } from '../actions';
import '../css/chatBox.scss';

var handleKeyPress = (ev) => {
  if(ev.key == 'Enter') {
    console.log('send', ev.target.value);
    sendMessage({text: ev.target.value});
    ev.target.value = '';
  }
}

let ChatBox = ({ channel, sendMessage }) => (
  <div className="chat-app_right">
    <div className="heading">
      <div className="current-target">{ channel.username }</div>
    </div>
    <div className="message-list">
      <MessageList 
        history={channel.history}
      />
    </div>
    <div className="footer">
      <input className="new-message" type="text" onKeyPress={handleKeyPress}/>
    </div>
  </div>
)

const mapStateToProps = (state) => ({
  channel: state.chat.channel
})

const mapDispatchToProps = {
  sendMessage: sendMessage
}

ChatBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);


export default ChatBox;
