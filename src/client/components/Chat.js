import React, { PropTypes } from 'react';
import Avatar from 'material-ui/Avatar';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import { ListItem } from 'material-ui/List';

const Chat = ({ onClick, username, id, last_msg, last_time }) => (
  <ListItem
    primaryText={ username }
    leftAvatar={<Avatar src={'images/hao123.jpg'} />}
    secondaryText={
      <p>
        { last_msg }
      </p>
    }
    rightIcon={<CommunicationChatBubble />}
    key={id}
    onClick={onClick}
  />
)

export default Chat;
