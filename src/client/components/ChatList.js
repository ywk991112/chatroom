import React from 'react';

import MobileTearSheet from './MobileTearSheet';
import Chat from './Chat';

import Avatar from 'material-ui/Avatar';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

const ChatList = ({ friends, onChatClick }) => (
  <MobileTearSheet left={true}>
    <List>
      <Subheader>Chat List</Subheader>
      {friends.map(friend => 
        <Chat
          {...friend}
          onClick={() => onChatClick(friend.username)}
        />
      )}
    </List>
  </MobileTearSheet>
);

export default ChatList;
