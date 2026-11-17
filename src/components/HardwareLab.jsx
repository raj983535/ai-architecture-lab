import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Server, Cpu, HardDrive, Play, HelpCircle, Trash2 } from 'lucide-react';

const INITIAL_LOGS = [
  { cmd: 'system-init', out: 'WSL2 (Windows Subsystem for Linux) kernel 5.15.153.1 initialized.\nUbuntu 24.04.1 LTS ready. CUDA 12.4 Runtime active.' }
];

export const HardwareLab = () => {
  const [history, setHistory] = useState(INITIAL_LOGS);
  const [inputVal, setInputVal] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const runCommand = (cmdText) => {
    const trimmed = (cmdText || inputVal).trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (trimmed.toLowerCase() === 'help') {
      setHistory(prev => [
        ...prev,
        { cmd: trimmed, out: 'Supported simulation commands:\n  nvidia-smi         - Display GPU hardware and VRAM allocation\n  ollama list        - Enumerate locally cached quantized models\n  ollama run llama3  - Spin up local model execution session\n  free -h            - Check system memory and swap headroom\n  uname -a           - Inspect Linux kernel & architecture\n  clear              - Wipe terminal logs' }
      ]);
      setInputVal('');
      return;
    }

    let result = '';
    const lower = trimmed.toLowerCase();

    if (lower === 'nvidia-smi') {
      result = `+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 550.54.14              Driver Version: 550.54.14      CUDA Version: 12.4     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 4090        On  |   00000000:01:00.0 Off |                  N/A |
| 35%   42C    P2             65W / 450W  |   12104MiB / 24564MiB  |      78%     Default |
+-----------------------------------------+------------------------+----------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A      8412      C   /usr/local/bin/ollama-service               11840MiB |
+-----------------------------------------------------------------------------------------+`;
    } else if (lower.startsWith('ollama list')) {
      result = `NAME                 ID              SIZE      MODIFIED
llama3.1:8b-instruct  4360e224e2c8    4.7 GB    2 hours ago
deepseek-r1:8b        61e88e884507    4.9 GB    1 day ago
mistral:7b-v0.3       78e26419b446    4.1 GB    4 days ago
nomic-embed-text:v1.5 0a109f422b47    274 MB    1 week ago`;
    } else if (lower.startsWith('ollama run')) {
      setIsSimulating(true);
      setHistory(prev => [...prev, { cmd: trimmed, out: 'Connecting to ollama daemon on http://127.0.0.1:11434 ...\nLoading weights into RTX 4090 VRAM (4.7 GB allocated)...\nModel ready in 1.14s (evaluation rate: 94.2 tokens/sec).\n>>> Hello! How can I assist you with your AI architecture today?' }]);
      setInputVal('');
      setIsSimulating(false);
      return;
    } else if (lower === 'free -h') {
      result = `               total        used        free      shared  buff/cache   available
Mem:            62Gi        18Gi        38Gi       1.2Gi       5.8Gi        42Gi
Swap:           16Gi       0.0Ki        16Gi`;
    } else if (lower === 'uname -a') {
      result = `Linux wsl-desktop 5.15.153.1-microsoft-standard-WSL2 #1 SMP Fri Mar 29 23:14:13 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux`;
    } else {
      result = `bash: ${trimmed}: command not found. Type 'help' for available diagnostic commands.`;
    }

    setHistory(prev => [...prev, { cmd: trimmed, out: result }]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(inputVal);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-400 mb-1">
          <Server className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Local Hardware & Linux Runtime Execution</h2>
        </div>
        <p className="text-sm text-slate-400">
          Observe how the Ollama daemon bridges POSIX Linux environments in WSL2 to direct CUDA tensor acceleration on host hardware.
        </p>
      </div>

      {/* Hardware Architecture Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Compute Matrix</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">RTX 4090 24GB</div>
          <p className="text-xs text-slate-400 mt-1">16,384 CUDA Cores + 512 4th-Gen Tensor Cores executing FP16/INT4 matrix multiplications.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Memory Bandwidth</span>
            <HardDrive className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">1,008 GB/sec</div>
          <p className="text-xs text-slate-400 mt-1">The primary bottleneck for autoregressive token decoding is VRAM bandwidth, not pure compute.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Daemon Architecture</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">127.0.0.1:11434</div>
          <p className="text-xs text-slate-400 mt-1">Ollama decouples the client UI from the C++ inference engine using a local OpenAI-compatible REST API.</p>
        </div>
      </div>

      {/* Terminal Simulator */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              user@wsl-ubuntulab:~ (zsh)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => runCommand('clear')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-3 custom-scrollbar">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.cmd !== 'system-init' && (
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span>user@wsl:~$</span>
                  <span className="text-white">{item.cmd}</span>
                </div>
              )}
              <div className="text-slate-300 whitespace-pre-wrap pl-2 border-l border-slate-800 leading-relaxed font-mono">
                {item.out}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick Command Action Buttons */}
        <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">Quick Run:</span>
          {['nvidia-smi', 'ollama list', 'ollama run llama3', 'free -h', 'help'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => runCommand(cmd)}
              className="text-[11px] font-mono px-2.5 py-1 bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-700/50 text-slate-300 rounded border border-slate-700 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-mono font-bold text-xs">user@wsl:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSimulating}
            placeholder="Type 'nvidia-smi', 'ollama list', or 'help'..."
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder-slate-700"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
