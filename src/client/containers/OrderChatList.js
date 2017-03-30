import { connect } from 'react-redux';

import { requestHistory } from '../actions';
import ChatList from '../components/ChatList';

const compare = (a, b) => {
  if (a.last_time < b.last_time)
    return -1;
  if (a.last_time > b.last_time)
    return 1;
  return 0;
}

const mapStateToProps = (state) => ({
  friends: state.login.friends.sort(compare),
  user: state.login.user
})

const mapDispatchToProps = {
  onChatClick: requestHistory
}

const OrderChatList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatList);

export default OrderChatList;
