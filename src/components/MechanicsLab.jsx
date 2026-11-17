import React, { useState, useMemo } from 'react';
import { Cpu, Hash, Sliders, Sparkles, RefreshCw, Info } from 'lucide-react';

const CANDIDATES = [
  { token: 'autonomous', logit: 4.2 },
  { token: 'transformative', logit: 3.8 },
  { token: 'collaborative', logit: 3.2 },
  { token: 'unpredictable', logit: 2.4 },
  { token: 'open-source', logit: 2.0 },
  { token: 'banana', logit: -1.5 },
];

export const MechanicsLab = () => {
  // Tokenizer State
  const [inputText, setInputText] = useState('Architecture of Intelligence and Neural Synthesis');

  // Simple sub-word tokenizer simulator
  const tokens = useMemo(() => {
    if (!inputText.trim()) return [];
    // Split into words, punctuation, spaces, sub-fragments
    const matches = inputText.match(/\b[\w']+(?:[^\w\s]*)?|\s+|[^\w\s]+/g) || [];
    return matches.map((t, idx) => {
      // Deterministic pseudo ID from string
      let hash = 0;
      for (let i = 0; i < t.length; i++) {
        hash = (hash << 5) - hash + t.charCodeAt(i);
        hash |= 0;
      }
      const tokenNumber = Math.abs(hash % 99999) + 100;
      return {
        text: t,
        id: tokenNumber,
        isSpace: /^\s+$/.test(t),
        length: t.length,
        colorIndex: idx % 5,
      };
    });
  }, [inputText]);

  // Sampling / Temperature State
  const [temperature, setTemperature] = useState(0.7);
  const [sampledToken, setSampledToken] = useState(null);

  // Compute Softmax probabilities based on temperature
  const distribution = useMemo(() => {
    const temp = Math.max(temperature, 0.05); // prevent divide by zero
    // Scale logits: z_i / T
    const scaled = CANDIDATES.map(c => ({
      ...c,
      scaledLogit: c.logit / temp,
    }));
    // Stabilize by subtracting max logit to avoid numeric overflow
    const maxScaled = Math.max(...scaled.map(s => s.scaledLogit));
    const expValues = scaled.map(s => Math.exp(s.scaledLogit - maxScaled));
    const sumExp = expValues.reduce((a, b) => a + b, 0);

    return scaled.map((s, idx) => {
      const prob = (expValues[idx] / sumExp) * 100;
      return {
        token: s.token,
        rawLogit: s.logit,
        scaledLogit: s.scaledLogit.toFixed(2),
        prob: prob,
        probDisplay: prob < 0.1 ? '<0.1%' : `${prob.toFixed(1)}%`,
      };
    });
  }, [temperature]);

  const handleSample = () => {
    const random = Math.random() * 100;
    let accumulated = 0;
    for (const item of distribution) {
      accumulated += item.prob;
      if (random <= accumulated) {
        setSampledToken(item.token);
        return;
      }
    }
    setSampledToken(distribution[distribution.length - 1].token);
  };

  const getEntropyDescription = (t) => {
    if (t < 0.3) return { label: 'Near Greedy (Deterministic)', color: 'text-emerald-400', desc: 'Sharpened peaks. The highest logit dominates with >90% probability. High repeatability.' };
    if (t <= 0.8) return { label: 'Balanced Default', color: 'text-blue-400', desc: 'Standard generative balance between factual adherence and natural vocabulary diversity.' };
    if (t <= 1.4) return { label: 'High Creativity', color: 'text-amber-400', desc: 'Flattened probability curve. Low-probability candidate tokens become viable choices.' };
    return { label: 'Hyper-Stochastic (Chaos)', color: 'text-red-400', desc: 'Logit differences are washed out. Highly random generation, risk of coherence degradation.' };
  };

  const currentEntropy = getEntropyDescription(temperature);

  const colors = [
    'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:border-blue-400',
    'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:border-purple-400',
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:border-emerald-400',
    'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:border-amber-400',
    'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:border-rose-400',
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 mb-1">
          <Cpu className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">LLM Mechanics: The Physics of Intelligence</h2>
        </div>
        <p className="text-sm text-slate-400">
          Explore sub-word tokenization decomposition and how the sampling temperature directly scales logits prior to the Softmax function.
        </p>
      </div>

      {/* Simulator 1: Tokenizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">Sub-Word Tokenizer & Integer ID Mapper</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
              Tokens: <strong className="text-indigo-400">{tokens.length}</strong>
            </span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
              Characters: <strong className="text-emerald-400">{inputText.length}</strong>
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Input Text Stream</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type anything to test token splitting..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
          />
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Presets:</span>
          <button
            onClick={() => setInputText('Architecture of Intelligence and Neural Synthesis')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
          >
            AI Architecture
          </button>
          <button
            onClick={() => setInputText("Transformers resolve polysemy using multi-head self-attention mechanisms.")}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
          >
            Attention Theory
          </button>
          <button
            onClick={() => setInputText("const [temperature, setTemperature] = useState(0.7);")}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
          >
            Code Syntax
          </button>
        </div>

        {/* Tokens preview */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 min-h-[110px]">
          <div className="text-xs text-slate-500 mb-2 font-mono flex items-center justify-between">
            <span>Discrete Token Stream (Hover to view ID & Byte length)</span>
            <span>Ratio: {(inputText.length > 0 ? (tokens.length / inputText.split(/\s+/).filter(Boolean).length || 1).toFixed(2) : '0')} tokens/word</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((tok, i) => (
              <div
                key={i}
                className="group flex flex-col items-center cursor-help transition-transform hover:-translate-y-0.5"
                title={`Token: "${tok.text}" | ID: ${tok.id} | Length: ${tok.length} chars`}
              >
                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                    tok.isSpace
                      ? 'bg-slate-800/60 text-slate-400 border-slate-700'
                      : colors[tok.colorIndex]
                  }`}
                >
                  {tok.isSpace ? '␣ (space)' : tok.text}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-white transition-colors">
                  #{tok.id}
                </span>
              </div>
            ))}
            {tokens.length === 0 && (
              <div className="text-slate-600 text-sm py-4 italic">No text provided. Type above to inspect token segmentation.</div>
            )}
          </div>
        </div>
      </div>

      {/* Simulator 2: Sampling & Temperature Softmax */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white text-base">Sampling Dynamics: Logits Scaling & Softmax</h3>
          </div>
          <div className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-md border border-slate-700">
            Formula: <span className="font-mono text-blue-300">P(w_i) = exp(z_i / T) / Σ exp(z_j / T)</span>
          </div>
        </div>

        {/* Prompt Context Display */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-slate-500">Context Prefix: </span>
          <span className="text-slate-200">"The future trajectory of artificial intelligence systems will be "</span>
          <span className="text-indigo-400 font-bold underline animate-pulse">[Next Token Prediction]</span>
        </div>

        {/* Slider Controls */}
        <div className="grid md:grid-cols-2 gap-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Temperature (T): <span className="text-blue-400 font-mono text-sm">{temperature.toFixed(2)}</span>
              </label>
              <div className="flex gap-1">
                {[0.1, 0.7, 1.2, 1.8].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTemperature(val)}
                    className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                      temperature === val ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    T={val}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0.05 (Greedy)</span>
              <span>1.0 (Standard)</span>
              <span>2.0 (High Chaos)</span>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">State Regime</div>
              <div className={`text-sm font-semibold ${currentEntropy.color}`}>{currentEntropy.label}</div>
              <p className="text-xs text-slate-400 mt-1">{currentEntropy.desc}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSample}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Sample Token From Distribution
              </button>
              {sampledToken && (
                <div className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-md animate-fadeIn">
                  Sampled: <strong className="text-emerald-400 font-mono text-sm">"{sampledToken}"</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Probability Bars Distribution */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Candidate Vocabulary Logits & Softmax Probability</span>
            <span className="text-slate-500">Logit / Scaled (z/T) / P(w)</span>
          </div>

          <div className="space-y-2">
            {distribution.map((item, idx) => {
              const isSelected = sampledToken === item.token;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">"{item.token}"</span>
                      {isSelected && (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/40 font-sans">
                          Chosen
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <span>raw: <strong className="text-slate-200">{item.rawLogit}</strong></span>
                      <span>scaled: <strong className="text-indigo-300">{item.scaledLogit}</strong></span>
                      <span className="font-bold text-emerald-400 text-sm min-w-[50px] text-right">
                        {item.probDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        idx === 0
                          ? 'bg-blue-500'
                          : idx === 1
                          ? 'bg-indigo-500'
                          : idx === 2
                          ? 'bg-purple-500'
                          : idx === 3
                          ? 'bg-amber-500'
                          : idx === 4
                          ? 'bg-teal-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(item.prob, 0.5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
