import React from 'react';
import { connect } from 'react-redux';

import { requestHistory } from '../actions';
import MobileTearSheet from '../components/MobileTearSheet';
import Contact from '../components/Contact';

import Avatar from 'material-ui/Avatar';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

let ContactList = ({ user, friends, onContactClick }) => (
  <MobileTearSheet left={false}>
    <List>
      {friends.map(friend => 
        <Contact
          {...friend}
          onClick={(ev) => 
              onContactClick(user, friend.username)}
        />
      )}
    </List>
  </MobileTearSheet>
);

const mapStateToProps = (state) => ({
  friends: state.login.friends,
  user: state.login.user
})

const mapDispatchToProps = (dispatch) => ({
  onContactClick: (fromName, toName) => {
    dispatch(requestHistory(fromName, toName))
  }
})

ContactList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactList);

export default ContactList
