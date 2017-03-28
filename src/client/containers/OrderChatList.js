import { connect } from 'react-redux';

import { changeChannel } from '../actions';
import ChatList from '../componenets/ChatList';

const compare = (a, b) => {
  if (a.last_time < b.last_time)
    return -1;
  if (a.last_time > b.last_time)
    return 1;
  return 0;
}

const mapStateToProps = (state) => ({
  friends: friends.sort(compare)
})

const mapDispatchToProps = {
  onChatClick: changeChannel
}

const OrderChatList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatList);

export default OrderChatList;
