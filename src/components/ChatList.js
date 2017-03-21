import React from 'react';
import MobileTearSheet from './MobileTearSheet';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

export default class ChatList extends React.Component {
  constructor(props) {
    super(props);
  }

  genChatList = (arr) => {
    return arr.map((obj, idx) =>
      <ListItem
        primaryText={obj.name}
        leftAvatar={<Avatar src={obj.image} />}
        secondaryText={
          <p>
            {obj.latMes}
          </p>
        }
        rightIcon={<CommunicationChatBubble />}
        key={idx}
      />
    );
  }

  render() { 
    let testobj = {name: 'a34021501', image: 'images/ok-128.jpg', latMes: 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'};
    let arr = [];
    for(let i = 0; i < 10; i++) {arr.push(testobj);}
    return(
      <MobileTearSheet left={true}>
        <List>
          <Subheader>Recent chats</Subheader>
          {this.genChatList(arr)}
        </List>
        <Divider />
        <List>
          <Subheader>Previous chats</Subheader>
          {this.genChatList(arr)}
        </List>
      </MobileTearSheet>
    );
  }
};
