# MCP AI Gateway

A unified MCP (Model Context Protocol) server that enables AI assistants to intelligently select and switch between different AI models within the same conversation to complete tasks.

## 🎯 Core Concept

### Intelligent Model Selection
The core value of MCP AI Gateway lies in enabling AI assistants to **automatically choose the most suitable model based on task requirements**:

- **Code Tasks**: Let AI choose Claude Opus 4 for advanced code analysis
- **Quick Q&A**: Let AI choose GPT-4o for fast, reliable responses
- **Creative Writing**: Let AI choose GPT-5 or Gemini 2.5 Pro for superior creativity
- **Multimodal Processing**: Let AI choose vision-capable models like GPT-4o

### Workflow Example
Within a single conversation, AI might:
1. Use **Claude Opus 4** to analyze complex code logic
2. Use **GPT-5** to generate creative solutions
3. Use **Gemini 2.5 Pro** for quick verification

All achieved through a unified MCP tool, no manual switching required!

## 🚀 Quick Start

### 1. Installation and Configuration

No installation needed, use directly with npx:

```bash
npx mcp-ai-gateway
```

### 2. Claude Desktop Configuration

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "ai-gateway": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "your-api-key-here",
        "API_ENDPOINT": "https://api.openai.com/v1",
        "DEFAULT_MODEL": "gpt-4o",
        "DESCRIPTION": "Available models:\n- gpt-5: Latest OpenAI model with superior reasoning and creativity\n- gpt-4o: Multimodal model with fast responses\n- claude-opus-4: World's best coding model with extended thinking"
      }
    }
  }
}
```

### 3. Start Using Immediately

After configuration, restart Claude Desktop and you can interact with AI like this:

> "Please use the most suitable model to analyze this code, then use another model to generate test cases"

AI will automatically select appropriate models for different subtasks!

## 📖 Detailed Configuration Guide

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `API_FORMAT` | ✅ | API format | `openai` or `anthropic` |
| `API_KEY` | ✅ | API key | `sk-...` |
| `API_ENDPOINT` | ⚪ | Custom endpoint | `https://api.openai.com/v1` |
| `DEFAULT_MODEL` | ⚪ | Default model | `gpt-4o` |
| `DESCRIPTION` | ⚪ | Custom model description | See examples below |

### API Format Support

#### OpenAI Format
Supports OpenAI, Azure OpenAI, and various OpenAI API-compatible services:

```json
{
  "API_FORMAT": "openai",
  "API_KEY": "sk-your-openai-key",
  "API_ENDPOINT": "https://api.openai.com/v1"
}
```

#### Anthropic Format
Direct support for Anthropic Claude models:

```json
{
  "API_FORMAT": "anthropic", 
  "API_KEY": "sk-ant-your-anthropic-key",
  "API_ENDPOINT": "https://api.anthropic.com",
  "ANTHROPIC_VERSION": "2023-06-01"
}
```

### Custom Description Examples

Through the `DESCRIPTION` environment variable, you can provide detailed model selection guidance for AI:

```bash
export DESCRIPTION="Available AI models and their strengths:

🧠 Reasoning & Analysis:
- claude-opus-4: World's best coding model with 72.5% on SWE-Bench
- gpt-5: Latest model with deep reasoning capabilities and lowest error rates

⚡ Speed & Efficiency:  
- gpt-4o: Fast multimodal responses with near-instant processing
- claude-sonnet-4: Quick processing with extended thinking capabilities
- gemini-2.5-flash: Ultra-fast responses for simple queries

🎨 Creativity & Writing:
- gpt-5: Superior creative writing and content generation
- gemini-2.5-pro: Excellent balance of creativity and factual accuracy
- claude-opus-4: Advanced reasoning for complex creative tasks

💡 Choose the model that best fits your specific task requirements!"
```

## 🛠️ Advanced Configuration

### Enterprise Proxy Support

