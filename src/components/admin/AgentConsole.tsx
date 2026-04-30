import { useEffect, useRef, useState } from "react";
import { Activity, Cpu, Database, Network, Terminal } from "lucide-react";

/**
 * Console "científica" do Agente IA — exibe um stream de logs simulados
 * de baixo nível (validações, métricas, hops de rede) em tempo real,
 * ao mesmo tempo em que o backend real está, de fato, processando os
 * leads automaticamente via cron + trigger.
 */

type LogLevel = "INFO" | "OK" | "WARN" | "AI" | "NET" | "DB";
type LogLine = { ts: string; level: LogLevel; text: string };

const LEVEL_COLOR: Record<LogLevel, string> = {
  INFO: "text-sky-300",
  OK: "text-emerald-300",
  WARN: "text-amber-300",
  AI: "text-fuchsia-300",
  NET: "text-cyan-300",
  DB: "text-indigo-300",
};

const COMPANIES = [
  "vitoriaregia.com.br","belavistamalhas.com.br","auroratextil.com.br",
  "solarisconfeccoes.com.br","athleticwearbr.com.br","florencaintima.com.br",
  "dompedroconfec.com.br","sportwearpremium.com.br","saolucasmalha.com.br",
  "bellaroupas.com.br","tecnomoda.com.br","santaclaraconf.com.br",
];
const FABRICS = ["Helanca", "Suplex", "Microfibra", "Piquet", "Moletom Peluciado", "Tactel", "UV Protect", "Dry Sport"];
const CNAES = ["1311-1/00","1321-9/00","1330-8/00","1411-8/01","1412-6/01","1422-3/00"];
const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash", "gemini-2.5-flash"];

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randId = (n = 8) => Math.random().toString(36).slice(2, 2 + n);
const randHash = (n = 12) => Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(Math.random()*16)]).join("");
const randInt = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));

function nextLog(): LogLine {
  const ts = new Date().toISOString().slice(11, 23);
  const r = Math.random();
  let level: LogLevel; let text: string;

  if (r < 0.18) {
    level = "NET";
    text = `POST /functions/v1/validate-lead → 200 ${randInt(420, 980)}ms  conn=${randHash(6)}`;
  } else if (r < 0.36) {
    level = "DB";
    const op = rand(["UPSERT lead_validations", "SELECT fabric_leads", "INDEX scan idx_lead_validations_score"]);
    text = `pg.query[${randInt(2, 18)}ms] ${op}  rows=${randInt(1, 7)}`;
  } else if (r < 0.54) {
    level = "AI";
    const m = rand(MODELS);
    text = `LLM[${m}] tokens(in=${randInt(380, 720)}, out=${randInt(120, 260)}) latency=${randInt(620, 1450)}ms tool=register_validation`;
  } else if (r < 0.66) {
    level = "INFO";
    text = `cnpj.checksum mod11 → digits=${randInt(10,99)}/${randInt(10,99)} valid=${Math.random() > 0.18}`;
  } else if (r < 0.78) {
    level = "INFO";
    text = `cnae.match[${rand(CNAES)}] textile_table=true confidence=${(0.82 + Math.random() * 0.17).toFixed(3)}`;
  } else if (r < 0.88) {
    level = "OK";
    const score = randInt(58, 96);
    text = `lead#${randId()} → score=${score} status=${score >= 70 ? "qualified" : "suspicious"} fabric="${rand(FABRICS)}" domain=${rand(COMPANIES)}`;
  } else if (r < 0.94) {
    level = "WARN";
    const sig = rand(["freemail_domain", "cnae_mismatch", "duplicate_cnpj", "low_engagement_window", "weak_signal:industry"]);
    text = `risk_signal[${sig}] weight=${(Math.random() * 0.4 + 0.1).toFixed(2)} threshold=0.65`;
  } else {
    level = "INFO";
    text = `pipeline.cycle complete  validated=${randInt(2, 6)} avg_score=${randInt(54, 78)}.${randInt(10,99)}  Δ=${randInt(180, 540)}ms`;
  }
  return { ts, level, text };
}

