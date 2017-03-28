import React from 'react';
import SwipeableViews from 'react-swipeable-views';

import OrderChatList from '../containers/OrderChatList';
import ContactList from '../containers/ContactList';
import ChatBox from './ChatBox';
import '../css/NavBar.scss'

import {Tabs, Tab} from 'material-ui/Tabs';
import People from 'material-ui/svg-icons/social/people';
import Chat from 'material-ui/svg-icons/communication/chat';

export default class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab icon={<People />} value={0} />
          <Tab icon={<Chat />} value={1} />
        </Tabs>
        <SwipeableViews
          className="slide"
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div className="slide">
            <ContactList />
          </div>
          <div className="slide">
            <OrderChatList />
            <ChatBox />
          </div>
        </SwipeableViews>
      </div>
    );
  }
}
