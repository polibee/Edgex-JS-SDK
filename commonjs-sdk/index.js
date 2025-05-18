/**
 * EdgeX JavaScript SDK
 * A JavaScript SDK for interacting with the edgeX Exchange API
 */

const Client = require('./sdk/client');
const AccountClient = require('./sdk/account/client');
const AssetClient = require('./sdk/asset/client');
const FundingClient = require('./sdk/funding/client');
const MetadataClient = require('./sdk/metadata/client');
const OrderClient = require('./sdk/order/client');
const QuoteClient = require('./sdk/quote/client');
const TransferClient = require('./sdk/transfer/client');
const WebSocketManager = require('./sdk/ws/manager');

// Client configuration options
const WithBaseURL = (baseURL) => (config) => {
  config.baseURL = baseURL;
  return config;
};

const WithAccountID = (accountID) => (config) => {
  config.accountID = accountID;
  return config;
};

const WithStarkPrivateKey = (starkPrivateKey) => (config) => {
  config.starkPrivateKey = starkPrivateKey;
  return config;
};

/**
 * Create a new EdgeX client with the provided options
 * @param {...Function} options - Configuration options
 * @returns {Client} A new EdgeX client instance
 */
const NewClient = (...options) => {
  // Default configuration
  const config = {
    baseURL: 'https://api.edgex.exchange',
    accountID: null,
    starkPrivateKey: null
  };

  // Apply all configuration options
  options.forEach(option => option(config));

  // Create and return a new client
  return new Client(config);
};

module.exports = {
  NewClient,
  WithBaseURL,
  WithAccountID,
  WithStarkPrivateKey,
  Client,
  AccountClient,
  AssetClient,
  FundingClient,
  MetadataClient,
  OrderClient,
  QuoteClient,
  TransferClient,
  WebSocketManager
};