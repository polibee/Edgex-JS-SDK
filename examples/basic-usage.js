/**
 * EdgeX JavaScript SDK Basic Usage Example
 */

const edgex = require('../src/index');

// Create a new client with configuration options
const client = edgex.NewClient(
  edgex.WithBaseURL('https://testnet.edgex.exchange'),
  edgex.WithAccountID(12345),
  edgex.WithStarkPrivateKey('your-stark-private-key')
);

// Example: Get server time
async function getServerTime() {
  try {
    const response = await client.Metadata.getServerTime();
    console.log('Server time:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting server time:', error.message);
  }
}

// Example: Get account assets
async function getAccountAssets() {
  try {
    const response = await client.Asset.getAccountAsset();
    console.log('Account assets:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting account assets:', error.message);
  }
}

// Example: Get exchange metadata
async function getMetadata() {
  try {
    const response = await client.Metadata.getMetadata();
    console.log('Exchange metadata:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting metadata:', error.message);
  }
}

// Example: Create a limit order
async function createLimitOrder() {
  try {
    // First get metadata to get contract information
    const metadataResponse = await client.Metadata.getMetadata();
    const metadata = metadataResponse.data;
    
    // Create order parameters
    const params = {
      contractId: 'BTC-USDC',
      side: edgex.OrderClient.OrderSide.BUY,
      type: edgex.OrderClient.OrderType.LIMIT,
      size: '0.01',
      price: '50000',
      timeInForce: edgex.OrderClient.TimeInForce.GOOD_TIL_CANCEL,
      reduceOnly: false
    };
    
    const response = await client.Order.createOrder(params, metadata);
    console.log('Created order:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.message);
  }
}

// Example: Connect to WebSocket and subscribe to market data
async function subscribeToMarketData() {
  try {
    // Connect to public WebSocket
    await client.ws.connectPublic();
    
    // Subscribe to ticker updates for BTC-USDC
    await client.ws.subscribeMarketTicker('BTC-USDC', (message) => {
      const data = JSON.parse(message.toString());
      console.log('Ticker update:', data);
    });
    
    console.log('Subscribed to market data');
  } catch (error) {
    console.error('Error subscribing to market data:', error.message);
  }
}

// Run examples
async function runExamples() {
  await getServerTime();
  // Uncomment the following lines to run other examples
  // await getAccountAssets();
  // await getMetadata();
  // await createLimitOrder();
  // await subscribeToMarketData();
}

runExamples().catch(console.error);