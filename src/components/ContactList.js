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
        key={idx}
      />
    );
  }

  render() { 
    let testobj = {name: '整個好掉', image: 'images/ok-128.jpg', latMes: 'qq'};
    let arr = [];
    for(let i = 0; i < 10; i++) {arr.push(testobj);}
    console.log("contactlist");
    return(
      <MobileTearSheet left={false}>
        <List>
          {this.genChatList(arr)}
        </List>
      </MobileTearSheet>
    );
  }
};
