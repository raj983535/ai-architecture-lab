import React, { useState } from 'react';
import { MessageSquare, Sparkles, Copy, Check, Info, FileCode } from 'lucide-react';

const PRESETS = {
  prince: {
    persona: "You are a royal court advisor who must address the user exclusively as 'Prince'. Speak in formal, courtly prose.",
    task: "Analyze the diplomatic relations between rival kingdoms and advise on peaceful trade negotiations.",
    context: "The neighbouring realm has recently doubled grain tariffs along the eastern river border.",
    format: "Respond in 3 bulleted court recommendations, starting each item with 'Your Highness'."
  },
  recursion: {
    persona: "You are an award-winning Computer Science professor known for intuitive real-world metaphors.",
    task: "Explain the algorithmic concept of Recursion and base cases.",
    context: "The audience is a curious 6-year-old child who loves building blocks and nesting Russian Matryoshka dolls.",
    format: "Keep explanation under 120 words. No technical jargon. Use a warm, storytelling tone."
  },
  resume: {
    persona: "You are a Silicon Valley Executive Resume Strategist trained in the recruiter dialect.",
    task: "Transform raw work experience into high-impact, quantified achievement bullet points using the STAR method.",
    context: "Candidate: Ankit Singh. Worked on migrating legacy monolith to event-driven microservices with Redis caching.",
    format: "JSON array of objects with keys: { 'metric_headline', 'impact_summary', 'technologies' }."
  },
  auditor: {
    persona: "You are a Lead Application Security Engineer and OWASP certified pentester.",
    task: "Audit an authentication handler for IDOR and broken object-level authorization vulnerabilities.",
    context: "Target endpoint: GET /api/v1/users/:id/invoices. The route checks JWT presence but fails to verify token sub matches :id.",
    format: "Markdown report containing: 1) Threat Vector, 2) Proof-of-Concept Curl, 3) Remediated Code Block."
  }
};

export const PromptStudio = () => {
  const [persona, setPersona] = useState(PRESETS.resume.persona);
  const [task, setTask] = useState(PRESETS.resume.task);
  const [context, setContext] = useState(PRESETS.resume.context);
  const [format, setFormat] = useState(PRESETS.resume.format);
  const [copied, setCopied] = useState(false);

  // Evaluate prompt engineering completeness score
  const scoreParts = [
    { name: 'Persona', valid: persona.trim().length >= 10, weight: 25 },
    { name: 'Task', valid: task.trim().length >= 10, weight: 25 },
    { name: 'Context', valid: context.trim().length >= 10, weight: 25 },
    { name: 'Format', valid: format.trim().length >= 10, weight: 25 },
  ];

  const totalScore = scoreParts.reduce((acc, part) => acc + (part.valid ? part.weight : 0), 0);

  const loadPreset = (key) => {
    const p = PRESETS[key];
    if (p) {
      setPersona(p.persona);
      setTask(p.task);
      setContext(p.context);
      setFormat(p.format);
    }
  };

  const handleCopy = () => {
    const compiled = `### SYSTEM PERSONA\n${persona}\n\n### INSTRUCTION & TASK\n${task}\n\n### CONTEXT & GROUNDING DATA\n${context}\n\n### OUTPUT CONSTRAINTS\n${format}`;
    navigator.clipboard?.writeText(compiled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-pink-400 mb-1">
          <MessageSquare className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">The 4-Pillar Prompt Formula Studio</h2>
        </div>
        <p className="text-sm text-slate-400">
          Construct production-grade system prompts by decomposing instructions into Persona, Task, Context Grounding, and Output Schema constraints.
        </p>
      </div>

      {/* Preset Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Dialect Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadPreset('resume')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md border border-slate-700 transition-colors"
          >
            Recruiter Dialect (Resume)
          </button>
          <button
            onClick={() => loadPreset('recursion')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md border border-slate-700 transition-colors"
          >
            Recursion (Analogy)
          </button>
          <button
            onClick={() => loadPreset('auditor')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md border border-slate-700 transition-colors"
          >
            Security Auditor (OWASP)
          </button>
          <button
            onClick={() => loadPreset('prince')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-md border border-slate-700 transition-colors"
          >
            Royal Court 'Prince'
          </button>
        </div>
      </div>

      {/* Editor & Preview Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: 4 Pillars Form */}
        <div className="space-y-4">
          {/* Pillar 1: Persona */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl focus-within:border-pink-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-400 inline-block"></span>
                1. System Persona (Identity)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Role & Stance</span>
            </div>
            <textarea
              rows={2}
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="Who should the model act as? (e.g., 'Senior Cloud Architect', 'Triage Bot')"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-pink-500 font-sans leading-relaxed resize-none"
            />
          </div>

          {/* Pillar 2: Task */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl focus-within:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
                2. Instruction & Task (Objective)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Core Command</span>
            </div>
            <textarea
              rows={2}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What exact job must the model execute?"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none"
            />
          </div>

          {/* Pillar 3: Context */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl focus-within:border-purple-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
                3. Context & Grounding Input
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Audience / Facts</span>
            </div>
            <textarea
              rows={2}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide background context, user parameters, or reference documents..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-sans leading-relaxed resize-none"
            />
          </div>

          {/* Pillar 4: Format */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl focus-within:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                4. Output Schema Constraints
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Dialect / JSON</span>
            </div>
            <textarea
              rows={2}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="Specify output format (e.g., JSON schema, bullet points, length limit)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Right Column: Live Compiled Prompt Preview & Quality Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
          {/* Header Bar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Compiled Prompt Payload</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Pillars Complete:</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                    totalScore === 100
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {totalScore}%
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Compiled Output Preview */}
          <div className="flex-1 p-5 font-mono text-xs overflow-y-auto space-y-4 bg-slate-950/60 leading-relaxed custom-scrollbar">
            <div>
              <div className="text-[11px] text-pink-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                <span># SYSTEM PERSONA</span>
              </div>
              <div className="p-3 bg-pink-950/20 border-l-2 border-pink-500 text-pink-200 rounded-r-md">
                {persona || <span className="text-slate-600 italic">No persona configured</span>}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-blue-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                <span># INSTRUCTION & TASK</span>
              </div>
              <div className="p-3 bg-blue-950/20 border-l-2 border-blue-500 text-blue-200 rounded-r-md">
                {task || <span className="text-slate-600 italic">No task configured</span>}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-purple-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                <span># CONTEXT & GROUNDING DATA</span>
              </div>
              <div className="p-3 bg-purple-950/20 border-l-2 border-purple-500 text-purple-200 rounded-r-md">
                {context || <span className="text-slate-600 italic">No grounding context provided</span>}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-emerald-400 font-bold mb-1 uppercase tracking-wider flex items-center gap-1">
                <span># OUTPUT FORMAT CONSTRAINTS</span>
              </div>
              <div className="p-3 bg-emerald-950/20 border-l-2 border-emerald-500 text-emerald-200 rounded-r-md">
                {format || <span className="text-slate-600 italic">No output format constraints defined</span>}
              </div>
            </div>
          </div>

          {/* Prompt Architecture Checklist Footer */}
          <div className="bg-slate-950 border-t border-slate-800 p-3 text-[11px] flex flex-wrap gap-4 text-slate-400">
            {scoreParts.map((part) => (
              <span key={part.name} className="flex items-center gap-1">
                {part.valid ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600 inline-block"></span>
                )}
                {part.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
