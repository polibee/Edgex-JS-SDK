/**
 * EdgeX Transfer Client
 * Client for interacting with the EdgeX Transfer API
 */

class TransferClient {
  /**
   * Create a new Transfer client
   * @param {Object} client - The main EdgeX client
   */
  constructor(client) {
    this.client = client;
    this.httpClient = client.httpClient;
    this.baseURL = client.baseURL;
  }

  /**
   * Get transfer out by ID
   * @param {Object} params - Request parameters
   * @param {string} params.transferId - Transfer ID
   * @returns {Promise<Object>} Transfer out record
   */
  async getTransferOutById(params) {
    if (!params.transferId) {
      throw new Error('transferId is required');
    }
    
    const accountId = this.client.getAccountID();
    const url = `/api/v1/private/transfers/${accountId}/out`;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('transferOutIdList', params.transferId);
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get transfer out by id: ${error.message}`);
    }
  }

  /**
   * Create transfer out order
   * @param {Object} params - Request parameters
   * @param {string} params.coinId - Coin ID
   * @param {string} params.amount - Amount to transfer
   * @param {string} params.toAccountId - Destination account ID
   * @returns {Promise<Object>} Created transfer out order
   */
  async createTransferOut(params) {
    if (!params.coinId) {
      throw new Error('coinId is required');
    }
    if (!params.amount) {
      throw new Error('amount is required');
    }
    if (!params.toAccountId) {
      throw new Error('toAccountId is required');
    }
    
    const accountId = this.client.getAccountID();
    const url = `/api/v1/private/transfers/${accountId}/out`;
    
    const requestData = {
      coinId: params.coinId,
      amount: params.amount,
      toAccountId: params.toAccountId,
      clientTransferId: params.clientTransferId || this.client.generateUUID()
    };
    
    try {
      const response = await this.httpClient.post(url, requestData);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create transfer out: ${error.message}`);
    }
  }

  /**
   * Get transfer in records
   * @param {Object} params - Request parameters
   * @param {string} [params.startTime] - Start time
   * @param {string} [params.endTime] - End time
   * @param {string} [params.size] - Page size
   * @param {string} [params.offsetData] - Offset data for pagination
   * @returns {Promise<Object>} Transfer in records
   */
  async getTransferInRecords(params = {}) {
    const accountId = this.client.getAccountID();
    const url = `/api/v1/private/transfers/${accountId}/in`;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.startTime) queryParams.append('startTime', params.startTime);
    if (params.endTime) queryParams.append('endTime', params.endTime);
    if (params.size) queryParams.append('size', params.size);
    if (params.offsetData) queryParams.append('offsetData', params.offsetData);
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get transfer in records: ${error.message}`);
    }
  }

  /**
   * Get transfer out records
   * @param {Object} params - Request parameters
   * @param {string} [params.startTime] - Start time
   * @param {string} [params.endTime] - End time
   * @param {string} [params.size] - Page size
   * @param {string} [params.offsetData] - Offset data for pagination
   * @returns {Promise<Object>} Transfer out records
   */
  async getTransferOutRecords(params = {}) {
    const accountId = this.client.getAccountID();
    const url = `/api/v1/private/transfers/${accountId}/out`;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.startTime) queryParams.append('startTime', params.startTime);
    if (params.endTime) queryParams.append('endTime', params.endTime);
    if (params.size) queryParams.append('size', params.size);
    if (params.offsetData) queryParams.append('offsetData', params.offsetData);
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get transfer out records: ${error.message}`);
    }
  }

  /**
   * Get available transfer amount
   * @param {Object} params - Request parameters
   * @param {string} params.coinId - Coin ID
   * @returns {Promise<Object>} Available transfer amount
   */
  async getAvailableTransferAmount(params) {
    if (!params.coinId) {
      throw new Error('coinId is required');
    }
    
    const accountId = this.client.getAccountID();
    const url = `/api/v1/private/transfers/${accountId}/available-amount`;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('coinId', params.coinId);
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get available transfer amount: ${error.message}`);
    }
  }
}

module.exports = TransferClient;