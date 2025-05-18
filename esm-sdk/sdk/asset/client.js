/**
 * EdgeX Asset Client (ESM Version)
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
   * @returns {Promise<Object>} Account assets
   */
  async getAccountAsset() {
    try {
      const response = await this.httpClient.get('/api/v1/private/asset/account', {
        params: {
          accountId: this.client.getAccountID()
        }
      });
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get account assets: ${error.message}`);
    }
  }

  /**
   * Get asset history
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Asset history
   */
  async getAssetHistory(params = {}) {
    try {
      // Add account ID
      params.accountId = this.client.getAccountID();
      
      const response = await this.httpClient.get('/api/v1/private/asset/history', {
        params: params
      });
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get asset history: ${error.message}`);
    }
  }
}

export default AssetClient;