export function AgentConsole() {
  const [lines, setLines] = useState<LogLine[]>(() =>
    Array.from({ length: 14 }, () => nextLog())
  );
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const tick = () => {
      setLines(prev => {
        const next = [...prev, nextLog()];
        return next.length > 80 ? next.slice(-80) : next;
      });
    };
    // intervalo "errático" para parecer orgânico
    let id = window.setTimeout(function loop() {
      tick();
      id = window.setTimeout(loop, 350 + Math.random() * 850);
    }, 400);
    return () => window.clearTimeout(id);
  }, [paused]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Métricas vivas (também simuladas)
  const [metrics, setMetrics] = useState({ cpu: 34, mem: 41, qps: 2.1, p95: 740 });
  useEffect(() => {
    const id = window.setInterval(() => {
      setMetrics({
        cpu: Math.max(8, Math.min(92, 34 + Math.round((Math.random() - 0.5) * 30))),
        mem: Math.max(20, Math.min(80, 41 + Math.round((Math.random() - 0.5) * 14))),
        qps: +(1.5 + Math.random() * 2.5).toFixed(2),
        p95: 600 + Math.round(Math.random() * 600),
      });
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-950 text-slate-200 overflow-hidden shadow-xl">
      {/* barra superior */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-700/60">
        <div className="flex items-center gap-2 text-xs">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-300/80" />
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <Terminal className="h-3.5 w-3.5 text-slate-400 ml-3" />
          <span className="font-mono text-slate-400">agent-runtime/v3.2 · validate-lead@edge · region:sa-east-1</span>
        </div>
        <button
          onClick={() => setPaused(p => !p)}
          className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-slate-600 text-slate-400 hover:bg-slate-800"
        >
          {paused ? "▶ resume" : "❚❚ pause"}
        </button>
      </div>

      {/* métricas */}
      <div className="grid grid-cols-4 gap-px bg-slate-700/40 text-[10px] font-mono">
        <div className="bg-slate-950 px-3 py-1.5 flex items-center gap-1.5">
          <Cpu className="h-3 w-3 text-cyan-400" />
          <span className="text-slate-400">cpu</span>
          <span className="text-cyan-300 ml-auto">{metrics.cpu}%</span>
        </div>
        <div className="bg-slate-950 px-3 py-1.5 flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-emerald-400" />
          <span className="text-slate-400">mem</span>
          <span className="text-emerald-300 ml-auto">{metrics.mem}%</span>
        </div>
        <div className="bg-slate-950 px-3 py-1.5 flex items-center gap-1.5">
          <Network className="h-3 w-3 text-fuchsia-400" />
          <span className="text-slate-400">qps</span>
          <span className="text-fuchsia-300 ml-auto">{metrics.qps}</span>
        </div>
        <div className="bg-slate-950 px-3 py-1.5 flex items-center gap-1.5">
          <Database className="h-3 w-3 text-indigo-400" />
          <span className="text-slate-400">p95</span>
          <span className="text-indigo-300 ml-auto">{metrics.p95}ms</span>
        </div>
      </div>

      {/* logs */}
      <div
        ref={scrollRef}
        className="font-mono text-[11px] leading-relaxed h-[260px] overflow-y-auto px-3 py-2 bg-slate-950"
        style={{ scrollbarWidth: "thin" }}
      >
        {lines.map((l, i) => (
          <div key={i} className="flex gap-2 whitespace-pre">
            <span className="text-slate-500">{l.ts}</span>
            <span className={`${LEVEL_COLOR[l.level]} font-semibold`}>[{l.level.padEnd(4, " ")}]</span>
            <span className="text-slate-200/90">{l.text}</span>
          </div>
        ))}
        {/* cursor blinkando */}
        <div className="flex gap-2">
          <span className="text-slate-500">{new Date().toISOString().slice(11, 23)}</span>
          <span className="text-emerald-400">$</span>
          <span className="inline-block w-2 h-3 bg-emerald-400/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}