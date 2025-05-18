# EdgeX JavaScript SDK (ESM Version)

This is the ESM (ECMAScript Module) version of the EdgeX JavaScript SDK. This version allows you to use the SDK in modern JavaScript environments that support ES modules.

# EdgeX JavaScript SDK (ESM 版本)

这是EdgeX JavaScript SDK的ESM（ECMAScript模块）版本。此版本允许您在支持ES模块的现代JavaScript环境中使用SDK。

## Differences from CommonJS Version

- Uses `import/export` syntax instead of `require/module.exports`
- File extensions must be explicitly specified in imports (e.g., `import x from './y.js'`)
- Located in a separate `esm/` directory, separate from the original CommonJS version

## 与CommonJS版本的区别

- 使用`import/export`语法而非`require/module.exports`
- 文件扩展名在导入时必须明确指定（例如：`import x from './y.js'`）
- 位于单独的`esm/`目录中，与原始CommonJS版本分开

## Installation

install from source:

```bash
git clone https://github.com/polibee/Edgex-JS-SDK.git
```
```

## 安装

```bash
git clone https://github.com/polibee/Edgex-JS-SDK.git

```

## Usage

### ESM Import

```javascript
// Import the entire SDK
import edgex from 'esm-sdk';

// Or import specific components
import { NewClient, WithBaseURL } from 'esm-sdk';
```

### 使用方法

### ESM导入

```javascript
// 导入整个SDK
import edgex from 'esm-sdk';

// 或者导入特定组件
import { NewClient, WithBaseURL } from 'esm-sdk';
```

### Basic Usage

```javascript
import edgex from 'esm-sdk';

// Create a new client instance
const client = edgex.NewClient(
  edgex.WithBaseURL('https://testnet.edgex.exchange'),
  edgex.WithAccountID(12345),
  edgex.WithStarkPrivateKey('your-stark-private-key')
);

// Get server time
async function getServerTime() {
  try {
    const response = await client.Metadata.getServerTime();
    console.log('Server time:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting server time:', error.message);
  }
}

getServerTime();
```

### 基本用法

```javascript
import edgex from 'esm-sdk';

// 创建一个新的客户端实例
const client = edgex.NewClient(
  edgex.WithBaseURL('https://testnet.edgex.exchange'),
  edgex.WithAccountID(12345),
  edgex.WithStarkPrivateKey('your-stark-private-key')
);

// 获取服务器时间
async function getServerTime() {
  try {
    const response = await client.Metadata.getServerTime();
    console.log('服务器时间:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取服务器时间出错:', error.message);
  }
}

getServerTime();
```

## Examples

For complete examples, please refer to `examples/esm-basic-usage.js`.

## 示例

完整示例请参考 `examples/esm-basic-usage.js`。

## Notes

- Ensure your environment supports ES modules
- If using in Node.js, make sure your package.json has `"type": "module"` set, or use the `.mjs` file extension
- When using in browsers, ensure you use the `<script type="module">` tag

## 注意事项

- 确保您的环境支持ES模块
- 如果在Node.js中使用，请确保您的package.json中设置了`"type": "module"`，或者使用`.mjs`文件扩展名
- 在浏览器中使用时，请确保使用`<script type="module">`标签
