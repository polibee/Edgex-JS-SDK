/**
 * EdgeX Metadata Client
 * Client for interacting with the EdgeX Metadata API
 */

class MetadataClient {
  /**
   * Create a new Metadata client
   * @param {Object} client - The main EdgeX client
   */
  constructor(client) {
    this.client = client;
    this.httpClient = client.httpClient;
    this.baseURL = client.baseURL;
  }

  /**
   * Get server time
   * @returns {Promise<Object>} Server time
   */
  async getServerTime() {
    try {
      const response = await this.httpClient.get('/api/v1/public/time');
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get server time: ${error.message}`);
    }
  }

  /**
   * Get exchange metadata
   * @returns {Promise<Object>} Exchange metadata
   */
  async getMetadata() {
    try {
      const response = await this.httpClient.get('/api/v1/public/metadata');
      
      if (response.data.code !== 'SUCCESS') {
        throw new Error(`Request failed with code: ${response.data.code}`);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get metadata: ${error.message}`);
    }
  }

  /**
   * Get contract information
   * @param {string} contractId - Contract ID
   * @returns {Promise<Object>} Contract information
   */
  async getContract(contractId) {
    try {
      const metadata = await this.getMetadata();
      
      if (!metadata.data || !metadata.data.contractList) {
        throw new Error('Contract list not found in metadata');
      }
      
      const contract = metadata.data.contractList.find(c => c.contractId === contractId);
      
      if (!contract) {
        throw new Error(`Contract not found: ${contractId}`);
      }
      
      return contract;
    } catch (error) {
      throw new Error(`Failed to get contract: ${error.message}`);
    }
  }

  /**
   * Get all contracts
   * @returns {Promise<Array>} List of contracts
   */
  async getContracts() {
    try {
      const metadata = await this.getMetadata();
      
      if (!metadata.data || !metadata.data.contractList) {
        throw new Error('Contract list not found in metadata');
      }
      
      return metadata.data.contractList;
    } catch (error) {
      throw new Error(`Failed to get contracts: ${error.message}`);
    }
  }

  /**
   * Get global configuration
   * @returns {Promise<Object>} Global configuration
   */
  async getGlobalConfig() {
    try {
      const metadata = await this.getMetadata();
      
      if (!metadata.data || !metadata.data.global) {
        throw new Error('Global configuration not found in metadata');
      }
      
      return metadata.data.global;
    } catch (error) {
      throw new Error(`Failed to get global configuration: ${error.message}`);
    }
  }
}

module.exports = MetadataClient;