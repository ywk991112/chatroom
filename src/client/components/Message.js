import React, { PropTypes } from 'react';

const Message = ({ send, text }) => {
  <div className={ "message-item " +  send ? "message-from-me" : "message-from-other" }>
    <span>{text}</span>
  </div>
}

Message.propTypes = {
  send: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

export default Message;
