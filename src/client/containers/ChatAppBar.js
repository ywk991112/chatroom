import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dehaze from 'material-ui/svg-icons/image/dehaze';

export default class ChatAppBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  handleLogout = () => console.log("logout")

  render() {
    return (
      <div>
        <AppBar
          title="Chatroom"
          iconElementLeft={<IconButton onTouchTap={this.handleToggle}><Dehaze /></IconButton>}
          iconElementRight={<FlatButton label="logout" onTouchTap={this.handleLogout} />}
        />
        <Drawer
          docked={false}
          width={300}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem onTouchTap={this.handleClose}>Notifications & Sounds</MenuItem>
          <MenuItem onTouchTap={this.handleClose}>Report a problem</MenuItem>
          <MenuItem onTouchTap={this.handleClose}>Help</MenuItem>
          <MenuItem onTouchTap={this.handleClose}>Privacy & Terms</MenuItem>
        </Drawer>
      </div>
    );
  }
}
