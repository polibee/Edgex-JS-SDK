/**
 * EdgeX Funding Client (ESM Version)
 * Client for interacting with the EdgeX Funding API
 */

class FundingClient {
  /**
   * Create a new Funding client
   * @param {Object} client - The main EdgeX client
   */
  constructor(client) {
    this.client = client;
    this.httpClient = client.httpClient;
    this.baseURL = client.baseURL;
  }

  /**
   * Get funding rate for a contract
   * @param {Object} params - Request parameters
   * @param {string} params.contractId - Contract ID
   * @param {number} [params.from] - Start time in milliseconds
   * @param {number} [params.to] - End time in milliseconds
   * @param {number} [params.size] - Page size
   * @param {string} [params.offset] - Offset data for pagination
   * @returns {Promise<Object>} Funding rate data
   */
  async getFundingRate(params) {
    if (!params.contractId) {
      throw new Error('contractId is required');
    }
    
    let url = '/api/v1/public/funding-rate';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('contractId', params.contractId);
    queryParams.append('filterSettlementFundingRate', 'true');
    
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.offset) queryParams.append('offsetData', params.offset);
    if (params.from) queryParams.append('filterBeginTimeInclusive', params.from.toString());
    if (params.to) queryParams.append('filterEndTimeExclusive', params.to.toString());
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get funding rate: ${error.message}`);
    }
  }

  /**
   * Get funding transactions for an account
   * @param {Object} params - Request parameters
   * @param {string} [params.startTime] - Start time
   * @param {string} [params.endTime] - End time
   * @param {string} [params.size] - Page size
   * @param {string} [params.offsetData] - Offset data for pagination
   * @returns {Promise<Object>} Funding transactions
   */
  async getFundingTransactions(params = {}) {
    const accountId = this.client.getAccountID();
    const url = `/api/v1/private/accounts/${accountId}/funding-transactions`;
    
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
      throw new Error(`Failed to get funding transactions: ${error.message}`);
    }
  }

  /**
   * Get latest funding rate for a contract
   * @param {Object} params - Request parameters
   * @param {string} params.contractId - Contract ID
   * @returns {Promise<Object>} Latest funding rate data
   */
  async getLatestFundingRate(params) {
    if (!params.contractId) {
      throw new Error('contractId is required');
    }
    
    const url = '/api/v1/public/funding/getLatestFundingRate';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('contractId', params.contractId);
    
    try {
      const response = await this.httpClient.get(`${url}?${queryParams.toString()}`);
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get latest funding rate: ${error.message}`);
    }
  }

  /**
   * Get funding rate history for a contract (alias for getFundingRate)
   * @param {Object} params - Request parameters
   * @param {string} params.contractId - Contract ID
   * @param {number} [params.from] - Start time in milliseconds
   * @param {number} [params.to] - End time in milliseconds
   * @param {number} [params.size] - Page size
   * @param {string} [params.offset] - Offset data for pagination
   * @returns {Promise<Object>} Funding rate history data
   */
  async getFundingRateHistory(params) {
    return this.getFundingRate(params);
  }

  /**
   * Get funding rates for a contract (alias for getFundingRate)
   * @param {Object} params - Request parameters
   * @param {string} params.contractId - Contract ID
   * @param {number} [params.from] - Start time in milliseconds
   * @param {number} [params.to] - End time in milliseconds
   * @param {number} [params.size] - Page size
   * @param {string} [params.offset] - Offset data for pagination
   * @returns {Promise<Object>} Funding rates data
   */
  async getFundingRates(params) {
    return this.getFundingRate(params);
  }
}

export default FundingClient;