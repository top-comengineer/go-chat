//file name: ChatInput.jsx
//date: 3/25/2023
import React, { Component } from 'react';
import './ChatInput.scss';

class ChatInput extends Component {
  
  render() {
    return (
      <div className='ChatInput'>
        <input onKeyDown={this.props.send} placeholder="Type a message... Hit Enter to Send"/>
      </div>
    );
  };

}

export default ChatInput;
