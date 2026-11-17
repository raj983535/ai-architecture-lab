import React, { useState } from 'react';
import { Network, Play, AlertCircle, CheckCircle2, ArrowRightLeft, ShieldAlert } from 'lucide-react';

const SEQUENCES = {
  valid: [
    {
      dir: 'client',
      title: '1. Handshake Initialize',
      payload: { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', clientInfo: { name: 'ClaudeDesktop', version: '1.2.0' } } }
    },
    {
      dir: 'server',
      title: '2. Capabilities Manifest',
      payload: { jsonrpc: '2.0', id: 1, result: { protocolVersion: '2024-11-05', serverInfo: { name: 'finance-mcp-server', version: '2.1.0' }, capabilities: { tools: { listChanged: false } } } }
    },
    {
      dir: 'client',
      title: '3. Tool Execution Request',
      payload: { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'convert_currency', arguments: { from: 'USD', to: 'EUR', amount: 1500 } } }
    },
    {
      dir: 'server',
      title: '4. Valid Tool Output Response',
      payload: { jsonrpc: '2.0', id: 2, result: { content: [{ type: 'text', text: '1,500 USD = 1,387.50 EUR (Exchange Rate: 0.925)' }] } }
    }
  ],
  zodError: [
    {
      dir: 'client',
      title: '1. Invalid Tool Call (Type Mismatch)',
      payload: { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'convert_currency', arguments: { from: 'USD', to: 'EUR', amount: "ONE_THOUSAND" } } }
    },
    {
      dir: 'server',
      title: '2. Zod Schema Validation Guard Failure',
      payload: {
        jsonrpc: '2.0',
        id: 3,
        error: {
          code: -32602,
          message: 'Invalid params: ZodError at arguments.amount: Expected number, received string',
          data: { issues: [{ code: 'invalid_type', expected: 'number', received: 'string', path: ['arguments', 'amount'] }] }
        }
      }
    }
  ],
  resource: [
    {
      dir: 'client',
      title: '1. Resource URI Query',
      payload: { jsonrpc: '2.0', id: 4, method: 'resources/read', params: { uri: 'schema://postgres/public/users' } }
    },
    {
      dir: 'server',
      title: '2. Schema Resource Manifest',
      payload: {
        jsonrpc: '2.0',
        id: 4,
        result: {
          contents: [{
            uri: 'schema://postgres/public/users',
            mimeType: 'application/json',
            text: 'CREATE TABLE users (id UUID PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());'
          }]
        }
      }
    }
  ]
};

export const McpLab = () => {
  const [activeSeqKey, setActiveSeqKey] = useState('valid');
  const [logs, setLogs] = useState([]);
  const [isTracing, setIsTracing] = useState(false);

  const runTrace = (key) => {
    const targetKey = key || activeSeqKey;
    setLogs([]);
    setIsTracing(true);

    const steps = SEQUENCES[targetKey];
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsTracing(false);
        }
      }, (idx + 1) * 650);
    });
  };

  const handleSelectSeq = (key) => {
    setActiveSeqKey(key);
    runTrace(key);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-purple-400 mb-1">
          <Network className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Model Context Protocol (MCP) Inspector</h2>
        </div>
        <p className="text-sm text-slate-400">
          Trace JSON-RPC 2.0 messages passing across standard I/O (stdio) between the LLM client host and the external MCP server daemon.
        </p>
      </div>

      {/* Sequence Mode Buttons */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Protocol Tests:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSelectSeq('valid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSeqKey === 'valid'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              1. Valid Handshake & Tool Call
            </button>
            <button
              onClick={() => handleSelectSeq('zodError')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSeqKey === 'zodError'
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              2. Zod Schema Validation Failure
            </button>
            <button
              onClick={() => handleSelectSeq('resource')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSeqKey === 'resource'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              3. Resource Schema Read
            </button>
          </div>
        </div>

        <button
          onClick={() => runTrace()}
          disabled={isTracing}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          {isTracing ? 'Tracing Frame...' : 'Re-Run Protocol Trace'}
        </button>
      </div>

      {/* Traffic Wire Inspector */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[460px]">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <ArrowRightLeft className="w-4 h-4 text-purple-400" />
            <span>JSON-RPC 2.0 Wire Monitor (stdio / SSE)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {logs.length} of {SEQUENCES[activeSeqKey].length} frames exchanged
          </span>
        </div>

        <div className="flex-1 p-5 space-y-4 font-mono text-xs overflow-y-auto custom-scrollbar">
          {logs.length === 0 && (
            <div className="text-center py-24 text-slate-600 italic">
              Select a protocol test above to inspect client-server JSON-RPC payloads in real time.
            </div>
          )}

          {logs.map((item, idx) => {
            const isClient = item.dir === 'client';
            const isError = item.payload.error;

            return (
              <div
                key={idx}
                className={`flex flex-col animate-fadeIn ${
                  isClient ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-[90%] md:max-w-[80%] rounded-xl border p-4 shadow-lg ${
                    isError
                      ? 'bg-rose-950/25 border-rose-500/50 text-rose-200'
                      : isClient
                      ? 'bg-indigo-950/20 border-indigo-500/40 text-indigo-100'
                      : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 text-[11px] font-bold uppercase tracking-wider border-b border-white/10 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      {isError ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      ) : isClient ? (
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {isClient ? 'HOST CLIENT (Claude Desktop / Antigravity)' : 'MCP SERVER (Finance Daemon)'}
                    </span>
                    <span className="text-[10px] opacity-70">{item.title}</span>
                  </div>

                  <pre className="text-xs font-mono overflow-x-auto leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
                    {JSON.stringify(item.payload, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