```bash
export HTTP_PROXY=http://your-proxy:8080
export HTTPS_PROXY=https://your-proxy:8080
```

### Default Parameter Settings

```bash
export DEFAULT_TEMPERATURE=0.7
export DEFAULT_MAX_TOKENS=2000
export OPENAI_ORGANIZATION=org-your-org-id  # OpenAI only
```

### Multi-Provider Configuration Example

You can configure multiple MCP AI Gateway instances to connect to different providers:

```json
{
  "mcpServers": {
    "openai-gateway": {
      "command": "npx", 
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-your-openai-key",
        "DESCRIPTION": "OpenAI models: GPT-5, GPT-4o, GPT-4.5"
      }
    },
    "claude-gateway": {
      "command": "npx",
      "args": ["mcp-ai-gateway"], 
      "env": {
        "API_FORMAT": "anthropic",
        "API_KEY": "sk-ant-your-key",
        "DESCRIPTION": "Anthropic models: Claude Opus 4, Claude Sonnet 4"
      }
    }
  }
}
```

## 🔧 Technical Features

- **🔌 Plug & Play**: Use directly via npx, no installation required
- **🌐 Multi-API Support**: OpenAI, Anthropic, custom endpoints
- **🏗️ Extensible Architecture**: Easy to add new API format support
- **🛡️ Enterprise Ready**: Proxy support, error handling, secure authentication
- **⚡ High Performance**: Direct HTTP calls, no additional overhead
- **📝 Fully Typed**: Written in TypeScript, type-safe

## 🎯 Use Cases

### 1. Development Workflow
- Use Claude Opus 4 for code review and optimization suggestions
- Use GPT-5 for technical documentation generation
- Use fast models for syntax checking

### 2. Content Creation
- Use creative models for draft generation
- Use analytical models for content optimization
- Use fast models for proofreading

### 3. Research & Analysis
- Use reasoning models for complex data analysis
- Use specialized models for report generation
- Use fast models for summary generation

### 4. Third-Party Model Access in AI Clients
**Access premium models through official AI clients:**

- **Claude Desktop with OpenAI Models**: Use your OpenAI API key to access GPT-5, GPT-4o in Claude Desktop interface
- **Third-Party API Integration**: Connect expensive or specialized models (like Claude Opus 4) through custom endpoints
- **Cost Optimization**: Use cheaper third-party API providers while maintaining the familiar Claude Desktop/Gemini CLI experience
- **Model Comparison**: Test different providers' implementations of the same model within one interface
- **Enterprise Solutions**: Access internal or fine-tuned models through your organization's API gateway

**Example Configuration for accessing OpenAI models in Claude Desktop:**
```json
{
  "mcpServers": {
    "openai-access": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-your-openai-key",
        "API_ENDPOINT": "https://api.openai.com/v1",
        "DESCRIPTION": "Access OpenAI's latest models:\n- gpt-5: Most advanced reasoning\n- gpt-4o: Multimodal capabilities\n- Compare with Claude's built-in models"
      }
    }
  }
}
```

## 📚 API Reference

### chat_completion Tool Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | string | Specify the model to use |
| `messages` | array | Array of conversation message objects |
| `temperature` | number | Control randomness (0-2) |
| `max_tokens` | number | Maximum output length |
| `stream` | boolean | Whether to stream output |
| `top_p` | number | Nucleus sampling parameter |
| `frequency_penalty` | number | Frequency penalty |
| `presence_penalty` | number | Presence penalty |
| `stop` | string/array | Stop sequences |

## 🤝 Contributing

Issues and Pull Requests are welcome!

- GitHub: [kinhunt/mcp-ai-gateway](https://github.com/kinhunt/mcp-ai-gateway)
- NPM: [mcp-ai-gateway](https://www.npmjs.com/package/mcp-ai-gateway)

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

**Make AI assistants smarter at choosing models and boost your productivity!** 🚀