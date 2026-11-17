import React, { useState } from 'react';
import {
  Cpu,
  Server,
  Box,
  MessageSquare,
  Layers,
  Bot,
  Network,
  Zap,
  BookOpen,
  Menu,
  X
} from 'lucide-react';

import { MechanicsLab } from './components/MechanicsLab';
import { HardwareLab } from './components/HardwareLab';
import { QuantizationLab } from './components/QuantizationLab';
import { PromptStudio } from './components/PromptStudio';
import { OrchestrationLab } from './components/OrchestrationLab';
import { AgentLab } from './components/AgentLab';
import { McpLab } from './components/McpLab';
import { TheoryPanel } from './components/TheoryPanel';

const MODULES = [
  { id: 'mechanics', name: 'LLM Mechanics', desc: 'Tokenization & Logits', icon: Cpu, badge: 'Page 6' },
  { id: 'hardware', name: 'Hardware & Linux', desc: 'WSL2, GPU & Ollama', icon: Server, badge: 'Page 16' },
  { id: 'quantization', name: 'Quantization', desc: 'GGUF & Bit Widths', icon: Box, badge: 'Page 26' },
  { id: 'prompting', name: 'Prompt Formula', desc: '4-Pillars & Dialects', icon: MessageSquare, badge: 'Page 29' },
  { id: 'orchestration', name: 'Chains vs Agents', desc: 'Pipelines vs Loops', icon: Layers, badge: 'Page 40' },
  { id: 'agents', name: 'ReAct Agent Loop', desc: 'Thought & Action', icon: Bot, badge: 'Page 46' },
  { id: 'mcp', name: 'MCP Inspector', desc: 'JSON-RPC 2.0 & Zod', icon: Network, badge: 'Page 54' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('mechanics');
  const [showTheory, setShowTheory] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentModule = MODULES.find((m) => m.id === activeTab) || MODULES[0];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-72 bg-slate-900 border-r border-slate-800 flex-col shrink-0 z-20">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                AI LAB 2026
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Architecture of Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1">
            Core Architecture Labs
          </div>
          {MODULES.map((m) => {
            const Icon = m.icon;
            const isActive = activeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-semibold leading-tight">{m.name}</div>
                    <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {m.desc}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {m.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Theory Toggle in Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setShowTheory(!showTheory)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
              showTheory
                ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Theory & Literature</span>
            </div>
            <div
              className={`w-8 h-4 rounded-full p-0.5 transition-colors ${
                showTheory ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full transition-transform ${
                  showTheory ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-slate-900 border-r border-slate-800 flex flex-col h-full z-10 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-white text-sm">AI LAB 2026</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {MODULES.map((m) => {
                const Icon = m.icon;
                const isActive = activeTab === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveTab(m.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-xs ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{m.name}</span>
                    </div>
                    <span className="text-[10px] opacity-75 font-mono">{m.badge}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">{currentModule.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Ref: {currentModule.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">{currentModule.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTheory(!showTheory)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                showTheory
                  ? 'bg-purple-950/50 border-purple-500/50 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Theory Reference</span>
            </button>
          </div>
        </header>

        {/* Workspace Body with Labs & Theory Drawer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Active Lab Component */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto pb-12">
              {activeTab === 'mechanics' && <MechanicsLab />}
              {activeTab === 'hardware' && <HardwareLab />}
              {activeTab === 'quantization' && <QuantizationLab />}
              {activeTab === 'prompting' && <PromptStudio />}
              {activeTab === 'orchestration' && <OrchestrationLab />}
              {activeTab === 'agents' && <AgentLab />}
              {activeTab === 'mcp' && <McpLab />}
            </div>
          </main>

          {/* Theory Panel Drawer */}
          <TheoryPanel
            activeTab={activeTab}
            isOpen={showTheory}
            onClose={() => setShowTheory(false)}
          />
        </div>
      </div>
    </div>
  );
}
