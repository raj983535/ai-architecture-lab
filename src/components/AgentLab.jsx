import React, { useState } from 'react';
import { Bot, Play, RotateCcw, Wrench, Eye, CheckCircle2, Terminal } from 'lucide-react';

const SCENARIOS = {
  restaurant: {
    title: 'Restaurant Concierge Agent',
    query: 'User: "Do you have gluten-free and vegan lunch specials today?"',
    tools: ['fetch_menu({ category: "lunch", dietary: ["vegan", "gluten-free"] })'],
    steps: [
      { type: 'thought', label: '1. Reasoning (Thought)', text: 'The user is inquiring about lunch options matching strict dietary constraints: [vegan, gluten-free]. Checking tool registry for menu lookup capability.' },
      { type: 'action', label: '2. Tool Dispatch (Action)', text: 'Executing function call: fetch_menu({ category: "lunch", dietary_flags: ["vegan", "gluten-free"] })' },
      { type: 'observation', label: '3. Environment Feedback (Observation)', text: 'Tool Return: { status: 200, items: [{ name: "Organic Quinoa Buddha Bowl", price: 14.50 }, { name: "Thai Coconut Lemongrass Curry", price: 16.00 }] }' },
      { type: 'thought', label: '4. Synthesis (Thought)', text: 'Tool returned 2 verified items. Formatting polite customer response highlighting both options and prices.' },
      { type: 'final', label: '5. Response Generation (Final)', text: 'Answer: "Yes! Today we have two delicious vegan and gluten-free lunch specials: the Organic Quinoa Buddha Bowl ($14.50) and our Thai Coconut Lemongrass Curry ($16.00)."' }
    ]
  },
  weather: {
    title: 'Real-Time Weather Agent',
    query: 'User: "Should I pack an umbrella for my afternoon meeting in Seattle?"',
    tools: ['get_live_weather({ city: "Seattle", units: "metric" })'],
    steps: [
      { type: 'thought', label: '1. Reasoning (Thought)', text: 'User needs actionable weather advice for Seattle today. Must verify precipitation probability and cloud cover.' },
      { type: 'action', label: '2. Tool Dispatch (Action)', text: 'Executing tool: get_live_weather({ location: "Seattle, WA", include_hourly: true })' },
      { type: 'observation', label: '3. Environment Feedback (Observation)', text: 'API Return: { temp_c: 13, condition: "Steady Rain", precipitation_chance: "85%", wind_kph: 24 }' },
      { type: 'thought', label: '4. Synthesis (Thought)', text: 'Precipitation is 85% with steady rain. Definitive affirmative recommendation required.' },
      { type: 'final', label: '5. Response Generation (Final)', text: 'Answer: "Definitely pack an umbrella! Seattle is currently experiencing steady rain (85% precipitation probability) with temperatures around 13°C (55°F) and moderate winds."' }
    ]
  },
  database: {
    title: 'SQL Database Analyst Agent',
    query: 'User: "Which customer tier generated the highest average order value last quarter?"',
    tools: ['list_tables()', 'execute_sql({ query: "SELECT tier, AVG(total)..." })'],
    steps: [
      { type: 'thought', label: '1. Reasoning (Thought)', text: 'Need to compute average order value grouped by customer tier for Q3. First inspecting database schema.' },
      { type: 'action', label: '2. Tool Dispatch (Action)', text: 'Executing: execute_sql({ query: "SELECT c.tier, ROUND(AVG(o.amount), 2) as avg_aov FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.created_at >= \'2024-07-01\' GROUP BY c.tier ORDER BY avg_aov DESC LIMIT 1;" })' },
      { type: 'observation', label: '3. Environment Feedback (Observation)', text: 'DB Return: [{ tier: "Enterprise VIP", avg_aov: 4280.50, sample_size: 142 }]' },
      { type: 'thought', label: '4. Synthesis (Thought)', text: 'Enterprise VIP tier leads by a wide margin with $4,280.50 AOV across 142 verified orders.' },
      { type: 'final', label: '5. Response Generation (Final)', text: 'Answer: "The Enterprise VIP tier generated the highest average order value last quarter at $4,280.50 per order across 142 completed transactions."' }
    ]
  }
};

export const AgentLab = () => {
  const [activeScenario, setActiveScenario] = useState('restaurant');
  const [logs, setLogs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenario = SCENARIOS[activeScenario];

  const runSimulation = () => {
    setLogs([]);
    setIsPlaying(true);

    scenario.steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step]);
        if (idx === scenario.steps.length - 1) {
          setIsPlaying(false);
        }
      }, (idx + 1) * 700);
    });
  };

  const handleScenarioChange = (key) => {
    setActiveScenario(key);
    setLogs([]);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-orange-400 mb-1">
          <Bot className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">The ReAct Agent Framework: Thought-Action-Observation</h2>
        </div>
        <p className="text-sm text-slate-400">
          Observe how the agent alternates between reasoning traces and tool invocations, grounding its knowledge in external APIs rather than hallucinating answers.
        </p>
      </div>

      {/* Scenario Selector & Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agent Scenarios:</span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(SCENARIOS).map((key) => (
              <button
                key={key}
                onClick={() => handleScenarioChange(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeScenario === key
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/10'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {SCENARIOS[key].title}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={isPlaying}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-orange-500/10 disabled:opacity-50"
        >
          {isPlaying ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          {isPlaying ? 'Running ReAct Loop...' : 'Execute ReAct Loop'}
        </button>
      </div>

      {/* Query Banner */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="text-slate-200">
          <span className="text-slate-500">User Prompt: </span>
          {scenario.query}
        </div>
        <div className="text-orange-400 text-[11px] bg-orange-950/40 px-2.5 py-1 rounded border border-orange-500/30">
          Registered Tools: {scenario.tools.length}
        </div>
      </div>

      {/* ReAct Trace Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[420px]">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>Agent Scratchpad & Tool I/O Stream</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {logs.length} of {scenario.steps.length} turns resolved
          </span>
        </div>

        <div className="flex-1 p-5 space-y-4 font-mono text-xs overflow-y-auto custom-scrollbar">
          {logs.length === 0 && (
            <div className="text-center py-24 text-slate-600 italic">
              Click "Execute ReAct Loop" above to watch the agent formulate reasoning traces, invoke external tools, and parse observations.
            </div>
          )}

          {logs.map((log, idx) => {
            const isThought = log.type === 'thought';
            const isAction = log.type === 'action';
            const isObs = log.type === 'observation';
            const isFinal = log.type === 'final';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border animate-fadeIn transition-all ${
                  isThought
                    ? 'bg-yellow-950/20 border-yellow-500/40 text-yellow-200'
                    : isAction
                    ? 'bg-pink-950/20 border-pink-500/40 text-pink-200'
                    : isObs
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-blue-950/30 border-blue-500/60 text-white shadow-lg shadow-blue-500/10'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                  <span className="flex items-center gap-1.5">
                    {isThought && <span className="w-2 h-2 rounded-full bg-yellow-400"></span>}
                    {isAction && <Wrench className="w-3.5 h-3.5 text-pink-400" />}
                    {isObs && <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                    {isFinal && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    {log.label}
                  </span>
                  <span className="opacity-60 text-[10px]">Turn #{idx + 1}</span>
                </div>
                <div className="leading-relaxed pl-1">{log.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
