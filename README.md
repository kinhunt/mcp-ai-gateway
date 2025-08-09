# MCP AI Gateway

A unified MCP (Model Context Protocol) server that enables AI assistants to intelligently select and switch between different AI models within the same conversation to complete tasks.

## 🎯 Core Concept

### Intelligent Model Selection
The core value of MCP AI Gateway lies in enabling AI assistants to **automatically choose the most suitable model based on task requirements**:

- **Code Tasks**: Let AI choose Claude Sonnet 4 for complex reasoning
- **Quick Q&A**: Let AI choose GPT-3.5 Turbo for fast responses
- **Creative Writing**: Let AI choose GPT-4 or Gemini for better creativity
- **Multimodal Processing**: Let AI choose vision-capable models

### Workflow Example
Within a single conversation, AI might:
1. Use **Claude** to analyze complex code logic
2. Use **GPT-4** to generate creative solutions
3. Use **Gemini** for quick verification

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
        "DEFAULT_MODEL": "gpt-4",
        "DESCRIPTION": "Available models:\n- gpt-4: Best for complex reasoning and analysis\n- gpt-3.5-turbo: Fast responses for simple tasks\n- claude-3-sonnet: Excellent for code and technical tasks"
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
| `DEFAULT_MODEL` | ⚪ | Default model | `gpt-4` |
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
- claude-3-sonnet-20240229: Excellent for code analysis, debugging, and technical problem-solving
- gpt-4: Superior reasoning, complex analysis, and detailed explanations

⚡ Speed & Efficiency:  
- gpt-3.5-turbo: Fast responses for simple questions and basic tasks
- claude-3-haiku-20240307: Quick processing for straightforward requests

🎨 Creativity & Writing:
- gpt-4: Creative writing, storytelling, and content generation
- gemini-pro: Good balance of creativity and factual accuracy

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
        "DESCRIPTION": "OpenAI models: GPT-4, GPT-3.5-turbo"
      }
    },
    "claude-gateway": {
      "command": "npx",
      "args": ["mcp-ai-gateway"], 
      "env": {
        "API_FORMAT": "anthropic",
        "API_KEY": "sk-ant-your-key",
        "DESCRIPTION": "Anthropic models: Claude-3 Sonnet, Haiku, Opus"
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
- Use Claude for code review and optimization suggestions
- Use GPT-4 for technical documentation generation
- Use fast models for syntax checking

### 2. Content Creation
- Use creative models for draft generation
- Use analytical models for content optimization
- Use fast models for proofreading

### 3. Research & Analysis
- Use reasoning models for complex data analysis
- Use specialized models for report generation
- Use fast models for summary generation

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