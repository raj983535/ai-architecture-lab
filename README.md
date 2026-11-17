# AI Architecture Lab 2026

An interactive LLM engineering and AI systems architecture simulator designed to explore the mechanics, runtimes, quantization, prompting strategies, and orchestration protocols behind modern Large Language Models (based on concepts from *"Architecture of Intelligence"*).

---

## 🚀 Key Modules & Interactive Simulators

### 1. LLM Mechanics & Physics of Intelligence (Page 6)
- **Sub-Word Tokenizer**: Live interactive text decomposition into token chunks, integer token IDs, byte lengths, and token-to-word ratios.
- **Sampling & Softmax Simulator**: Real-time temperature scaling ($z_i / T$) on candidate logits and Softmax probability calculation with greedy vs stochastic state regime analysis and interactive sampling.

### 2. Local Hardware & WSL2 Linux Runtime (Page 16)
- **Interactive WSL Terminal**: Simulated bash terminal running POSIX commands (`nvidia-smi`, `ollama list`, `ollama run llama3`, `free -h`, `uname -a`).
- **Hardware Architecture Breakdown**: GPU matrix parallel compute, memory bandwidth bottlenecks, and Ollama REST daemon architecture (`127.0.0.1:11434`).

### 3. Open Source & Quantization (Page 26)
- **Quantization Calculator**: Compare FP32, FP16, INT8, and INT4 (Q4_K_M GGUF) across 8B, 14B, and 70B parameter models.
- **Memory Footprint**: Calculates model weight VRAM, 8K KV-cache requirements, total system memory, accuracy retention, and target hardware recommendations.

### 4. The 4-Pillar Prompt Formula (Page 29)
- **Prompt Engineering Studio**: Construct robust prompts using Persona, Task, Context Grounding, and Output Format constraints.
- **Live Quality Scoring**: Instant architectural feedback and compiled prompt generation.
- **Presets**: Recruiter Dialect (Resume), Recursion Analogy, Security Auditor (OWASP), and Royal Court.

### 5. Orchestration: Chains vs Agents (Page 40)
- **Linear Pipelines (Chains)**: Deterministic execution flow (LCEL pipe syntax: `prompt | model | parser`).
- **Autonomous Agents (ReAct)**: Dynamic runtime evaluation with decision branching and failure recovery.

### 6. The ReAct Agent Framework (Page 46)
- **Thought-Action-Observation Loop**: Step-by-step trace of agent reasoning, external tool dispatch, environment feedback, and synthesis.
- **Scenarios**: Restaurant Concierge, Real-time Weather Assistant, and SQL Database Analyst.

### 7. Model Context Protocol (MCP) Inspector (Page 54)
- **JSON-RPC 2.0 Wire Monitor**: Trace stdio/SSE protocol frames between host clients (Claude Desktop / Antigravity) and MCP servers.
- **Scenarios**: Valid Handshake & Currency Tool Execution, Zod Schema Validation Failure, and Resource Schema Reading.

### 8. Interactive Theory Reference
- Integrated slide-out panel with curated citations, formulas, and architectural notes for every module.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Setup
```bash
# Clone the repository and navigate into directory
cd ai-architecture-lab

# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run ESLint validation
npm run lint

# Build for production
npm run build
```

---

## 📦 Tech Stack
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS + Custom Scrollbars
- **Icons**: Lucide React
- **Code Quality**: ESLint 9 (Flat Config) with strict React Hooks rules
