/**
 * EdgeX JavaScript SDK (ESM Version)
 * A JavaScript SDK for interacting with the edgeX Exchange API
 */

import Client from './sdk/client.js';
import AccountClient from './sdk/account/client.js';
import AssetClient from './sdk/asset/client.js';
import FundingClient from './sdk/funding/client.js';
import MetadataClient from './sdk/metadata/client.js';
import OrderClient from './sdk/order/client.js';
import QuoteClient from './sdk/quote/client.js';
import TransferClient from './sdk/transfer/client.js';
import WebSocketManager from './sdk/ws/manager.js';

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

export {
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

export default {
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