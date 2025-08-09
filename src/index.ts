#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

/**
 * Interface for chat completion parameters
 */
interface ChatCompletionParams {
  model?: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
}

/**
 * Configuration interface for the AI Gateway
 */
interface GatewayConfig {
  apiFormat: 'openai' | 'anthropic';
  apiKey: string;
  apiEndpoint: string;
  anthropicVersion?: string;
  openaiOrganization?: string;
  defaultModel?: string;
  defaultTemperature?: number;
  defaultMaxTokens?: number;
  description?: string;
}

/**
 * MCP AI Gateway Server
 * Acts as a unified gateway for multiple AI API providers
 */
class MCPAIGatewayServer {
  private server: Server;
  private httpClient: AxiosInstance;
  private config: GatewayConfig;

  constructor() {
    this.config = this.loadConfiguration();
    this.httpClient = this.createHttpClient();
    
    this.server = new Server(
      {
        name: 'mcp-ai-gateway',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfiguration(): GatewayConfig {
    const apiFormat = (process.env.API_FORMAT?.toLowerCase() as 'openai' | 'anthropic') || 'openai';
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      throw new Error('API_KEY environment variable is required');
    }

    // Default endpoints based on API format
    let defaultEndpoint: string;
    if (apiFormat === 'anthropic') {
      defaultEndpoint = 'https://api.anthropic.com/v1/messages';
    } else {
      defaultEndpoint = 'https://api.openai.com/v1/chat/completions';
    }

    const customDescription = process.env.DESCRIPTION;

    return {
      apiFormat,
      apiKey,
      apiEndpoint: process.env.API_ENDPOINT || defaultEndpoint,
      anthropicVersion: process.env.ANTHROPIC_VERSION || '2023-06-01',
      openaiOrganization: process.env.OPENAI_ORGANIZATION,
      defaultModel: process.env.DEFAULT_MODEL,
      defaultTemperature: process.env.DEFAULT_TEMPERATURE ? parseFloat(process.env.DEFAULT_TEMPERATURE) : undefined,
      defaultMaxTokens: process.env.DEFAULT_MAX_TOKENS ? parseInt(process.env.DEFAULT_MAX_TOKENS) : undefined,
      description: customDescription,
    };
  }

  /**
   * Create HTTP client with proxy support
   */
  private createHttpClient(): AxiosInstance {
    const timeoutSeconds = process.env.REQUEST_TIMEOUT 
      ? parseInt(process.env.REQUEST_TIMEOUT) 
      : 60; // Default 60 seconds
    const timeoutMs = timeoutSeconds * 1000;

    const axiosConfig: AxiosRequestConfig = {
      timeout: timeoutMs,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Proxy support for enterprise environments
    const proxyUrl = process.env.PROXY_URL || process.env.HTTP_PROXY;
    if (proxyUrl) {
      axiosConfig.httpsAgent = new HttpsProxyAgent(proxyUrl);
      axiosConfig.proxy = false;
    }

    return axios.create(axiosConfig);
  }

  /**
   * Setup tool handlers
   */
  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const customDescriptionInfo = this.config.description 
        ? `\n\n${this.config.description}`
        : '';

      return {
        tools: [
          {
            name: 'chat_completion',
            description: `Send a chat completion request to the configured AI API provider (${this.config.apiFormat.toUpperCase()}). ` +
                        `Supports parameters like model, messages, temperature, max_tokens, stream, etc. ` +
                        `Returns the raw response from the API without format conversion.${customDescriptionInfo}`,
            inputSchema: {
              type: 'object',
              properties: {
                model: {
                  type: 'string',
                  description: `Model to use for completion${this.config.defaultModel ? ` (default: ${this.config.defaultModel})` : ''}`,
                },
                messages: {
                  type: 'array',
                  description: 'Array of message objects with role and content',
                  items: {
                    type: 'object',
                    properties: {
                      role: {
                        type: 'string',
                        enum: ['system', 'user', 'assistant'],
                      },
                      content: {
                        type: 'string',
                      },
                    },
                    required: ['role', 'content'],
                  },
                },
                temperature: {
                  type: 'number',
                  description: `Controls randomness in the response${this.config.defaultTemperature ? ` (default: ${this.config.defaultTemperature})` : ''}`,
                  minimum: 0,
                  maximum: 2,
                },
                max_tokens: {
                  type: 'number',
                  description: `Maximum number of tokens to generate${this.config.defaultMaxTokens ? ` (default: ${this.config.defaultMaxTokens})` : ''}`,
                  minimum: 1,
                },
                stream: {
                  type: 'boolean',
                  description: 'Whether to stream the response',
                  default: false,
                },
                top_p: {
                  type: 'number',
                  description: 'Controls diversity via nucleus sampling',
                  minimum: 0,
                  maximum: 1,
                },
                frequency_penalty: {
                  type: 'number',
                  description: 'Penalizes new tokens based on their frequency',
                  minimum: -2,
                  maximum: 2,
                },
                presence_penalty: {
                  type: 'number',
                  description: 'Penalizes new tokens based on whether they appear in the text',
                  minimum: -2,
                  maximum: 2,
                },
                stop: {
                  oneOf: [
                    { type: 'string' },
                    {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  ],
                  description: 'Up to 4 sequences where the API will stop generating further tokens',
                },
              },
              required: ['messages'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'chat_completion') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      return await this.handleChatCompletion(request.params.arguments as unknown as ChatCompletionParams);
    });
  }

  /**
   * Handle chat completion requests
   */
  private async handleChatCompletion(params: ChatCompletionParams): Promise<any> {
    try {
      // Apply defaults from configuration
      const completionParams = {
        ...params,
        model: params.model || this.config.defaultModel,
        temperature: params.temperature ?? this.config.defaultTemperature,
        max_tokens: params.max_tokens ?? this.config.defaultMaxTokens,
      };

      // Validate required parameters
      if (!completionParams.messages || completionParams.messages.length === 0) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'messages parameter is required and cannot be empty'
        );
      }

      // Prepare request based on API format
      const requestData = this.prepareRequestData(completionParams);
      const headers = this.prepareHeaders();

      // Construct URL based on API format
      let url = this.config.apiEndpoint;
      if (this.config.apiFormat === 'openai' && !url.endsWith('/chat/completions')) {
        url = url.endsWith('/') ? url + 'chat/completions' : url + '/chat/completions';
      }

      // Make the API request
      const response = await this.httpClient.post(url, requestData, { headers });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        const statusCode = error.response?.status || 500;
        
        throw new McpError(
          ErrorCode.InternalError,
          `API request failed (${statusCode}): ${errorMessage}`
        );
      }

      throw new McpError(
        ErrorCode.InternalError,
        `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Prepare request data based on API format
   */
  private prepareRequestData(params: ChatCompletionParams): any {
    if (this.config.apiFormat === 'anthropic') {
      // Convert to Anthropic format
      const systemMessage = params.messages.find(m => m.role === 'system');
      const nonSystemMessages = params.messages.filter(m => m.role !== 'system');

      const anthropicData: any = {
        model: params.model,
        messages: nonSystemMessages,
        max_tokens: params.max_tokens || 1024,
      };

      if (systemMessage) {
        anthropicData.system = systemMessage.content;
      }

      if (params.temperature !== undefined) {
        anthropicData.temperature = params.temperature;
      }

      if (params.top_p !== undefined) {
        anthropicData.top_p = params.top_p;
      }

      if (params.stream !== undefined) {
        anthropicData.stream = params.stream;
      }

      if (params.stop) {
        anthropicData.stop_sequences = Array.isArray(params.stop) ? params.stop : [params.stop];
      }

      return anthropicData;
    } else {
      // OpenAI format (default)
      const openaiData: any = {
        model: params.model,
        messages: params.messages,
      };

      if (params.temperature !== undefined) {
        openaiData.temperature = params.temperature;
      }

      if (params.max_tokens !== undefined) {
        openaiData.max_tokens = params.max_tokens;
      }

      if (params.stream !== undefined) {
        openaiData.stream = params.stream;
      }

      if (params.top_p !== undefined) {
        openaiData.top_p = params.top_p;
      }

      if (params.frequency_penalty !== undefined) {
        openaiData.frequency_penalty = params.frequency_penalty;
      }

      if (params.presence_penalty !== undefined) {
        openaiData.presence_penalty = params.presence_penalty;
      }

      if (params.stop !== undefined) {
        openaiData.stop = params.stop;
      }

      return openaiData;
    }
  }

  /**
   * Prepare headers based on API format
   */
  private prepareHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiFormat === 'anthropic') {
      headers['x-api-key'] = this.config.apiKey;
      if (this.config.anthropicVersion) {
        headers['anthropic-version'] = this.config.anthropicVersion;
      }
    } else {
      // OpenAI format
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      if (this.config.openaiOrganization) {
        headers['OpenAI-Organization'] = this.config.openaiOrganization;
      }
    }

    return headers;
  }

  /**
   * Setup error handling
   */
  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP AI Gateway Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Start the server
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP AI Gateway server started');
  }
}

// Start the server
const server = new MCPAIGatewayServer();
server.run().catch(console.error);