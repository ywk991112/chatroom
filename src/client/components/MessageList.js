import React, { PropTypes } from 'react';
import Message from './Message';

const MessageList = ({ history }) => (
  <div>
    {history.map(message =>
      <Message
        send={message.send}
        text={message.text}
      />
    )}
  </div>
)

export default MessageList;
