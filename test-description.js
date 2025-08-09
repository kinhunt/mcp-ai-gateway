#!/usr/bin/env node

const { spawn } = require('child_process');

// 启动 MCP 服务器进程，测试新的 DESCRIPTION 变量
const mcpServer = spawn('node', ['build/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
        ...process.env,
        API_FORMAT: 'openai',
        API_ENDPOINT: 'https://api.tu-zi.com/v1',
        API_KEY: 'sk-WJqJGTf09kvMb7XklNQTxDZhDp0nMI4lZbfHGT1POw2CLtgK',
        DEFAULT_MODEL: 'gemini-2.5-pro-preview-06-05',
        DESCRIPTION: 'Supported models:\n- claude-sonnet-4-20250514: Claude Sonnet 4 model with extended thinking\n- gemini-2.5-pro-preview-06-05: Google Gemini 2.5 Pro preview model\n\nNote: This gateway supports custom endpoints and multiple AI providers.'
    }
});

console.log('🚀 Testing MCP AI Gateway with DESCRIPTION variable...');

let responseBuffer = '';

mcpServer.stdout.on('data', (data) => {
    const chunk = data.toString();
    responseBuffer += chunk;
    
    // 检查是否收到完整的 JSON-RPC 响应
    const lines = responseBuffer.split('\n');
    for (const line of lines) {
        if (line.trim()) {
            try {
                const response = JSON.parse(line.trim());
                if (response.id === 1) {
                    console.log('✅ 工具描述响应:');
                    console.log('工具名称:', response.result.tools[0].name);
                    console.log('工具描述:\n', response.result.tools[0].description);
                    mcpServer.kill();
                    process.exit(0);
                }
            } catch (e) {
                // 忽略不完整的 JSON
            }
        }
    }
});

mcpServer.stderr.on('data', (data) => {
    console.error('❌ 错误:', data.toString());
});

mcpServer.on('close', (code) => {
    console.log(`📋 服务器退出，代码: ${code}`);
});

// 等待服务器启动，然后发送测试请求
setTimeout(() => {
    console.log('📤 发送工具列表请求...');
    // 发送 MCP 协议初始化
    mcpServer.stdin.write(JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "test-client",
                version: "1.0.0"
            }
        }
    }) + '\n');

    // 发送工具列表请求
    mcpServer.stdin.write(JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list"
    }) + '\n');
}, 1000);