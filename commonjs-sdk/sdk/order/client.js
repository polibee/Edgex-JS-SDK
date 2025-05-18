/**
 * EdgeX Order Client
 * Client for interacting with the EdgeX Order API
 */

const Decimal = require('decimal.js');

// Order types
const OrderType = {
  LIMIT: 'LIMIT',
  MARKET: 'MARKET'
};

// Time in force options
const TimeInForce = {
  GOOD_TIL_CANCEL: 'GOOD_TIL_CANCEL',
  IMMEDIATE_OR_CANCEL: 'IMMEDIATE_OR_CANCEL',
  FILL_OR_KILL: 'FILL_OR_KILL'
};

// Order side
const OrderSide = {
  BUY: 'BUY',
  SELL: 'SELL'
};

/**
 * Order client for creating and managing orders
 */
class OrderClient {
  /**
   * Create a new Order client
   * @param {Object} client - The main EdgeX client
   */
  constructor(client) {
    this.client = client;
    this.httpClient = client.httpClient;
    this.baseURL = client.baseURL;
  }

  /**
   * Create a new order
   * @param {Object} params - Order parameters
   * @param {string} params.contractId - Contract ID
   * @param {string} params.side - Order side (BUY or SELL)
   * @param {string} params.type - Order type (LIMIT or MARKET)
   * @param {string} params.size - Order size
   * @param {string} params.price - Order price (required for LIMIT orders)
   * @param {string} [params.timeInForce] - Time in force
   * @param {string} [params.clientOrderId] - Client order ID
   * @param {boolean} [params.reduceOnly] - Whether this is a reduce-only order
   * @param {Object} metadata - Exchange metadata
   * @returns {Promise<Object>} Created order
   */
  async createOrder(params, metadata) {
    // Set default TimeInForce based on order type if not specified
    if (!params.timeInForce) {
      params.timeInForce = params.type === OrderType.MARKET
        ? TimeInForce.IMMEDIATE_OR_CANCEL
        : TimeInForce.GOOD_TIL_CANCEL;
    }

    // Find the contract from metadata
    const contractList = metadata.contractList || [];
    const contract = contractList.find(c => c.contractId === params.contractId);
    if (!contract) {
      throw new Error(`Contract not found: ${params.contractId}`);
    }

    // Get collateral coin from metadata
    const global = metadata.global || {};
    const collateralCoin = global.starkExCollateralCoin;

    // Parse decimal values
    const size = new Decimal(params.size);
    const price = new Decimal(params.price);

    // Convert hex resolution to decimal
    let hexResolution = contract.starkExResolution || '';
    // Remove "0x" prefix if present
    hexResolution = hexResolution.replace(/^0x/, '');
    // Parse hex string to int
    const resolutionInt = parseInt(hexResolution, 16);
    const resolution = new Decimal(resolutionInt);

    // Generate client order ID if not provided
    const clientOrderId = params.clientOrderId || this.client.generateUUID();

    // Calculate values
    const valueDm = price.mul(size);
    const amountSynthetic = size.mul(resolution).toFixed(0);
    const amountCollateral = valueDm.mul(1000000).toFixed(0); // Shift 6 decimal places

    // Calculate fee based on order type (maker/taker)
    const feeRate = new Decimal(contract.defaultTakerFeeRate || '0');

    // Calculate fee amount in decimal with 6 decimal places
    const amountFeeDm = valueDm.mul(feeRate).toDecimalPlaces(6);
    const amountFeeStr = amountFeeDm.toString();

    // Prepare request body
    const requestBody = {
      accountId: this.client.getAccountID(),
      contractId: params.contractId,
      side: params.side,
      type: params.type,
      size: params.size,
      price: params.price,
      timeInForce: params.timeInForce,
      clientOrderId: clientOrderId,
      reduceOnly: params.reduceOnly || false,
      fee: amountFeeStr
    };

    try {
      const response = await this.httpClient.post('/api/v1/private/orders', requestBody);

      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Cancel an order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelOrder(orderId) {
    try {
      const response = await this.httpClient.delete(`/api/v1/private/orders/${orderId}`);

      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  /**
   * Cancel an order by client order ID
   * @param {string} clientOrderId - Client order ID
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelOrderByClientOrderId(clientOrderId) {
    try {
      const response = await this.httpClient.delete(`/api/v1/private/orders/client-order-id/${clientOrderId}`);

      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to cancel order by client order ID: ${error.message}`);
    }
  }

  /**
   * Get active orders
   * @param {Object} params - Request parameters
   * @param {string} [params.contractId] - Contract ID
   * @param {string} [params.side] - Order side
   * @param {string} [params.size] - Page size
   * @param {string} [params.offsetData] - Offset data
   * @returns {Promise<Object>} Active orders
   */
  async getActiveOrders(params = {}) {
    const accountId = this.client.getAccountID();
    let url = `/api/v1/private/orders/active/${accountId}`;

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.contractId) queryParams.append('contractId', params.contractId);
    if (params.side) queryParams.append('side', params.side);
    if (params.size) queryParams.append('size', params.size);
    if (params.offsetData) queryParams.append('offsetData', params.offsetData);

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    try {
      const response = await this.httpClient.get(url);

      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get active orders: ${error.message}`);
    }
  }

  /**
   * Get order fill transactions
   * @param {Object} params - Request parameters
   * @param {string} [params.contractId] - Contract ID
   * @param {string} [params.startTime] - Start time
   * @param {string} [params.endTime] - End time
   * @param {string} [params.size] - Page size
   * @param {string} [params.offsetData] - Offset data
   * @returns {Promise<Object>} Order fill transactions
   */
  async getOrderFillTransactions(params = {}) {
    const accountId = this.client.getAccountID();
    let url = `/api/v1/private/orders/fills/${accountId}`;

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.contractId) queryParams.append('contractId', params.contractId);
    if (params.startTime) queryParams.append('startTime', params.startTime);
    if (params.endTime) queryParams.append('endTime', params.endTime);
    if (params.size) queryParams.append('size', params.size);
    if (params.offsetData) queryParams.append('offsetData', params.offsetData);

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    try {
      const response = await this.httpClient.get(url);

      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get order fill transactions: ${error.message}`);
    }
  }
}

// Export constants
OrderClient.OrderType = OrderType;
OrderClient.TimeInForce = TimeInForce;
OrderClient.OrderSide = OrderSide;

module.exports = OrderClient;