import React, { useState } from 'react';
import { Box, Layers, Database, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const MODEL_SIZES = [
  { label: '8B Parameters (e.g. Llama 3.1 8B)', params: 8 },
  { label: '14B Parameters (e.g. Qwen 2.5 14B)', params: 14 },
  { label: '70B Parameters (e.g. Llama 3.3 70B)', params: 70 },
];

const QUANT_CONFIGS = {
  FP32: {
    bits: 32,
    bytesPerParam: 4.0,
    accuracy: '100.0%',
    example: '123.45678912',
    binary: '0 10000101 11101101100111101011011',
    note: 'Original uncompressed IEEE 754 precision. Used during backward pass training.',
    hardware: 'Datacenter A100 / H100 GPU Clusters',
    badgeColor: 'border-red-500/40 bg-red-500/10 text-red-300'
  },
  FP16: {
    bits: 16,
    bytesPerParam: 2.0,
    accuracy: '99.8%',
    example: '123.45',
    binary: '0 10101 1110110110',
    note: 'Industry standard for unquantized inference. Excellent fidelity, half the size of FP32.',
    hardware: 'Multi-GPU workstation or High-end VRAM',
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300'
  },
  INT8: {
    bits: 8,
    bytesPerParam: 1.0,
    accuracy: '99.1%',
    example: '123.4',
    binary: '01111011',
    note: '8-bit symmetric quantization. Negligible degradation on common benchmarks.',
    hardware: 'Single 16GB-24GB Consumer GPU (e.g. RTX 4080/4090)',
    badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-300'
  },
  INT4: {
    bits: 4,
    bytesPerParam: 0.55, // Q4_K_M includes small scale block metadata
    accuracy: '97.6%',
    example: '123',
    binary: '1011',
    note: 'State-of-the-art Q4_K_M GGUF quantization. Extreme compression allows local laptop execution.',
    hardware: 'Apple Silicon Mac (Unified RAM) or 8GB-12GB Laptop GPU',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
  }
};

export const QuantizationLab = () => {
  const [selectedParams, setSelectedParams] = useState(8);
  const [quantLevel, setQuantLevel] = useState('INT4');

  const activeConfig = QUANT_CONFIGS[quantLevel];

  // Calculate memory requirements
  const weightVRAM = (selectedParams * activeConfig.bytesPerParam).toFixed(1);
  const kvCacheVRAM = (selectedParams * 0.15).toFixed(1); // Approximate 8k context KV cache
  const totalRequiredRAM = (parseFloat(weightVRAM) + parseFloat(kvCacheVRAM)).toFixed(1);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-yellow-400 mb-1">
          <Box className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Quantization & Model Memory Architectures</h2>
        </div>
        <p className="text-sm text-slate-400">
          Calculate the exact VRAM footprint, precision loss, and hardware target when compressing neural weights from FP32 down to 4-bit GGUF representations.
        </p>
      </div>

      {/* Control Panel: Model Size & Quant Level */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            1. Select Model Parameter Scale
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            {MODEL_SIZES.map((m) => (
              <button
                key={m.params}
                onClick={() => setSelectedParams(m.params)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedParams === m.params
                    ? 'bg-yellow-500/10 border-yellow-500 text-white font-bold shadow-md shadow-yellow-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-sm font-semibold">{m.params}B Parameters</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{m.label.split('(')[1]?.replace(')', '')}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            2. Choose Quantization Scheme (Bit Width)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.keys(QUANT_CONFIGS).map((k) => (
              <button
                key={k}
                onClick={() => setQuantLevel(k)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  quantLevel === k
                    ? 'bg-gradient-to-b from-yellow-500 to-amber-600 border-yellow-400 text-slate-950 font-black shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="text-base font-mono">{k}</div>
                <div className="text-[10px] uppercase tracking-wider mt-0.5 opacity-80">
                  {QUANT_CONFIGS[k].bits}-Bit ({QUANT_CONFIGS[k].bytesPerParam}B/param)
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-xs uppercase font-bold text-slate-400 mb-1">Raw Weight VRAM</div>
          <div className="text-3xl font-mono font-bold text-white">{weightVRAM} <span className="text-sm text-slate-500 font-sans">GB</span></div>
          <div className="text-[11px] text-slate-500 mt-2">Storage size on disk (.gguf / safetensors)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-xs uppercase font-bold text-slate-400 mb-1">KV Cache & Context</div>
          <div className="text-3xl font-mono font-bold text-blue-400">+{kvCacheVRAM} <span className="text-sm text-slate-500 font-sans">GB</span></div>
          <div className="text-[11px] text-slate-500 mt-2">Allocated for 8K context token history</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-xs uppercase font-bold text-slate-400 mb-1">Total System Memory</div>
          <div className={`text-3xl font-mono font-bold ${parseFloat(totalRequiredRAM) <= 16 ? 'text-emerald-400' : parseFloat(totalRequiredRAM) <= 24 ? 'text-amber-400' : 'text-rose-400'}`}>
            {totalRequiredRAM} <span className="text-sm text-slate-500 font-sans">GB</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Recommended minimum VRAM / Unified RAM</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-xs uppercase font-bold text-slate-400 mb-1">Benchmark Fidelity</div>
          <div className="text-3xl font-mono font-bold text-purple-400">{activeConfig.accuracy}</div>
          <div className="text-[11px] text-slate-500 mt-2">Retained MMLU / GSM8K benchmark score</div>
        </div>
      </div>

      {/* Deep Dive Representation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-yellow-400" />
            Floating Point Precision Breakdown ({quantLevel})
          </h3>
          <span className={`text-xs px-2.5 py-1 rounded-md border ${activeConfig.badgeColor}`}>
            {activeConfig.hardware}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold">Simulated Weight Scalar</span>
              <div className="text-2xl font-mono font-bold text-white mt-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
                {activeConfig.example}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 uppercase font-bold">Bit Register Representation</span>
              <div className="text-xs font-mono text-emerald-400 mt-1 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto">
                {activeConfig.binary}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Architectural Assessment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{activeConfig.note}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">
                Hardware Target: <strong className="text-white">{activeConfig.hardware}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
