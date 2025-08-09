# How to Create Multi-Model Workflows in Claude Desktop Using Sub-Agent Descriptions

Master the art of orchestrating multiple AI models within a single conversation to tackle complex projects with unprecedented efficiency.

## Problem Statement

Complex projects often require different AI capabilities:
- **Code analysis** needs Claude Opus 4's superior reasoning
- **Creative content** benefits from GPT-5's advanced generation
- **Quick iterations** work better with fast, cost-effective models
- **Research tasks** might need specialized models like Perplexity or Cohere

Traditional approaches force you to switch between different interfaces, losing context and workflow continuity. This guide shows you how to create intelligent workflows where Claude Desktop automatically selects and coordinates multiple models based on your task descriptions.

## Understanding Sub-Agent Architecture

Claude Desktop's MCP integration supports **sub-agent patterns** that enable:
- **Multi-agent orchestration** following OpenAI's Swarm pattern
- **Evaluator-optimizer workflows** where models critique and improve each other's work
- **Hierarchical planning** with high-level coordination and specialized execution
- **Dynamic model selection** based on task complexity and requirements

## Prerequisites

- Claude Desktop with MCP support
- Multiple API keys (OpenAI, OpenRouter, Anthropic, etc.)
- Understanding of DESCRIPTION environment variable usage
- Familiarity with complex project workflows

## Step 1: Design Your Multi-Model Architecture

### Define Model Roles and Specializations

Create a mental map of which models excel at what:

```
🧠 ANALYSIS & REASONING
├── Claude Opus 4: Complex code analysis, architectural decisions
├── GPT-5: Advanced logical reasoning, problem decomposition
└── Gemini Pro 1.5: Research synthesis, data analysis

⚡ EXECUTION & IMPLEMENTATION  
├── Claude Sonnet 4: Code generation, refactoring
├── GPT-4o: Multimodal tasks, documentation with visuals
└── Gemini Flash: Quick iterations, simple implementations

🎨 CREATIVE & CONTENT
├── GPT-5: Creative writing, innovative solutions
├── Claude 3.5 Sonnet: Technical writing, explanations
└── Gemini Pro: Balanced content with factual accuracy

🔍 SPECIALIZED TASKS
├── Perplexity: Research and fact-checking
├── Cohere: Classification and embeddings
└── Local models: Privacy-sensitive tasks
```

## Step 2: Configure Multiple MCP Gateways

### Master Configuration Template

