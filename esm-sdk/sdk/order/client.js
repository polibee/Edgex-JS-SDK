/**
 * EdgeX Order Client (ESM Version)
 * Client for interacting with the EdgeX Order API
 */

/**
 * Order side constants
 * @enum {string}
 */
export const OrderSide = {
  BUY: 'BUY',
  SELL: 'SELL'
};

/**
 * Order type constants
 * @enum {string}
 */
export const OrderType = {
  LIMIT: 'LIMIT',
  MARKET: 'MARKET'
};

/**
 * Time in force constants
 * @enum {string}
 */
export const TimeInForce = {
  GOOD_TIL_CANCEL: 'GTC',
  IMMEDIATE_OR_CANCEL: 'IOC',
  FILL_OR_KILL: 'FOK'
};

/**
 * Order Client for EdgeX API
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
    
    // Attach constants to the client for easy access
    this.OrderSide = OrderSide;
    this.OrderType = OrderType;
    this.TimeInForce = TimeInForce;
  }

  /**
   * Create a new order
   * @param {Object} params - Order parameters
   * @param {string} params.contractId - Contract ID
   * @param {string} params.side - Order side (BUY/SELL)
   * @param {string} params.type - Order type (LIMIT/MARKET)
   * @param {string} params.size - Order size
   * @param {string} params.price - Order price (for LIMIT orders)
   * @param {string} params.timeInForce - Time in force
   * @param {boolean} params.reduceOnly - Whether this is a reduce-only order
   * @param {Object} metadata - Exchange metadata
   * @returns {Promise<Object>} Created order
   */
  async createOrder(params, metadata) {
    try {
      // Generate client order ID if not provided
      if (!params.clientOrderId) {
        params.clientOrderId = this.client.generateUUID();
      }
      
      // Add account ID
      params.accountId = this.client.getAccountID();
      
      const response = await this.httpClient.post('/api/v1/private/order', params);
      
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
   * @returns {Promise<Object>} Cancelled order
   */
  async cancelOrder(orderId) {
    try {
      const params = {
        orderId: orderId,
        accountId: this.client.getAccountID()
      };
      
      const response = await this.httpClient.delete('/api/v1/private/order', { data: params });
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  /**
   * Get orders for the account
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Orders
   */
  async getOrders(params = {}) {
    try {
      // Add account ID
      params.accountId = this.client.getAccountID();
      
      const response = await this.httpClient.get('/api/v1/private/order', { params });
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }
}

export default OrderClient;