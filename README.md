# EdgeX JavaScript SDK

This is a JavaScript SDK for interacting with the EdgeX exchange API, based on the official Go SDK implementation.

# EdgeX JavaScript SDK

这是一个用于与EdgeX交易所API交互的JavaScript SDK，基于官方的Go SDK实现。

## Installation

```bash
npm install edgex-js-sdk
```

Or install from source:

```bash
git clone https://github.com/yourusername/edgex-js-sdk.git
cd edgex-js-sdk
npm install
```

## 安装

```bash
npm install edgex-js-sdk
```

或者从源码安装：

```bash
git clone https://github.com/yourusername/edgex-js-sdk.git
cd edgex-js-sdk
npm install
```

## Quick Start

```javascript
const edgex = require('edgex-js-sdk');

// Create a new client
const client = edgex.NewClient(
  edgex.WithBaseURL('https://testnet.edgex.exchange'),
  edgex.WithAccountID(12345),
  edgex.WithStarkPrivateKey('your-stark-private-key')
);

// Create context
const main = async () => {
  try {
    // Get account assets
    const assets = await client.Asset.getAccountAsset();
    
    // Print asset information
    console.log('Account Assets:', assets.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();
```

## 快速开始

```javascript
const edgex = require('edgex-js-sdk');

// 创建一个新的客户端
const client = edgex.NewClient(
  edgex.WithBaseURL('https://testnet.edgex.exchange'),
  edgex.WithAccountID(12345),
  edgex.WithStarkPrivateKey('your-stark-private-key')
);

// 创建上下文
const main = async () => {
  try {
    // 获取账户资产
    const assets = await client.Asset.getAccountAsset();
    
    // 打印资产信息
    console.log('Account Assets:', assets.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();
```

## Available APIs

The SDK currently supports the following API modules:

- **Account API**: Manage account positions, get position transaction records, handle collateral transactions
  - Get account positions
  - Get position by contract ID
  - Get position transaction history
  - Get collateral transaction details

- **Asset API**: Handle asset management and withdrawals
  - Get asset orders (paginated)
  - Get coin rates
  - Manage withdrawals (normal, cross-chain, and fast)
  - Get withdrawal records and signature information
  - Check withdrawable amounts

- **Funding API**: Manage funding operations and account balances
  - Handle funding transactions
  - Manage funding accounts

- **Metadata API**: Access exchange system information
  - Get server time
  - Get exchange metadata (trading pairs, contracts, etc.)

- **Order API**: Comprehensive order management
  - Create and cancel orders
  - Get active orders
  - Get order fill transactions
  - Calculate maximum order size
  - Manage order history

- **Quote API**: Access market data and pricing
  - Get multi-contract kline data
  - Get orderbook depth
  - Access real-time market quotes

- **Transfer API**: Handle asset transfers
  - Create transfer-out orders
  - Get transfer records (in/out)
  - Check available withdrawal amounts
  - Manage transfer history

## 可用的API

SDK目前支持以下API模块：

- **Account API**：管理账户仓位，获取仓位交易记录，处理抵押品交易
  - 获取账户仓位
  - 通过合约ID获取仓位
  - 获取仓位交易历史
  - 获取抵押品交易详情

- **Asset API**：处理资产管理和提现
  - 获取资产订单（分页）
  - 获取币种汇率
  - 管理提现（普通、跨链和快速）
  - 获取提现记录和签名信息
  - 检查可提现金额

- **Funding API**：管理资金操作和账户余额
  - 处理资金交易
  - 管理资金账户

- **Metadata API**：访问交易所系统信息
  - 获取服务器时间
  - 获取交易所元数据（交易对、合约等）

- **Order API**：全面的订单管理
  - 创建和取消订单
  - 获取活跃订单
  - 获取订单成交交易
  - 计算最大订单大小
  - 管理订单历史

- **Quote API**：访问市场数据和定价
  - 获取多合约K线数据
  - 获取订单簿深度
  - 访问实时市场报价

- **Transfer API**：处理资产转账
  - 创建转出订单
  - 获取转账记录（转入/转出）
  - 检查可用提现金额
  - 管理转账历史

## WebSocket Support

The SDK provides WebSocket support for receiving real-time market data and account updates:

```javascript
// Connect to public WebSocket
await client.ws.connectPublic();

// Subscribe to BTC-USDC ticker updates
await client.ws.subscribeMarketTicker('BTC-USDC', (message) => {
  const data = JSON.parse(message.toString());
  console.log('Ticker update:', data);
});

// Connect to private WebSocket (requires authentication)
await client.ws.connectPrivate();

// Subscribe to account updates
await client.ws.subscribeAccountUpdate((message) => {
  const data = JSON.parse(message.toString());
  console.log('Account update:', data);
});
```

## WebSocket支持

SDK提供了WebSocket支持，用于接收实时市场数据和账户更新：

```javascript
// 连接到公共WebSocket
await client.ws.connectPublic();

// 订阅BTC-USDC的行情更新
await client.ws.subscribeMarketTicker('BTC-USDC', (message) => {
  const data = JSON.parse(message.toString());
  console.log('行情更新:', data);
});

// 连接到私有WebSocket（需要认证）
await client.ws.connectPrivate();

// 订阅账户更新
await client.ws.subscribeAccountUpdate((message) => {
  const data = JSON.parse(message.toString());
  console.log('账户更新:', data);
});
```

## ESM Support

This SDK also provides an ESM (ECMAScript Module) version. For more information, please refer to the [ESM README](./esm/README.md).

## ESM支持

本SDK还提供了ESM（ECMAScript模块）版本。更多信息，请参考[ESM README](./esm/README.md)。****
