/**
 * EdgeX Quote Client
 * Client for interacting with the EdgeX Quote API
 */

class QuoteClient {
  /**
   * Create a new Quote client
   * @param {Object} client - The main EdgeX client
   */
  constructor(client) {
    this.client = client;
    this.httpClient = client.httpClient;
    this.baseURL = client.baseURL;
  }

  /**
   * Get multi-contract K-line data
   * @param {Object} params - Request parameters
   * @param {string} params.contractId - Contract ID
   * @param {string} params.interval - Time interval (e.g., "1m", "5m", "1h")
   * @param {string} [params.startTime] - Start time
   * @param {string} [params.endTime] - End time
   * @param {string} [params.limit] - Limit
   * @returns {Promise<Object>} K-line data
   */
  async getKline(params) {
    if (!params.contractId) {
      throw new Error('contractId is required');
    }
    if (!params.interval) {
      throw new Error('interval is required');
    }
    
    let url = '/api/v1/public/kline';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('contractId', params.contractId);
    queryParams.append('interval', params.interval);
    if (params.startTime) queryParams.append('startTime', params.startTime);
    if (params.endTime) queryParams.append('endTime', params.endTime);
    if (params.limit) queryParams.append('limit', params.limit);
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get K-line data: ${error.message}`);
    }
  }

  /**
   * Get order book depth
   * @param {Object} params - Request parameters
   * @param {string} params.contractId - Contract ID
   * @param {number} [params.limit] - Limit (default: 50)
   * @returns {Promise<Object>} Order book depth
   */
  async getDepth(params) {
    if (!params.contractId) {
      throw new Error('contractId is required');
    }
    
    let url = '/api/v1/public/depth';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('contractId', params.contractId);
    if (params.limit) queryParams.append('limit', params.limit);
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get order book depth: ${error.message}`);
    }
  }

  /**
   * Get ticker information
   * @param {Object} params - Request parameters
   * @param {string} [params.contractId] - Contract ID (optional, if not provided, returns all tickers)
   * @returns {Promise<Object>} Ticker information
   */
  async getTicker(params = {}) {
    let url = '/api/v1/public/ticker';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.contractId) queryParams.append('contractId', params.contractId);
    
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
      throw new Error(`Failed to get ticker information: ${error.message}`);
    }
  }

  /**
   * Get recent trades
   * @param {Object} params - Request parameters
   * @param {string} params.contractId - Contract ID
   * @param {number} [params.limit] - Limit (default: 100)
   * @returns {Promise<Object>} Recent trades
   */
  async getTrades(params) {
    if (!params.contractId) {
      throw new Error('contractId is required');
    }
    
    let url = '/api/v1/public/trades';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('contractId', params.contractId);
    if (params.limit) queryParams.append('limit', params.limit);
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get recent trades: ${error.message}`);
    }
  }
}

module.exports = QuoteClient;