# How to Access OpenRouter's Free Gemini Models in Claude Desktop

Save up to 80% on AI costs by accessing free and discounted models through OpenRouter while enjoying the familiar Claude Desktop interface.

## Problem Statement

Claude Desktop is an excellent AI interface, but you're limited to Anthropic's models and pricing. Meanwhile, OpenRouter offers:
- **Free tier models** including Gemini variants
- **Significantly lower costs** than direct API access
- **400+ models** from multiple providers
- **Automatic fallbacks** when models are unavailable

This guide shows you how to access OpenRouter's cost-effective models directly within Claude Desktop using MCP AI Gateway.

## Prerequisites

- Claude Desktop installed
- OpenRouter account (free signup at [openrouter.ai](https://openrouter.ai))
- Basic familiarity with JSON configuration

## Step 1: Get Your OpenRouter API Key

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Navigate to your API Keys section
3. Create a new API key (starts with `sk-or-`)
4. Note your free monthly credits (usually $5-10)

## Step 2: Configure MCP AI Gateway for OpenRouter

Add this configuration to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "openrouter-free": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-or-your-openrouter-key-here",
        "API_ENDPOINT": "https://openrouter.ai/api/v1",
        "DEFAULT_MODEL": "google/gemini-flash-1.5",
        "DESCRIPTION": "Free & Low-Cost Models via OpenRouter:\n\n💰 FREE TIER:\n- google/gemini-flash-1.5: Fast responses, completely free\n- microsoft/phi-3-mini-4k-instruct: Small but capable\n- meta-llama/llama-3.1-8b-instruct: Open source powerhouse\n\n💡 ULTRA-LOW COST:\n- google/gemini-pro-1.5: $0.00125/1K tokens (vs $0.015 direct)\n- anthropic/claude-3-haiku: $0.00025/1K tokens\n- openai/gpt-3.5-turbo: $0.0005/1K tokens\n\n🚀 PREMIUM DISCOUNTED:\n- anthropic/claude-3.5-sonnet: 20% cheaper than direct\n- openai/gpt-4o: Competitive pricing with better availability"
      }
    }
  }
}
```

## Step 3: Configure Your Claude Desktop Settings

### On macOS:
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

### On Windows:
```bash
%APPDATA%\Claude\claude_desktop_config.json
```

Edit the file and add the OpenRouter configuration above.

## Step 4: Restart Claude Desktop

After saving the configuration:
1. Completely quit Claude Desktop
2. Restart the application
3. You should see the new `chat_completion` tool available

## Step 5: Test Your Setup

Try this prompt in Claude Desktop:

> "Please use the OpenRouter gateway to compare the free Gemini Flash model with a premium model for writing a product description for wireless headphones."

Claude will automatically use the OpenRouter models based on your DESCRIPTION guidance.

## Cost Comparison Analysis

| Model | Direct API | OpenRouter | Savings |
|-------|------------|------------|---------|
| Gemini Flash 1.5 | $0.002/1K | **FREE** | 100% |
| Gemini Pro 1.5 | $0.015/1K | $0.00125/1K | 92% |
| Claude 3 Haiku | $0.00025/1K | $0.00025/1K | Same |
| GPT-4o | $0.005/1K | $0.004/1K | 20% |

**Monthly Usage Example:**
- 1M tokens/month through OpenRouter: ~$1.25
- Same usage direct APIs: ~$15
- **Total savings: $13.75/month (92%)**

## Advanced Configuration: Smart Cost Optimization

Set up multiple endpoints for maximum cost efficiency:

```json
{
  "mcpServers": {
    "free-tier": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-or-your-key",
        "API_ENDPOINT": "https://openrouter.ai/api/v1",
        "DEFAULT_MODEL": "google/gemini-flash-1.5",
        "DESCRIPTION": "FREE MODELS ONLY - Use for: simple queries, drafts, brainstorming"
      }
    },
    "premium-discounted": {
      "command": "npx", 
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-or-your-key",
        "API_ENDPOINT": "https://openrouter.ai/api/v1", 
        "DEFAULT_MODEL": "anthropic/claude-3.5-sonnet",
        "DESCRIPTION": "PREMIUM MODELS - Use for: complex analysis, code review, important content"
      }
    }
  }
}
```

## Troubleshooting

### Common Issues

**1. "Model not found" error:**
```json
// Check model names at openrouter.ai/models
"DEFAULT_MODEL": "google/gemini-flash-1.5"  // Correct format
```

**2. Authentication errors:**
```bash
# Verify your API key format
sk-or-v1-1234... ✓ Correct
sk-1234...       ✗ Wrong (OpenAI key)
```

**3. Tool not appearing:**
- Ensure Claude Desktop is completely restarted
- Check JSON syntax in configuration file
- Verify file permissions

### Rate Limiting

OpenRouter free tier limits:
- **Requests**: 200/minute
- **Tokens**: 10,000/day  
- **Monthly**: $10 worth of credits

Monitor usage at: openrouter.ai/usage

## Performance Optimization Tips

### 1. Model Selection Strategy
```
Simple tasks → Gemini Flash (free)
Medium complexity → Gemini Pro 1.5 (ultra-low cost)
Complex analysis → Claude 3.5 Sonnet (discounted premium)
```

### 2. Prompt Engineering for Cost
- Be specific in model requests: "Use the free Gemini model for this simple task"
- Batch similar requests together
- Use shorter prompts when possible

### 3. Monitoring and Budgeting
- Set OpenRouter spending limits
- Review usage patterns monthly
- Identify which tasks can use free models

## Real-World Usage Examples

### Example 1: Content Creation Workflow
```
1. Brainstorm ideas → Gemini Flash (free)
2. Write first draft → Gemini Pro 1.5 (low-cost)  
3. Final edit → Claude 3.5 Sonnet (premium)
```

### Example 2: Development Tasks
```
1. Code suggestions → Gemini Flash (free)
2. Code review → Claude 3.5 Sonnet (premium)
3. Documentation → Gemini Pro 1.5 (low-cost)
```

## Next Steps

1. **Monitor Your Usage**: Check OpenRouter dashboard weekly
2. **Experiment with Models**: Try different models for various tasks
3. **Scale Gradually**: Increase usage as you find your optimal model mix
4. **Set Up Alerts**: Configure spending alerts in OpenRouter

## Advanced: Multiple Provider Setup

For maximum flexibility, combine OpenRouter with direct APIs:

```json
{
  "mcpServers": {
    "openrouter-budget": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-or-your-key",
        "API_ENDPOINT": "https://openrouter.ai/api/v1",
        "DESCRIPTION": "Budget-friendly options via OpenRouter"
      }
    },
    "anthropic-direct": {
      "command": "npx", 
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "anthropic",
        "API_KEY": "sk-ant-your-key",
        "DESCRIPTION": "Direct Anthropic access for guaranteed performance"
      }
    }
  }
}
```

This setup gives you the best of both worlds: cost optimization through OpenRouter and reliable access through direct APIs.

## Conclusion

By integrating OpenRouter with Claude Desktop, you can:
- **Reduce costs by up to 92%** while keeping the same interface
- **Access 400+ models** from a single familiar interface  
- **Maintain quality** with smart model selection
- **Scale efficiently** as your usage grows

Start with the free tier, monitor your usage patterns, and gradually optimize your model selection strategy for maximum cost efficiency.