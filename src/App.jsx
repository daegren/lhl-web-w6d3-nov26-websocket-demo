import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      content: ''
    };
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://172.46.3.175:3001');

    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    this.socket.onmessage = payload => {
      console.log('Got message from server', payload);
      const json = JSON.parse(payload.data);

      switch (json.type) {
        case 'text-message':
          this.setState({
            messages: [...this.state.messages, json]
          });
          break;
        case 'initial-messages':
          this.setState({ messages: json.messages });
          break;
        default:
      }
    };

    this.socket.onclose = () => {
      console.log('Disconnected from the WebSocket');
    };
  }

  render() {
    return (
      <div>
        <h1>React WebSocket Demo</h1>
        <header>
          <form onSubmit={this._sendContent}>
            <input
              type="text"
              value={this.state.content}
              onChange={this._updateState('content')}
              placeholder="Say something cool!"
            />
            <button type="submit">☠️</button>
          </form>
        </header>
        <main>
          <h2>Messages</h2>
          {this.state.messages.map(msg => (
            <Message msg={msg} />
          ))}
        </main>
      </div>
    );
  }

  _updateState = key => e => {
    this.setState({ [key]: e.target.value });
  };

  _sendContent = e => {
    e.preventDefault();
    const { content } = this.state;

    const objectToSend = {
      type: 'text-message',
      content
    };

    this.socket.send(JSON.stringify(objectToSend));

    this.setState({ content: '' });
  };

  // Same as above but using plain functions instead of arrows
  // _updateState = function(key) {
  //   return function(e) {
  //     this.setState({ [key]: e.target.value });
  //   };
  // };
}
export default App;

const Message = ({ msg }) => {
  const date = new Date(msg.date);

  return (
    <div className="message" key={msg.id}>
      {date.toLocaleString('en-CA')}: {msg.content}
    </div>
  );
};
