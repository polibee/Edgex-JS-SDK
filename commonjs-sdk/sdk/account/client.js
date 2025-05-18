/**
 * EdgeX Account Client
 * Client for interacting with the EdgeX Account API
 */

class AccountClient {
  /**
   * Create a new Account client
   * @param {Object} client - The main EdgeX client
   */
  constructor(client) {
    this.client = client;
    this.httpClient = client.httpClient;
    this.baseURL = client.baseURL;
  }

  /**
   * Get account positions
   * @returns {Promise<Object>} Account positions
   */
  async getPositions() {
    const accountId = this.client.getAccountID();
    const url = `/api/v1/private/accounts/${accountId}/positions`;
    
    try {
      const response = await this.httpClient.get(url);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get account positions: ${error.message}`);
    }
  }

  /**
   * Get position by contract ID
   * @param {string} contractId - Contract ID
   * @returns {Promise<Object>} Position information
   */
  async getPositionByContractId(contractId) {
    const accountId = this.client.getAccountID();
    const url = `/api/v1/private/accounts/${accountId}/positions/${contractId}`;
    
    try {
      const response = await this.httpClient.get(url);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get position by contract ID: ${error.message}`);
    }
  }

  /**
   * Get position transaction history
   * @param {Object} params - Request parameters
   * @param {string} [params.contractId] - Contract ID
   * @param {string} [params.startTime] - Start time
   * @param {string} [params.endTime] - End time
   * @param {string} [params.size] - Page size
   * @param {string} [params.offsetData] - Offset data
   * @returns {Promise<Object>} Position transaction history
   */
  async getPositionTransactions(params = {}) {
    const accountId = this.client.getAccountID();
    let url = `/api/v1/private/accounts/${accountId}/position-transactions`;
    
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
      throw new Error(`Failed to get position transactions: ${error.message}`);
    }
  }

  /**
   * Get collateral transaction details
   * @param {Object} params - Request parameters
   * @param {string} [params.startTime] - Start time
   * @param {string} [params.endTime] - End time
   * @param {string} [params.size] - Page size
   * @param {string} [params.offsetData] - Offset data
   * @returns {Promise<Object>} Collateral transaction details
   */
  async getCollateralTransactions(params = {}) {
    const accountId = this.client.getAccountID();
    let url = `/api/v1/private/accounts/${accountId}/collateral-transactions`;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
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
      throw new Error(`Failed to get collateral transactions: ${error.message}`);
    }
  }
}

module.exports = AccountClient;