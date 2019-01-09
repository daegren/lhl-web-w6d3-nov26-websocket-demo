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
    this.socket = new WebSocket('ws://localhost:3001');

    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    this.socket.onmessage = payload => {
      console.log('Got message from server', payload);
      this.setState({ messages: [...this.state.messages, payload.data] });
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
            <div className="message">{msg}</div>
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

    this.socket.send(content);

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