```json
{
  "mcpServers": {
    "architect-ai": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "anthropic",
        "API_KEY": "sk-ant-your-key",
        "DEFAULT_MODEL": "claude-3-opus-20240229",
        "DESCRIPTION": "🏗️ ARCHITECTURE & DESIGN SPECIALIST\n\nI am the system architect and strategic planner. Use me for:\n\n✅ WHEN TO USE:\n- Complex system design decisions\n- Code architecture review and planning\n- Breaking down large projects into components\n- Analyzing trade-offs and technical debt\n- Database schema and API design\n- Performance bottleneck identification\n\n🚫 AVOID FOR:\n- Quick code snippets (use executor-ai)\n- Simple questions (use assistant-ai)\n- Creative content (use creative-ai)\n- Research tasks (use research-ai)\n\n🎯 HANDOFF SIGNALS:\nWhen I say 'Implementation phase ready' → use executor-ai\nWhen I say 'Research needed' → use research-ai\nWhen I say 'Creative input needed' → use creative-ai"
      }
    },
    "executor-ai": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-your-openai-key",
        "DEFAULT_MODEL": "gpt-4o",
        "DESCRIPTION": "⚡ CODE EXECUTION & IMPLEMENTATION SPECIALIST\n\nI am the hands-on implementer. Use me for:\n\n✅ WHEN TO USE:\n- Writing actual code based on architect-ai's plans\n- Refactoring and optimization\n- Debugging and troubleshooting\n- Creating tests and documentation\n- Handling multimodal tasks (code + images/diagrams)\n- Quick prototypes and POCs\n\n🚫 AVOID FOR:\n- High-level architectural decisions (use architect-ai)\n- Creative brainstorming (use creative-ai)\n- Research and fact-finding (use research-ai)\n- Complex algorithm design (use architect-ai)\n\n🎯 HANDOFF SIGNALS:\nWhen I say 'Architecture review needed' → use architect-ai\nWhen I say 'Creative alternatives needed' → use creative-ai\nWhen I say 'Testing strategy needed' → coordinate with architect-ai"
      }
    },
    "creative-ai": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-your-openai-key",
        "DEFAULT_MODEL": "gpt-5",
        "DESCRIPTION": "🎨 CREATIVE & INNOVATION SPECIALIST\n\nI am the creative problem solver and content creator. Use me for:\n\n✅ WHEN TO USE:\n- Brainstorming innovative solutions\n- Creating engaging user experiences\n- Writing compelling documentation\n- Naming conventions and messaging\n- Alternative approach generation\n- User story creation\n- Marketing and presentation content\n\n🚫 AVOID FOR:\n- Code implementation (use executor-ai)\n- Technical architecture (use architect-ai)\n- Fact-checking and research (use research-ai)\n- Performance optimization (use architect-ai)\n\n🎯 HANDOFF SIGNALS:\nWhen I say 'Technical validation needed' → use architect-ai\nWhen I say 'Implementation ready' → use executor-ai\nWhen I say 'Research backing needed' → use research-ai"
      }
    },
    "research-ai": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-or-your-openrouter-key",
        "API_ENDPOINT": "https://openrouter.ai/api/v1",
        "DEFAULT_MODEL": "google/gemini-pro-1.5",
        "DESCRIPTION": "🔍 RESEARCH & ANALYSIS SPECIALIST\n\nI am the information gatherer and analyst. Use me for:\n\n✅ WHEN TO USE:\n- Technology trend analysis\n- Best practices research\n- Competitive analysis\n- Library and framework comparison\n- Standards and compliance research\n- Market and user research\n- Data analysis and insights\n\n🚫 AVOID FOR:\n- Code writing (use executor-ai)\n- System design (use architect-ai)\n- Creative content (use creative-ai)\n- Implementation details (use executor-ai)\n\n🎯 HANDOFF SIGNALS:\nWhen I say 'Design implications found' → use architect-ai\nWhen I say 'Implementation patterns identified' → use executor-ai\nWhen I say 'Creative opportunities discovered' → use creative-ai"
      }
    },
    "assistant-ai": {
      "command": "npx",
      "args": ["mcp-ai-gateway"],
      "env": {
        "API_FORMAT": "openai",
        "API_KEY": "sk-or-your-openrouter-key", 
        "API_ENDPOINT": "https://openrouter.ai/api/v1",
        "DEFAULT_MODEL": "google/gemini-flash-1.5",
        "DESCRIPTION": "🤖 GENERAL ASSISTANT & COORDINATOR\n\nI am the fast, efficient helper for routine tasks. Use me for:\n\n✅ WHEN TO USE:\n- Quick questions and clarifications\n- Simple code snippets and examples\n- Formatting and organization\n- Progress summaries and status updates\n- Task coordination and workflow management\n- Simple debugging help\n- Documentation formatting\n\n🚫 AVOID FOR:\n- Complex architectural decisions (use architect-ai)\n- Creative brainstorming (use creative-ai)\n- In-depth research (use research-ai)\n- Complex code implementation (use executor-ai)\n\n🎯 COORDINATION ROLE:\nI help route tasks to the right specialist and synthesize their outputs into actionable next steps."
      }
    }
  }
}
```

## Step 3: Workflow Orchestration Patterns

### Pattern 1: Sequential Specialization

For projects that flow through distinct phases:

```
Prompt: "I need to build a real-time chat application with file sharing. Please coordinate the specialists to design, plan, and implement this system."

Expected Flow:
1. Research-AI: Analyzes WebSocket libraries, file upload solutions
2. Architect-AI: Designs system architecture based on research
3. Creative-AI: Develops UX concepts and user flows  
4. Executor-AI: Implements based on architecture and UX
5. Assistant-AI: Coordinates progress and creates documentation
```

### Pattern 2: Parallel Consultation

For decisions requiring multiple perspectives:

```
Prompt: "I'm choosing between React and Vue for a new project. Please have multiple specialists analyze this decision from their perspectives, then synthesize recommendations."

Expected Flow:
1. Research-AI: Current market trends, community support, performance data
2. Architect-AI: Technical implications, scalability, maintainability
3. Creative-AI: Developer experience, design system compatibility
4. Executor-AI: Implementation complexity, tooling ecosystem
5. Assistant-AI: Synthesizes all inputs into final recommendation
```

