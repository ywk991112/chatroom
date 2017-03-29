import React from 'react';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';

import OrderChatList from './OrderChatList';
import ContactList from './ContactList';
import ChatBox from '../components/ChatBox';
import changeSlide from '../actions';
import '../css/NavBar.scss'

import {Tabs, Tab} from 'material-ui/Tabs';
import People from 'material-ui/svg-icons/social/people';
import Chat from 'material-ui/svg-icons/communication/chat';

let NavBar = ({ slideIndex, onSlideClick }) => {
  <div>
    <Tabs
      onChange={onSlideClick}
      value={slideIndex}
    >
      <Tab icon={<People />} value={0} />
      <Tab icon={<Chat />} value={1} />
    </Tabs>
    <SwipeableViews
      className="slide"
      index={ slideIndex }
      onChangeIndex={onSlideClick}
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
}

const mapStateToProps = (state) => ({
  slideIndex: state.slideIndex
})

const mapDispatchToProps = {
  onSlideClick: changeSlide
}

NavBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar)
