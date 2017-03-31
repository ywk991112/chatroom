import React from 'react';
import { connect } from 'react-redux';

import MessageList from '../components/MessageList';
import { sendMessage } from '../actions';
import '../css/chatBox.scss';


class ChatBox extends React.Component {
  constructor(props) {
    super(props);
  }

  handleKeyPress = (ev) => {
    const { user, username, sendMessage } = this.props;
    if(ev.key == 'Enter') {
      sendMessage({user, username, text: ev.target.value});
      ev.target.value = '';
    }
  }

  render() {
    const { channel } = this.props;
    return(
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
  }
}
const mapStateToProps = (state) => ({
  user: state.login.user,
  channel: state.chat.channel,
  username: state.chat.channel.username
})

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (fromName, toName, text) => 
    dispatch(sendMessage(fromName, toName, text))
})

ChatBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);


export default ChatBox;
