import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import People from 'material-ui/svg-icons/social/people';
import Chat from 'material-ui/svg-icons/communication/chat';
import SwipeableViews from 'react-swipeable-views';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    height: 'calc(100vh - 112px)',
  },
};

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
          style={styles.slide}
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div style={styles.slide}>
            slide n°1
          </div>
          <div style={styles.slide}>
            <ChatList />
            <ChatBox />
          </div>
        </SwipeableViews>
      </div>
    );
  }
}
