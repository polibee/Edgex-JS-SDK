/**
 * EdgeX Asset Client
 * Client for interacting with the EdgeX Asset API
 */

class AssetClient {
  /**
   * Create a new Asset client
   * @param {Object} client - The main EdgeX client
   */
  constructor(client) {
    this.client = client;
    this.httpClient = client.httpClient;
    this.baseURL = client.baseURL;
  }

  /**
   * Get account assets
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Account assets
   */
  async getAccountAsset(options = {}) {
    const accountId = this.client.getAccountID();
    const url = `/api/v1/private/assets/${accountId}`;
    
    try {
      const response = await this.httpClient.get(url);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get account assets: ${error.message}`);
    }
  }

  /**
   * Get all asset orders with pagination
   * @param {Object} params - Request parameters
   * @param {string} [params.startTime] - Start time
   * @param {string} [params.endTime] - End time
   * @param {string} [params.chainId] - Chain ID
   * @param {string} [params.typeList] - Type list
   * @param {string} [params.size] - Page size
   * @param {string} [params.offsetData] - Offset data
   * @returns {Promise<Object>} Asset orders
   */
  async getAllOrdersPage(params = {}) {
    const accountId = this.client.getAccountID();
    let url = `/api/v1/private/assets/orders/${accountId}`;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.startTime) queryParams.append('startTime', params.startTime);
    if (params.endTime) queryParams.append('endTime', params.endTime);
    if (params.chainId) queryParams.append('chainId', params.chainId);
    if (params.typeList) queryParams.append('typeList', params.typeList);
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
      throw new Error(`Failed to get asset orders: ${error.message}`);
    }
  }

  /**
   * Get coin rate
   * @param {Object} params - Request parameters
   * @param {string} [params.chainId] - Chain ID
   * @param {string} [params.coin] - Coin
   * @returns {Promise<Object>} Coin rate
   */
  async getCoinRate(params = {}) {
    let url = '/api/v1/private/assets/coin-rate';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.chainId) queryParams.append('chainId', params.chainId);
    if (params.coin) queryParams.append('coin', params.coin);
    
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
      throw new Error(`Failed to get coin rate: ${error.message}`);
    }
  }

  /**
   * Get normal withdrawable amount
   * @param {Object} params - Request parameters
   * @param {string} params.chainId - Chain ID
   * @param {string} params.coin - Coin
   * @returns {Promise<Object>} Withdrawable amount
   */
  async getNormalWithdrawableAmount(params) {
    if (!params.chainId) {
      throw new Error('chainId is required');
    }
    if (!params.coin) {
      throw new Error('coin is required');
    }
    
    const url = '/api/v1/private/assets/withdraw/normal/available-amount';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('chainId', params.chainId);
    queryParams.append('coin', params.coin);
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get withdrawable amount: ${error.message}`);
    }
  }
}

module.exports = AssetClient;