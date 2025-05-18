/**
 * EdgeX SDK Client
 * Main client implementation for the EdgeX JavaScript SDK
 */

const axios = require('axios');
const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');

const AccountClient = require('./account/client');
const AssetClient = require('./asset/client');
const FundingClient = require('./funding/client');
const MetadataClient = require('./metadata/client');
const OrderClient = require('./order/client');
const QuoteClient = require('./quote/client');
const TransferClient = require('./transfer/client');
const WebSocketManager = require('./ws/manager');
const { sign } = require('./utils/stark');

/**
 * Main EdgeX SDK Client
 */
class Client {
  /**
   * Create a new EdgeX client
   * @param {Object} config - Client configuration
   * @param {string} config.baseURL - Base URL for API requests
   * @param {number} config.accountID - EdgeX account ID
   * @param {string} config.starkPrivateKey - Stark private key for signing
   */
  constructor(config) {
    this.baseURL = config.baseURL;
    this.accountID = config.accountID;
    this.starkPrivateKey = config.starkPrivateKey;
    
    // Create axios instance with interceptors
    this.httpClient = axios.create({
      baseURL: this.baseURL,
      timeout: 30000
    });
    
    // Add request interceptor for authentication
    this.httpClient.interceptors.request.use(this._requestInterceptor.bind(this));
    
    // Initialize API clients
    this.Account = new AccountClient(this);
    this.Asset = new AssetClient(this);
    this.Funding = new FundingClient(this);
    this.Metadata = new MetadataClient(this);
    this.Order = new OrderClient(this);
    this.Quote = new QuoteClient(this);
    this.Transfer = new TransferClient(this);
    
    // Initialize WebSocket manager
    this.ws = new WebSocketManager(this.baseURL, this.accountID, this.starkPrivateKey);
  }
  
  /**
   * Request interceptor to add authentication headers
   * @private
   */
  _requestInterceptor(config) {
    // Add timestamp header
    const timestamp = Date.now();
    config.headers['X-edgeX-Api-Timestamp'] = timestamp.toString();
    
    // Add authentication headers for private endpoints
    if (config.url.includes('/api/v1/private/')) {
      // Generate signature content
      const method = config.method.toUpperCase();
      const path = new URL(config.url, this.baseURL).pathname;
      const signContent = `${timestamp}${method}${path}`;
      
      // Hash the content using Keccak-256
      const messageHash = crypto.SHA3(signContent, { outputLength: 256 });
      const messageHashHex = messageHash.toString(crypto.enc.Hex);
      
      // Sign the message hash
      const signature = sign(this.starkPrivateKey, messageHashHex);
      
      // Add signature headers
      config.headers['X-edgeX-Api-Signature'] = signature.r + signature.s;
      config.headers['X-edgeX-Api-AccountId'] = this.accountID.toString();
    }
    
    return config;
  }
  
  /**
   * Generate a UUID
   * @returns {string} A new UUID
   */
  generateUUID() {
    return uuidv4();
  }
  
  /**
   * Get the account ID
   * @returns {number} The account ID
   */
  getAccountID() {
    return this.accountID;
  }
  
  /**
   * Get the Stark private key
   * @returns {string} The Stark private key
   */
  getStarkPrivateKey() {
    return this.starkPrivateKey;
  }
}

module.exports = Client;