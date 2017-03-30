import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

const Contact = ({ onclick, username, id }) => {
  <ListItem
    primaryText={ username }
    leftAvatar={<Avatar src={'images/hao123.jpg'} />}
    key={ id }
  />
}

export default Contact;
