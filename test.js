#!/usr/bin/env node

const { spawn } = require('child_process');

// 启动 MCP 服务器进程
const mcpServer = spawn('node', ['build/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
        ...process.env,
        API_FORMAT: 'openai',
        API_ENDPOINT: 'https://api.tu-zi.com/v1',
        API_KEY: 'sk-WJqJGTf09kvMb7XklNQTxDZhDp0nMI4lZbfHGT1POw2CLtgK',
        DEFAULT_MODEL: 'gemini-2.5-pro-preview-06-05',
        AVAILABLE_MODELS: JSON.stringify([
            {"id":"claude-sonnet-4-20250514","description":"Claude Sonnet 4 model"},
            {"id":"gemini-2.5-pro-preview-06-05","description":"Gemini 2.5 Pro preview model"}
        ])
    }
});

console.log('🚀 Starting MCP AI Gateway server...');

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
                    console.log('✅ 工具列表响应:', JSON.stringify(response, null, 2));
                    // 测试 chat completion 调用
                    testChatCompletion();
                } else if (response.id === 2) {
                    console.log('✅ Chat completion 响应:', JSON.stringify(response, null, 2));
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

function testChatCompletion() {
    console.log('📤 发送 chat completion 请求...');
    mcpServer.stdin.write(JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "chat_completion",
            arguments: {
                model: "gemini-2.5-pro-preview-06-05",
                messages: [
                    {
                        role: "user",
                        content: "Hello! Please respond with a simple greeting."
                    }
                ],
                max_tokens: 50,
                temperature: 0.7
            }
        }
    }) + '\n');
}