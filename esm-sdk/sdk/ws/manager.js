/**
 * EdgeX WebSocket Manager (ESM Version)
 * Manages WebSocket connections to the EdgeX API
 */

import WebSocket from 'ws';
import { sign } from '../utils/stark.js';

/**
 * WebSocket Manager for EdgeX API
 */
class WebSocketManager {
  /**
   * Create a new WebSocket manager
   * @param {string} baseURL - Base URL for API
   * @param {number} accountID - EdgeX account ID
   * @param {string} starkPrivateKey - Stark private key for signing
   */
  constructor(baseURL, accountID, starkPrivateKey) {
    this.baseURL = baseURL;
    this.accountID = accountID;
    this.starkPrivateKey = starkPrivateKey;
    this.publicWs = null;
    this.privateWs = null;
    this.subscriptions = new Map();
  }

  /**
   * Connect to the public WebSocket API
   * @returns {Promise<void>}
   */
  async connectPublic() {
    return new Promise((resolve, reject) => {
      // Convert HTTP/HTTPS URL to WS/WSS URL
      const wsUrl = this.baseURL.replace(/^http/, 'ws') + '/ws/public';
      
      this.publicWs = new WebSocket(wsUrl);
      
      this.publicWs.on('open', () => {
        console.log('Connected to public WebSocket');
        resolve();
      });
      
      this.publicWs.on('error', (error) => {
        console.error('Public WebSocket error:', error);
        reject(error);
      });
      
      this.publicWs.on('close', () => {
        console.log('Public WebSocket connection closed');
        this.publicWs = null;
      });
      
      this.publicWs.on('message', (data) => {
        this._handleMessage(data);
      });
    });
  }

  /**
   * Connect to the private WebSocket API
   * @returns {Promise<void>}
   */
  async connectPrivate() {
    if (!this.accountID || !this.starkPrivateKey) {
      throw new Error('Account ID and Stark private key are required for private WebSocket');
    }
    
    return new Promise((resolve, reject) => {
      // Convert HTTP/HTTPS URL to WS/WSS URL
      const wsUrl = this.baseURL.replace(/^http/, 'ws') + '/ws/private';
      
      this.privateWs = new WebSocket(wsUrl);
      
      this.privateWs.on('open', () => {
        console.log('Connected to private WebSocket');
        this._authenticate();
        resolve();
      });
      
      this.privateWs.on('error', (error) => {
        console.error('Private WebSocket error:', error);
        reject(error);
      });
      
      this.privateWs.on('close', () => {
        console.log('Private WebSocket connection closed');
        this.privateWs = null;
      });
      
      this.privateWs.on('message', (data) => {
        this._handleMessage(data);
      });
    });
  }

  /**
   * Subscribe to market ticker updates
   * @param {string} contractId - Contract ID
   * @param {Function} callback - Callback function for ticker updates
   * @returns {Promise<void>}
   */
  async subscribeMarketTicker(contractId, callback) {
    if (!this.publicWs) {
      throw new Error('Public WebSocket not connected');
    }
    
    const channel = `ticker:${contractId}`;
    this.subscriptions.set(channel, callback);
    
    const message = {
      op: 'subscribe',
      channel: channel
    };
    
    this.publicWs.send(JSON.stringify(message));
  }

  /**
   * Subscribe to account updates
   * @param {Function} callback - Callback function for account updates
   * @returns {Promise<void>}
   */
  async subscribeAccountUpdates(callback) {
    if (!this.privateWs) {
      throw new Error('Private WebSocket not connected');
    }
    
    const channel = 'account';
    this.subscriptions.set(channel, callback);
    
    const message = {
      op: 'subscribe',
      channel: channel
    };
    
    this.privateWs.send(JSON.stringify(message));
  }

  /**
   * Handle incoming WebSocket messages
   * @private
   * @param {Buffer} data - Message data
   */
  _handleMessage(data) {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.channel && this.subscriptions.has(message.channel)) {
        const callback = this.subscriptions.get(message.channel);
        callback(data);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  /**
   * Authenticate with the private WebSocket
   * @private
   */
  _authenticate() {
    if (!this.privateWs) {
      return;
    }
    
    const timestamp = Date.now();
    const signContent = `${timestamp}CONNECT/ws/private`;
    
    // In a real implementation, this would use the actual Stark signing
    const signature = sign(this.starkPrivateKey, signContent);
    
    const authMessage = {
      op: 'auth',
      accountId: this.accountID,
      timestamp: timestamp,
      signature: signature.r + signature.s
    };
    
    this.privateWs.send(JSON.stringify(authMessage));
  }

  /**
   * Close all WebSocket connections
   */
  close() {
    if (this.publicWs) {
      this.publicWs.close();
      this.publicWs = null;
    }
    
    if (this.privateWs) {
      this.privateWs.close();
      this.privateWs = null;
    }
    
    this.subscriptions.clear();
  }
}

export default WebSocketManager;