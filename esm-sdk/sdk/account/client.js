/**
 * EdgeX Account Client (ESM Version)
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
   * Get account information
   * @returns {Promise<Object>} Account information
   */
  async getAccount() {
    try {
      const response = await this.httpClient.get('/api/v1/private/account', {
        params: {
          accountId: this.client.getAccountID()
        }
      });
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get account: ${error.message}`);
    }
  }

  /**
   * Get account positions
   * @returns {Promise<Object>} Account positions
   */
  async getPositions() {
    try {
      const response = await this.httpClient.get('/api/v1/private/position', {
        params: {
          accountId: this.client.getAccountID()
        }
      });
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get positions: ${error.message}`);
    }
  }
}

export default AccountClient;