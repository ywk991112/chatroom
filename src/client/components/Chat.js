import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';

const Chat = ({ onclick, username, id, last_msg, last_time }) => {
  <ListItem
    primaryText={ username }
    leftAvatar={<Avatar src={'images/hao123.jpg'} />}
    key={ id }
  />
  <ListItem
    primaryText={ username }
    leftAvatar={<Avatar src={'images/hao123.jpg'} />}
    secondaryText={
      <p>
        { last_msg }
      </p>
    }
    rightIcon={<CommunicationChatBubble />}
    key={idx}
  />
}

export default Chat;
