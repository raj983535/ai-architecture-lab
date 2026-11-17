export const THEORY_DATA = {
  mechanics: {
    title: "The Physics of Intelligence",
    subtitle: "Tokenization, Embeddings & Probability Distributions",
    concepts: [
      {
        t: "Tokenization & Byte-Pair Encoding",
        d: "Text is decomposed into sub-word tokens mapped to integer IDs. Punctuation, morphology (e.g., 'run' vs 'running'), and white space are encoded into discrete numeric vectors.",
        cite: "Page 6-7"
      },
      {
        t: "Vector Space Geometry",
        d: "Tokens map to multi-thousand-dimensional embedding spaces where semantic distance correlates with conceptual similarity: vector('King') - vector('Man') + vector('Woman') ≈ vector('Queen').",
        cite: "Page 8"
      },
      {
        t: "Softmax & Logits Scaling",
        d: "The transformer head produces raw scores (logits) across the vocabulary. Applying Temperature (T) scales logits before the Softmax function: low T sharpens probability peaks, high T flattens them.",
        cite: "Page 9"
      },
      {
        t: "Self-Attention Mechanism",
        d: "Resolves polysemy dynamically: 'bank' attending to 'river' creates a different contextual representation than 'bank' attending to 'deposit'.",
        cite: "Page 12"
      }
    ]
  },
  hardware: {
    title: "Hardware, Compute & Runtimes",
    subtitle: "Matrix Acceleration, Memory Bandwidth & Local Daemons",
    concepts: [
      {
        t: "CPU vs GPU Architecture",
        d: "CPUs excel at complex serial branching with few fast cores. GPUs deploy thousands of tensor cores for high-throughput matrix multiplications required by transformer attention.",
        cite: "Page 16"
      },
      {
        t: "Memory Bandwidth Bottleneck",
        d: "In inference, autoregressive generation is memory-bandwidth bound. Every single token generated requires streaming all model weights from VRAM to compute cores.",
        cite: "Page 18"
      },
      {
        t: "WSL2 & Linux Ecosystem",
        d: "Most high-performance tensor runtimes (CUDA, RoCM, vLLM, TensorRT-LLM) are optimized for POSIX environments. WSL2 provides direct GPU passthrough on Windows.",
        cite: "Page 22"
      },
      {
        t: "Ollama Daemon Architecture",
        d: "Binds to localhost:11434 and exposes an OpenAI-compatible REST API, decoupling model execution and context management from front-end applications.",
        cite: "Page 25"
      }
    ]
  },
  quantization: {
    title: "Quantization & Compression",
    subtitle: "Precision Truncation & Memory Footprint Reduction",
    concepts: [
      {
        t: "Bit-Width Reduction",
        d: "Quantization converts 32-bit floating point weights (FP32) to 16-bit (FP16), 8-bit (INT8), or 4-bit (INT4/GGUF), shrinking memory requirements by up to 75% with minor perplexity loss.",
        cite: "Page 26"
      },
      {
        t: "GGUF File Standard",
        d: "The standard binary format introduced by llama.cpp. Encapsulates model metadata, tensor shapes, quantization schemes, and vocabulary in a single self-contained file.",
        cite: "Page 28"
      },
      {
        t: "VRAM Budgeting Rule of Thumb",
        d: "Required VRAM (GB) ≈ (Parameter Count in Billions × Bits Per Parameter / 8) × 1.2 overhead for KV-cache and context window.",
        cite: "Page 29"
      }
    ]
  },
  prompting: {
    title: "Prompt Architecture & Dialects",
    subtitle: "System Instructions, Context Windows & Few-Shot Priming",
    concepts: [
      {
        t: "The 4-Pillar Prompt Formula",
        d: "Structured prompts separate: 1) System Persona, 2) Core Instruction/Task, 3) Context & Grounding Data, and 4) Output Format Constraints.",
        cite: "Page 29-31"
      },
      {
        t: "Recruiter & Industry Dialects",
        d: "Conditioning the model with domain vocabulary (e.g., STAR method, action verbs, JSON schema) steers attention heads toward industry-specific patterns.",
        cite: "Page 34"
      },
      {
        t: "Chain-of-Thought (CoT)",
        d: "Instructing the model to 'think step by step' generates scratchpad tokens that act as intermediate computational memory, dramatically reducing reasoning errors.",
        cite: "Page 36"
      }
    ]
  },
  orchestration: {
    title: "Chains vs Agents",
    subtitle: "Deterministic Pipelines vs Non-Deterministic Decision Loops",
    concepts: [
      {
        t: "Linear Chains (Tea Recipe)",
        d: "Fixed directed acyclic graphs (DAGs). Each step's output is piped deterministically into the next step's input (e.g., Summarize -> Translate -> Format).",
        cite: "Page 40"
      },
      {
        t: "Autonomous Agents (Travel Agent)",
        d: "Feedback loops where an LLM evaluates the state, decides on an action, invokes an external tool, inspects the result, and iterates until the objective is satisfied.",
        cite: "Page 41"
      },
      {
        t: "State Persistence & Memory",
        d: "LLMs are stateless. Multi-turn interactions require orchestrators (LangChain, LangGraph, LlamaIndex) to curate sliding-window or summarized context memory.",
        cite: "Page 43"
      }
    ]
  },
  agents: {
    title: "The ReAct Agent Framework",
    subtitle: "Reasoning and Acting in Tandem",
    concepts: [
      {
        t: "Thought -> Action -> Observation Loop",
        d: "ReAct interleaves reasoning traces ('Thought') with task-specific actions ('Action' / tool calls) and environment feedback ('Observation') to prevent hallucination.",
        cite: "Page 46"
      },
      {
        t: "Tool Calling & Function Declarations",
        d: "The model receives JSON Schema descriptions of tools and outputs structured function call payloads instead of plain text when external capabilities are needed.",
        cite: "Page 48"
      },
      {
        t: "Stopping Conditions & Guardrails",
        d: "Production agents require iteration limits, timeout budgets, and validation guards to avoid infinite loops when tools return repeated failures.",
        cite: "Page 50"
      }
    ]
  },
  mcp: {
    title: "Model Context Protocol (MCP)",
    subtitle: "The Standardized Open Protocol for AI Capabilities",
    concepts: [
      {
        t: "Universal Client-Server Architecture",
        d: "MCP acts like 'USB-C for AI': one MCP server exposes tools, resources, and prompts to any compliant host (Claude Desktop, Antigravity, Cursor, Ollama).",
        cite: "Page 54"
      },
      {
        t: "JSON-RPC 2.0 Transport",
        d: "Communication operates over JSON-RPC 2.0 via standard I/O (stdio) or Server-Sent Events (SSE) with typed methods like initialize, tools/list, and tools/call.",
        cite: "Page 56"
      },
      {
        t: "Strict Schema Enforcement",
        d: "Server parameters are validated with Zod/JSON-Schema. Invalid arguments fail fast at protocol boundaries before affecting server state.",
        cite: "Page 58"
      }
    ]
  }
};
