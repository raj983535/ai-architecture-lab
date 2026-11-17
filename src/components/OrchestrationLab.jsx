import React, { useState } from 'react';
import { Layers, ArrowRight, Play, RefreshCw, CheckCircle, HelpCircle, Bot, GitBranch, ArrowDown } from 'lucide-react';

export const OrchestrationLab = () => {
  const [architecture, setArchitecture] = useState('chain');
  const [chainStep, setChainStep] = useState(0);
  const [agentStep, setAgentStep] = useState(0);

  const chainSteps = [
    { title: '1. Ingest Data', desc: 'Raw recipe or query string ingested into prompt template.', icon: '📥' },
    { title: '2. Deterministic Pipe', desc: 'Prompt piped through LLM model with fixed temperature 0.0.', icon: '⚙️' },
    { title: '3. Parser & Validator', desc: 'Output parser validates strict JSON schema structure.', icon: '🔍' },
    { title: '4. Output Render', desc: 'Deterministic final result formatted and served.', icon: '✅' },
  ];

  const agentSteps = [
    { type: 'thought', title: 'Goal Evaluation', text: 'Objective: Book travel from Paris to Berlin under $150. Inspecting available tools.', color: 'border-yellow-500 bg-yellow-500/10 text-yellow-300' },
    { type: 'action', title: 'Tool Call: search_flights', text: 'Executing search_flights({ origin: "CDG", dest: "BER", max_price: 150 })', color: 'border-pink-500 bg-pink-500/10 text-pink-300' },
    { type: 'observation', title: 'Tool Observation (Failure)', text: 'Flight API returned: 0 flights under $150. Nearest option: $240 (AirFrance).', color: 'border-rose-500 bg-rose-500/10 text-rose-300' },
    { type: 'thought', title: 'Dynamic Branching & Recovery', text: 'Direct flights exceed budget. Re-routing: Evaluating high-speed rail options.', color: 'border-yellow-500 bg-yellow-500/10 text-yellow-300' },
    { type: 'action', title: 'Tool Call: search_trains', text: 'Executing search_trains({ origin: "Paris Gare de l\'Est", dest: "Berlin Hbf" })', color: 'border-pink-500 bg-pink-500/10 text-pink-300' },
    { type: 'observation', title: 'Tool Observation (Success)', text: 'ICE 9568 available: €89 ($96 USD), departure 09:05 tomorrow. Within budget!', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300' },
    { type: 'final', title: 'Final Resolution', text: 'Goal achieved: Booked ICE 9568 train seat for €89. Saving $54 under user ceiling.', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
  ];

  const handleNextChainStep = () => {
    setChainStep((prev) => (prev < chainSteps.length ? prev + 1 : 0));
  };

  const handleNextAgentStep = () => {
    setAgentStep((prev) => (prev < agentSteps.length ? prev + 1 : 0));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-400 mb-1">
          <Layers className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Orchestration Architecture: Chains vs Agents</h2>
        </div>
        <p className="text-sm text-slate-400">
          Compare deterministic sequential chains (like a tea recipe pipeline) against dynamic autonomous agents that inspect tool outputs and branch at runtime.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 flex gap-2">
          <button
            onClick={() => setArchitecture('chain')}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              architecture === 'chain'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Deterministic Chains (LCEL)
          </button>
          <button
            onClick={() => setArchitecture('agent')}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              architecture === 'agent'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            Dynamic Autonomous Agents (ReAct)
          </button>
        </div>
      </div>

      {/* Simulator Content */}
      {architecture === 'chain' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">Linear Pipeline Flow: Deterministic Tea Recipe</h3>
              <p className="text-xs text-slate-400 mt-0.5">Static DAG where each module's stdout connects directly to the next module's stdin.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNextChainStep}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                {chainStep === chainSteps.length ? 'Restart Pipeline' : `Advance Step (${chainStep}/${chainSteps.length})`}
              </button>
            </div>
          </div>

          {/* Interactive Steps Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
            {chainSteps.map((step, idx) => {
              const isActive = chainStep > idx;
              const isCurrent = chainStep === idx + 1;
              return (
                <div key={idx} className="relative flex flex-col items-center">
                  <div
                    className={`w-full p-4 rounded-xl border transition-all text-center flex flex-col items-center justify-center min-h-[140px] ${
                      isCurrent
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 scale-105'
                        : isActive
                        ? 'bg-slate-950 border-emerald-500/50 text-slate-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>{step.title}</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{step.desc}</p>
                  </div>

                  {idx < chainSteps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-700'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* LCEL Pipe Syntax Card */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-slate-500">LCEL Pipeline Expression: </span>
            <span className="text-amber-400 font-bold">chain = prompt | model.bind(temperature=0.0) | json_parser</span>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">ReAct Decision Loop: The Autonomous Travel Agent</h3>
              <p className="text-xs text-slate-400 mt-0.5">The LLM observes tool outputs at runtime and autonomously changes its strategy upon failure.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNextAgentStep}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/10"
              >
                <Play className="w-3.5 h-3.5" />
                {agentStep === agentSteps.length ? 'Restart Agent Loop' : `Execute Next Turn (${agentStep}/${agentSteps.length})`}
              </button>
            </div>
          </div>

          {/* Stepped Loop Trace */}
          <div className="space-y-3 max-w-3xl mx-auto">
            {agentSteps.map((step, idx) => {
              if (idx >= agentStep && agentStep > 0) return null;
              if (agentStep === 0 && idx > 0) return null;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border animate-fadeIn transition-all ${step.color}`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1 uppercase tracking-wider font-mono">
                    <span>{step.title}</span>
                    <span className="text-[10px] opacity-70">Turn #{idx + 1}</span>
                  </div>
                  <div className="text-xs font-mono leading-relaxed">{step.text}</div>
                </div>
              );
            })}

            {agentStep === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs font-mono">
                Click "Execute Next Turn" to watch the agent reason through tool failure and perform dynamic branch recovery.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
