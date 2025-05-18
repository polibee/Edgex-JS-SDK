/**
 * EdgeX WebSocket Manager
 * Manages WebSocket connections for real-time data
 */

const WebSocketClient = require('./client');

class WebSocketManager {
  /**
   * Create a new WebSocket manager
   * @param {string} baseURL - Base URL for WebSocket connections
   * @param {number} accountID - EdgeX account ID
   * @param {string} starkPrivateKey - Stark private key for signing
   */
  constructor(baseURL, accountID, starkPrivateKey) {
    this.baseURL = baseURL;
    this.accountID = accountID;
    this.starkPrivateKey = starkPrivateKey;
    this.publicClient = null;
    this.privateClient = null;
  }

  /**
   * Connect to the public WebSocket endpoint
   * @returns {Promise<void>}
   */
  async connectPublic() {
    if (this.publicClient) {
      return;
    }

    const url = `${this.baseURL}/api/v1/public/ws`;
    this.publicClient = new WebSocketClient(url, false, 0, "");
    await this.publicClient.connect();
  }

  /**
   * Connect to the private WebSocket endpoint
   * @returns {Promise<void>}
   */
  async connectPrivate() {
    if (this.privateClient) {
      return;
    }

    const url = `${this.baseURL}/api/v1/private/ws?accountId=${this.accountID}`;
    this.privateClient = new WebSocketClient(url, true, this.accountID, this.starkPrivateKey);
    await this.privateClient.connect();
  }

  /**
   * Subscribe to market ticker updates
   * @param {string} contractID - Contract ID
   * @param {Function} handler - Message handler function
   * @returns {Promise<void>}
   */
  async subscribeMarketTicker(contractID, handler) {
    if (!this.publicClient) {
      throw new Error("Public WebSocket connection not established");
    }

    this.publicClient.onMessage("ticker", handler);
    await this.publicClient.subscribe(`ticker.${contractID}`, null);
  }

  /**
   * Subscribe to K-line (candlestick) data
   * @param {string} contractID - Contract ID
   * @param {string} interval - Time interval (e.g., "1m", "5m", "1h")
   * @param {Function} handler - Message handler function
   * @returns {Promise<void>}
   */
  async subscribeKLine(contractID, interval, handler) {
    if (!this.publicClient) {
      throw new Error("Public WebSocket connection not established");
    }

    this.publicClient.onMessage("kline", handler);
    await this.publicClient.subscribe(`kline.LAST_PRICE.${contractID}.${interval}`, null);
  }

  /**
   * Subscribe to market depth updates
   * @param {string} contractID - Contract ID
   * @param {Function} handler - Message handler function
   * @returns {Promise<void>}
   */
  async subscribeDepth(contractID, handler) {
    if (!this.publicClient) {
      throw new Error("Public WebSocket connection not established");
    }

    this.publicClient.onMessage("depth", handler);
    await this.publicClient.subscribe(`depth.${contractID}`, null);
  }

  /**
   * Subscribe to trade updates
   * @param {string} contractID - Contract ID
   * @param {Function} handler - Message handler function
   * @returns {Promise<void>}
   */
  async subscribeTrade(contractID, handler) {
    if (!this.publicClient) {
      throw new Error("Public WebSocket connection not established");
    }

    this.publicClient.onMessage("trade", handler);
    await this.publicClient.subscribe(`trade.${contractID}`, null);
  }

  /**
   * Subscribe to account updates
   * @param {Function} handler - Message handler function
   * @returns {Promise<void>}
   */
  async subscribeAccount(handler) {
    if (!this.privateClient) {
      throw new Error("Private WebSocket connection not established");
    }

    this.privateClient.onMessage("account", handler);
    await this.privateClient.subscribe("account", null);
  }

  /**
   * Subscribe to position updates
   * @param {Function} handler - Message handler function
   * @returns {Promise<void>}
   */
  async subscribePosition(handler) {
    if (!this.privateClient) {
      throw new Error("Private WebSocket connection not established");
    }

    this.privateClient.onMessage("position", handler);
    await this.privateClient.subscribe("position", null);
  }

  /**
   * Subscribe to order updates
   * @param {Function} handler - Message handler function
   * @returns {Promise<void>}
   */
  async subscribeOrder(handler) {
    if (!this.privateClient) {
      throw new Error("Private WebSocket connection not established");
    }

    this.privateClient.onMessage("order", handler);
    await this.privateClient.subscribe("order", null);
  }

  /**
   * Close all WebSocket connections
   */
  close() {
    if (this.publicClient) {
      this.publicClient.close();
      this.publicClient = null;
    }

    if (this.privateClient) {
      this.privateClient.close();
      this.privateClient = null;
    }
  }
}

module.exports = WebSocketManager;