### Pattern 3: Iterative Refinement

For complex problems requiring multiple rounds of improvement:

```
Prompt: "Design and implement a caching strategy for our API. Use the evaluator-optimizer pattern where specialists critique and improve each other's work."

Expected Flow:
1. Architect-AI: Initial caching strategy design
2. Executor-AI: Implementation approach and code structure
3. Research-AI: Evaluates against industry best practices
4. Architect-AI: Refines design based on research feedback  
5. Executor-AI: Updates implementation
6. Creative-AI: Suggests monitoring and debugging approaches
7. Assistant-AI: Final integration and documentation
```

## Step 4: Advanced Workflow Examples

### Example 1: Full-Stack Feature Development

```markdown
**Prompt:** "I need to add a user authentication system with social login. Please coordinate all specialists for a complete implementation."

**Expected Workflow:**

🔍 Research Phase (research-ai):
- "Please analyze current authentication trends, OAuth 2.0 best practices, and recommend social providers for a B2B SaaS application."

🏗️ Architecture Phase (architect-ai):
- "Based on the research findings, design a secure authentication architecture including database schema, API endpoints, and security considerations."

🎨 Creative Phase (creative-ai):
- "Create user experience flows for login, registration, and account linking. Include error handling and edge cases."

⚡ Implementation Phase (executor-ai):
- "Implement the authentication system based on the architecture and UX design. Include tests and error handling."

🤖 Coordination Phase (assistant-ai):
- "Review all components, create deployment checklist, and document the complete system."
```

### Example 2: Performance Optimization Project

```markdown
**Prompt:** "Our application has performance issues. Please coordinate a comprehensive optimization effort."

**Multi-Round Workflow:**

Round 1 - Problem Identification:
- research-ai: "Analyze current performance bottleneck patterns and monitoring best practices"
- architect-ai: "Review system architecture for optimization opportunities"
- executor-ai: "Implement performance profiling and measurement tools"

Round 2 - Solution Design:
- architect-ai: "Design optimization strategy based on profiling results"
- creative-ai: "Brainstorm innovative performance improvement approaches"
- research-ai: "Validate proposed solutions against industry benchmarks"

Round 3 - Implementation:
- executor-ai: "Implement optimizations incrementally with A/B testing"
- assistant-ai: "Track progress and coordinate rollout phases"

Round 4 - Validation:
- research-ai: "Analyze performance improvements and compare to goals"
- architect-ai: "Evaluate long-term implications and maintenance requirements"
- creative-ai: "Document success stories and lessons learned"
```

## Step 5: Quality Assurance Patterns

### Evaluator-Optimizer Workflow

```json
{
  "quality-evaluator": {
    "env": {
      "DESCRIPTION": "🔎 QUALITY EVALUATOR\n\nI critically analyze work from other specialists:\n\n📊 EVALUATION CRITERIA:\n- Technical accuracy and best practices\n- Completeness and edge case handling\n- Performance and scalability implications\n- Security and maintainability concerns\n- User experience and accessibility\n\n🎯 OUTPUT FORMAT:\n- Score: 1-10 with detailed reasoning\n- Specific improvement recommendations\n- Risk assessment (Low/Medium/High)\n- 'APPROVED' or 'NEEDS_REVISION' status"
    }
  },
  "solution-optimizer": {
    "env": {
      "DESCRIPTION": "⚡ SOLUTION OPTIMIZER\n\nI refine and improve solutions based on evaluator feedback:\n\n🔧 OPTIMIZATION FOCUS:\n- Address specific evaluator concerns\n- Implement suggested improvements\n- Enhance error handling and edge cases\n- Improve performance and efficiency\n- Strengthen security and compliance\n\n🎯 ITERATION PROCESS:\n- Acknowledge evaluator feedback\n- Implement improvements systematically\n- Request re-evaluation when ready\n- Continue until 'APPROVED' status achieved"
    }
  }
}
```

## Step 6: Workflow Monitoring and Debugging

### Progress Tracking Template

