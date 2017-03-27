import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import ContactList from './ContactList';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import '../css/NavBar.scss'
import People from 'material-ui/svg-icons/social/people';
import Chat from 'material-ui/svg-icons/communication/chat';
import SwipeableViews from 'react-swipeable-views';

export default class TabsExampleSwipeable extends React.Component {

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
            <ChatList />
            <ChatBox />
          </div>
        </SwipeableViews>
      </div>
    );
  }
}
