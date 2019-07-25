'use strict';

import queryString from 'query-string';
// import WebSocket from 'ws'
import WebSocket from 'promise-ws'
// import 'isomorphic-ws';

export default class WebsocketConnection {
  constructor(options = {}) {
    this.options = options;
    this.socket = {};
    this.listeners = {};
  }

  /**
   * Connect to a given @websocketURL with given @options query params.
   * The client will connect and bind every on "message" event to the
   * onMessage() function.
   *
   * In order to handle a message, the on() member function must be used to add
   * an listener. This gives functionality similar to socket.io, in which
   * it is possible to so something like:
   *
   * socket.on('error', err => {})
   * as opposed to:
   * socket.on('message', message => { if (message.signal === 'error')... })
   *
   * @param  {String} websocketURL - WSS address of websocket API
   * @param  {Object} options - JSON-formatted connection query params
   * @param  {String} options.role - Either "initiator" or "receiver" accordingly
   * @param  {String} options.connId - Last 32 characters of the public key portion of the key-pair
   *                                  created for the particular paired connection
   * @param  {String} options.signed - Private key signed with the private key created for the connection
   */
  async connect(websocketUrl, options = {}) {
    if (!websocketUrl) websocketUrl = 'wss://0ec2scxqck.execute-api.us-west-1.amazonaws.com/dev';
    let url = `${websocketUrl}?${queryString.stringify(options)}`;
    console.log(url); // todo remove dev item
    this.socket = await WebSocket.create(url);
    this.socket.on('message', this.onMessage.bind(this));
    // if(typeof jest !== 'undefined'){
    //   this.socket = await WebSocket.create(url);
    //   this.socket.on('message', this.onMessage.bind(this));
    // } else {
    //   // this.socket = new WebSocket(url);
    //   // this.socket.onmessage = this.onMessage.bind(this);
    // }
  }

  async disconnect() {
    console.log("ADD DISCONNECT FUNCTIONALITY"); // todo remove dev item
  }

  /**
   * On 'message' event, parse the message and if possible,
   * call the event listener with the message's particular signal.
   *
   * Messages are received as stringified JSON objects, that when parsed,
   * take the following format:
   *
   * {
   *   signal, // This is the signal that the member function on() can bind to
   *   data, // The actual data payload
   *   message // Accompanying server message
   * }
   *
   * @param  {String} message - Stringified JSON payload sent by the server
   * @return {[type]}         [description]
   */
  onMessage(message) {
    console.log('message', message); // todo remove dev item
    const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
    const signal = parsedMessage.signal;
    const data = parsedMessage.data;

    try {
      this.listeners[signal].call(this, data);
    } catch (e) {
      // Unhandled message signal
    }
  }

  /**
   * Bind an function to a particular message signal event.
   * E.G.
   * socket.on('error', err => {})
   *
   * @param  {String} signal - The signal to listen for
   * @param  {Function} fn - Function to perform on message signal
   */
  on(signal, fn) {
    this.listeners[signal] = fn;
  }

  /**
   * Unbind a particular message signal event listener.
   *
   * @param  {String} signal - The signal to unbind
   */
  off(signal) {
    delete this.listeners[signal];
  }

  /**
   * Send a data payload to a particular signal.
   *
   * @param  {String} signal - Particular action/signal such as "offersignal"
   * @param  {[type]} data - Data payload
   */
  send(signal, data = {}) {
    const message = JSON.stringify({
      action: signal,
      data: data
    });
    console.log('sending', message); // todo remove dev item
    this.socket.send(message);
  }
}
