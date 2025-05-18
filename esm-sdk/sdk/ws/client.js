/**
 * EdgeX WebSocket Client (ESM Version)
 * Client for interacting with the EdgeX WebSocket API
 */

import WebSocketManager from './manager.js';

/**
 * WebSocket Client for EdgeX API
 */
class WebSocketClient {
  /**
   * Create a new WebSocket client
   * @param {WebSocketManager} manager - WebSocket manager
   */
  constructor(manager) {
    this.manager = manager;
  }

  /**
   * Connect to the public WebSocket API
   * @returns {Promise<void>}
   */
  async connectPublic() {
    return this.manager.connectPublic();
  }

  /**
   * Connect to the private WebSocket API
   * @returns {Promise<void>}
   */
  async connectPrivate() {
    return this.manager.connectPrivate();
  }

  /**
   * Subscribe to market ticker updates
   * @param {string} contractId - Contract ID
   * @param {Function} callback - Callback function for ticker updates
   * @returns {Promise<void>}
   */
  async subscribeMarketTicker(contractId, callback) {
    return this.manager.subscribeMarketTicker(contractId, callback);
  }

  /**
   * Subscribe to account updates
   * @param {Function} callback - Callback function for account updates
   * @returns {Promise<void>}
   */
  async subscribeAccountUpdates(callback) {
    return this.manager.subscribeAccountUpdates(callback);
  }

  /**
   * Close all WebSocket connections
   */
  close() {
    this.manager.close();
  }
}

export default WebSocketClient;