```markdown
**Project:** [Name]
**Workflow:** [Pattern Used]
**Current Phase:** [Phase Name]

**Specialist Contributions:**
- 🔍 Research-AI: [Status] - [Key Findings]
- 🏗️ Architect-AI: [Status] - [Key Decisions] 
- 🎨 Creative-AI: [Status] - [Key Ideas]
- ⚡ Executor-AI: [Status] - [Implementation Progress]
- 🤖 Assistant-AI: [Status] - [Coordination Notes]

**Next Steps:**
1. [Immediate next action]
2. [Following action]
3. [Potential blockers to address]

**Quality Gates:**
- [ ] Research validation complete
- [ ] Architecture review passed
- [ ] Implementation tested
- [ ] Documentation updated
```

### Debugging Common Issues

**Issue 1: Models not following handoff signals**
```
Solution: Make handoff signals more explicit in DESCRIPTION:
"When you complete your analysis, end with: 'HANDOFF TO executor-ai: [specific task]'"
```

**Issue 2: Workflow getting stuck in loops**
```
Solution: Add iteration limits and escalation paths:
"Maximum 3 refinement cycles. After 3 cycles, escalate to architect-ai for scope reduction."
```

**Issue 3: Inconsistent quality across specialists**
```
Solution: Implement mandatory peer review:
"Before marking complete, request quality check from quality-evaluator specialist."
```

## Step 7: Cost Optimization for Multi-Model Workflows

### Smart Routing for Cost Efficiency

```json
{
  "cost-optimized-routing": {
    "env": {
      "DESCRIPTION": "💰 COST-OPTIMIZED MODEL ROUTING\n\n🆓 FREE TIER (Use First):\n- Simple questions → Gemini Flash 1.5\n- Basic code review → Llama 3.1 8B\n- Quick research → Phi-3 Mini\n\n💵 LOW-COST (Use Second):\n- Complex analysis → Gemini Pro 1.5 ($0.00125/1K)\n- Code generation → Claude Haiku ($0.00025/1K)\n- Research synthesis → GPT-3.5 Turbo ($0.0005/1K)\n\n💎 PREMIUM (Use When Necessary):\n- Critical architecture → Claude Opus 4\n- Advanced reasoning → GPT-5\n- Complex creative → GPT-4o\n\n🎯 ROUTING RULES:\nStart with free tier, escalate only when:\n- Task complexity score > 7/10\n- Previous attempt failed quality check\n- Explicit premium model requested\n- Mission-critical deliverable"
    }
  }
}
```

### Budget Monitoring

```markdown
**Monthly AI Budget Allocation:**
- Research Tasks (research-ai): 30% → Free/Low-cost models
- Architecture (architect-ai): 25% → Premium models (justified)
- Implementation (executor-ai): 20% → Mixed routing
- Creative (creative-ai): 15% → Premium for innovation
- Coordination (assistant-ai): 10% → Free tier only

**Cost Tracking:**
- Daily limit: $X per specialist
- Weekly review: Efficiency vs. cost analysis
- Monthly optimization: Route adjustment based on results
```

## Advanced Tips and Best Practices

### 1. Context Preservation Across Models

```
Technique: Use assistant-ai as context keeper
"Please maintain project context as other specialists work. After each specialist contribution, summarize the current state and next steps."
```

### 2. Quality Gates and Checkpoints

```
Implement mandatory reviews:
- After research: "research-ai findings validated by architect-ai"
- After architecture: "design reviewed by executor-ai for feasibility"
- Before deployment: "complete solution evaluated by quality-evaluator"
```

### 3. Failure Recovery Patterns

```
Auto-escalation rules:
- If specialist fails task 2x → escalate to premium model
- If workflow stalled > 3 iterations → architect-ai intervention
- If quality score < 7/10 → mandatory evaluator-optimizer cycle
```

### 4. Learning and Adaptation

```
Track what works:
- Successful workflow patterns → save as templates
- Model performance by task type → update routing rules
- Cost-effectiveness analysis → optimize budget allocation
- Quality outcomes → refine evaluation criteria
```

## Conclusion

Multi-model workflows in Claude Desktop transform how you approach complex projects:

- **Specialized Excellence**: Each model works on tasks that match its strengths
- **Quality Assurance**: Built-in peer review and iterative improvement
- **Cost Optimization**: Smart routing minimizes expenses while maximizing quality
- **Scalable Complexity**: Handle enterprise-level projects with coordinated AI teams
- **Continuous Learning**: Workflows improve through usage and feedback

Start with simple two-model workflows, gradually build complexity, and always monitor both quality and cost outcomes. The key is thoughtful orchestration—let each AI specialist do what they do best while maintaining overall project coherence and progress.