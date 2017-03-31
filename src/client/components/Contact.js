import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

const Contact = ({ onClick, username, id }) => (
  <ListItem
    primaryText={ username }
    leftAvatar={<Avatar src={'images/hao123.jpg'} />}
    key={ id }
    onClick={onClick}
  />
)

export default Contact;
