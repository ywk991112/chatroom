import React from 'react';
import '../css/chatBox.scss';

export default class ChatBox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="chat-app_right">
        <div className="heading">
          <div className="current-target">Elsa</div>
        </div>
        <div className="message-list">
          <div className="message-item message-from-other">
            <span>對啊</span>
          </div>
          <div className="message-item message-from-other">
            <span>試著</span>
          </div>
          <div className="message-item message-from-other">
            <span>靠左邊嘛</span>
          </div>
          <div className="message-item message-from-me">
            <span>換我了</span>
          </div>
          <div className="message-item message-from-me">
            <span>有看到嗎</span>
          </div>
        </div>
        <div className="footer">
          <input className="new-message" type="text" />
        </div>
      </div>
    );
  }
};
