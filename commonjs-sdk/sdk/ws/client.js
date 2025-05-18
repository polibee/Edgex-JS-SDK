/**
 * EdgeX WebSocket Client
 * Client for WebSocket connections to EdgeX API
 */

const WebSocket = require('ws');
const crypto = require('crypto-js');

class WebSocketClient {
  /**
   * Create a new WebSocket client
   * @param {string} url - WebSocket URL
   * @param {boolean} isPrivate - Whether this is a private connection
   * @param {number} accountID - EdgeX account ID (for private connections)
   * @param {string} starkPrivateKey - Stark private key (for private connections)
   */
  constructor(url, isPrivate, accountID, starkPrivateKey) {
    this.url = url;
    this.isPrivate = isPrivate;
    this.accountID = accountID;
    this.starkPrivateKey = starkPrivateKey;
    this.conn = null;
    this.handlers = new Map();
    this.subscriptions = new Set();
    this.pingInterval = null;
    this.onConnectHooks = [];
    this.onMessageHooks = [];
    this.onDisconnectHooks = [];
  }

  /**
   * Connect to the WebSocket server
   * @returns {Promise<void>}
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        // Create headers for authentication if needed
        const headers = {};
        
        if (this.isPrivate) {
          const timestamp = Date.now();
          headers['X-edgeX-Api-Timestamp'] = timestamp.toString();
          
          // Generate signature content
          const path = new URL(this.url).pathname + '?accountId=' + this.accountID;
          const signContent = `${timestamp}GET${path}`;
          
          // Hash the content using Keccak-256
          const messageHash = crypto.SHA3(signContent, { outputLength: 256 });
          const messageHashHex = messageHash.toString(crypto.enc.Hex);
          
          // Sign the message hash (simplified for demo)
          const r = crypto.SHA256(this.starkPrivateKey + messageHashHex + 'r').toString(crypto.enc.Hex);
          const s = crypto.SHA256(this.starkPrivateKey + messageHashHex + 's').toString(crypto.enc.Hex);
          
          // Add signature headers
          headers['X-edgeX-Api-Signature'] = r + s;
          headers['X-edgeX-Api-AccountId'] = this.accountID.toString();
        }
        
        // Create WebSocket connection
        this.conn = new WebSocket(this.url, { headers });
        
        // Set up event handlers
        this.conn.on('open', () => {
          console.log(`WebSocket connected to ${this.url}`);
          
          // Start ping interval
          this.pingInterval = setInterval(() => {
            if (this.conn && this.conn.readyState === WebSocket.OPEN) {
              this.conn.send(JSON.stringify({ type: 'ping' }));
            }
          }, 30000); // Send ping every 30 seconds
          
          // Resubscribe to previous subscriptions
          this.subscriptions.forEach(channel => {
            this._subscribe(channel);
          });
          
          // Call connect hooks
          this.onConnectHooks.forEach(hook => hook());
          
          resolve();
        });
        
        this.conn.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString());
            
            // Handle pong response
            if (message.type === 'pong') {
              return;
            }
            
            // Call message hooks
            this.onMessageHooks.forEach(hook => hook(data));
            
            // Call specific message type handlers
            if (message.type && this.handlers.has(message.type)) {
              this.handlers.get(message.type)(data);
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        });
        
        this.conn.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.onDisconnectHooks.forEach(hook => hook(error));
          reject(error);
        });
        
        this.conn.on('close', (code, reason) => {
          console.log(`WebSocket closed: ${code} ${reason}`);
          
          // Clear ping interval
          if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
          }
          
          // Call disconnect hooks
          this.onDisconnectHooks.forEach(hook => hook(new Error(`Connection closed: ${code} ${reason}`)));
        });
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Subscribe to a channel
   * @param {string} channel - Channel to subscribe to
   * @param {Object} params - Additional parameters
   * @returns {Promise<void>}
   */
  async subscribe(channel, params) {
    this.subscriptions.add(channel);
    
    if (this.conn && this.conn.readyState === WebSocket.OPEN) {
      await this._subscribe(channel, params);
    }
  }

  /**
   * Internal method to send subscription message
   * @private
   */
  _subscribe(channel, params) {
    return new Promise((resolve, reject) => {
      try {
        const message = {
          type: 'subscribe',
          channel,
          ...(params || {})
        };
        
        this.conn.send(JSON.stringify(message));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Unsubscribe from a channel
   * @param {string} channel - Channel to unsubscribe from
   * @returns {Promise<void>}
   */
  async unsubscribe(channel) {
    this.subscriptions.delete(channel);
    
    if (this.conn && this.conn.readyState === WebSocket.OPEN) {
      const message = {
        type: 'unsubscribe',
        channel
      };
      
      this.conn.send(JSON.stringify(message));
    }
  }

  /**
   * Register a message handler for a specific message type
   * @param {string} type - Message type
   * @param {Function} handler - Handler function
   */
  onMessage(type, handler) {
    this.handlers.set(type, handler);
  }

  /**
   * Register a hook to be called when connection is established
   * @param {Function} hook - Hook function
   */
  onConnect(hook) {
    this.onConnectHooks.push(hook);
  }

  /**
   * Register a hook to be called when connection is closed
   * @param {Function} hook - Hook function
   */
  onDisconnect(hook) {
    this.onDisconnectHooks.push(hook);
  }

  /**
   * Close the WebSocket connection
   */
  close() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.conn) {
      this.conn.close();
      this.conn = null;
    }
  }
}

module.exports = WebSocketClient;