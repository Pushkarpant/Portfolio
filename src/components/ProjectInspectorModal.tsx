import React, { useState, useEffect } from "react";
import { playHaptic } from "../audio";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  ExternalLink,
  Layers,
  Play,
  RotateCcw,
  Terminal,
  X,
  Zap,
} from "lucide-react";

export interface ProjectData {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  githubUrl: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  pipeline: { step: string; detail: string }[];
  simulationLogs: { timestamp: string; level: string; msg: string }[];
  codeSnippet: { language: string; filename: string; code: string };
}

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: "verity",
    name: "VERITY · Enterprise RAG Platform",
    badge: "AI PLATFORM & RETRIEVAL",
    tagline: "Two-stage retrieval architecture with tenant isolation, reranking, and sub-second streaming.",
    description:
      "A production-grade Retrieval-Augmented Generation (RAG) platform designed for private-document Q&A. Implements multi-tenant security isolation, semantic Redis caching, Gemini vector embeddings, Pinecone indexing, Cohere cross-encoder reranking, and Server-Sent Events (SSE) for streaming answers with source citations.",
    githubUrl: "https://verity-sx1u.onrender.com",
    tags: ["Python", "FastAPI", "React", "TypeScript", "Pinecone", "Cohere", "Gemini", "Redis", "Docker", "SSE"],
    metrics: [
      { label: "Retrieval Latency", value: "38ms" },
      { label: "Cache Hit Speed", value: "0.8ms" },
      { label: "Rerank Top-K", value: "25 → 5" },
      { label: "Architecture", value: "2-Stage RAG" },
    ],
    pipeline: [
      { step: "Tenant & JWT Auth", detail: "Validates bearer token, scopes, and tenant workspace isolation." },
      { step: "Semantic Redis Cache", detail: "Checks cosine similarity on previous queries for sub-millisecond cached hits." },
      { step: "Gemini Embedding Generation", detail: "Converts natural language prompt to 768-dimensional dense vector representation." },
      { step: "Pinecone Hybrid Vector Search", detail: "Performs dense vector + sparse keyword retrieval to fetch Top-25 candidates." },
      { step: "Cohere Cross-Encoder Rerank", detail: "Jointly scores query-passage pairs to select Top-5 highest relevance chunks." },
      { step: "Streaming SSE LLM Answer", detail: "Pipes context to LLM and streams markdown tokens with verified source citations." },
    ],
    simulationLogs: [
      { timestamp: "00:00.012", level: "AUTH", msg: "JWT token verified. Tenant: 'enterprise-tenant-alpha' [Scope: doc.query]" },
      { timestamp: "00:00.018", level: "CACHE", msg: "Redis query cache lookup: MISS (key=rag:embed:d8a9b2)" },
      { timestamp: "00:00.045", level: "EMBED", msg: "Gemini dense vector embedding generated (dimension=768, latency=27ms)" },
      { timestamp: "00:00.082", level: "INDEX", msg: "Pinecone query returned 25 candidate chunks (namespace='tenant-alpha')" },
      { timestamp: "00:00.114", level: "RERANK", msg: "Cohere cross-encoder reranked 25 -> 5 passages (mean score=0.942)" },
      { timestamp: "00:00.129", level: "STREAM", msg: "LLM synthesis initiated via SSE. Token 0 rendered in 15ms. Status: 200 OK." },
    ],
    codeSnippet: {
      language: "python",
      filename: "pipeline/reranker.py",
      code: `async def retrieve_and_rerank(query: str, tenant_id: str, top_n: int = 5) -> list[DocumentChunk]:
    # 1. Semantic Cache check
    cache_key = f"rag:{tenant_id}:{hash(query)}"
    if cached := await redis_client.get(cache_key):
        return json.loads(cached)

    # 2. Hybrid Vector Search (Dense + Sparse)
    query_vector = await embedding_service.embed_query(query)
    candidates = await vector_db.query(
        vector=query_vector, 
        top_k=25, 
        filter={"tenant_id": tenant_id}
    )

    # 3. Cross-Encoder Reranking
    reranked = await cohere_client.rerank(
        query=query,
        documents=[doc.content for doc in candidates],
        top_n=top_n
    )
    return [candidates[r.index] for r in reranked.results]`,
    },
  },
  {
    id: "prodkit",
    name: "PRODKIT · FastAPI Production Hardening",
    badge: "DEVELOPER INFRASTRUCTURE",
    tagline: "One line. Production ready. Automated security, observability, and Kubernetes probes.",
    description:
      "A reusable production-engineering library designed to transform any FastAPI service into an enterprise-ready microservice. Integrates distributed request IDs, OWASP security headers, RFC 9457 Problem Details error handling, sliding-window Redis rate limiting, Prometheus metrics exporter, and OpenTelemetry distributed tracing.",
    githubUrl: "https://pypi.org/project/prodkit/",
    tags: ["Python", "FastAPI", "OpenTelemetry", "Prometheus", "Redis", "Docker", "Nginx", "Kubernetes"],
    metrics: [
      { label: "Overhead", value: "< 0.4ms" },
      { label: "RFC Compliance", value: "RFC 9457" },
      { label: "Rate Limiter", value: "Sliding Token" },
      { label: "Observability", value: "OTel + Prom" },
    ],
    pipeline: [
      { step: "Request ID Injection", detail: "Assigns unique UUIDv4 X-Request-ID to tracing headers and structured logs." },
      { step: "OWASP Security Middleware", detail: "Enforces HSTS, Content-Security-Policy, X-Frame-Options, and X-Content-Type-Options." },
      { step: "Redis Token Bucket Limiter", detail: "Performs atomic sliding-window rate limiting per IP / API key." },
      { step: "Prometheus Metrics & OTel", detail: "Records request latency histograms, active connections, and spans." },
      { step: "RFC 9457 Error Normalizer", detail: "Transforms unhandled exceptions into RFC 9457 compliant error JSON schemas." },
      { step: "K8s Health Probes", detail: "Provides decoupled /healthz (liveness) and /readyz (readiness) endpoints." },
    ],
    simulationLogs: [
      { timestamp: "00:00.002", level: "MIDDLEWARE", msg: "Request received: GET /api/v1/orders - Generated X-Request-ID: req_c84a20b9" },
      { timestamp: "00:00.005", level: "SECURITY", msg: "Injected headers: Strict-Transport-Security, X-Frame-Options: DENY, CSP: default-src 'self'" },
      { timestamp: "00:00.008", level: "LIMITER", msg: "Redis token bucket check: Key=limit:192.168.1.42 (tokens_left=98/100) -> ALLOW" },
      { timestamp: "00:00.012", level: "TELEMETRY", msg: "OpenTelemetry Span created: trace_id=4bf92f3577b34da6 span_id=00f067aa0ba902b7" },
      { timestamp: "00:00.016", level: "METRICS", msg: "Prometheus histogram recorded: http_request_duration_seconds{status='200'} = 0.0042s" },
      { timestamp: "00:00.018", level: "RESPONSE", msg: "Response dispatched. Latency: 4.2ms. Status: 200 OK." },
    ],
    codeSnippet: {
      language: "python",
      filename: "prodkit/middleware.py",
      code: `from fastapi import FastAPI
from prodkit import ProductionKit, SecurityHeadersConfig, RateLimitConfig

app = FastAPI(title="Core Banking Microservice")

# One line production hardening
ProductionKit(app).enable_all(
    service_name="capital-markets-api",
    request_id=True,
    security_headers=SecurityHeadersConfig(strict_transport=True),
    rate_limiting=RateLimitConfig(backend="redis://localhost:6379", rps=100),
    prometheus_metrics=True,
    kubernetes_probes=True
)`,
    },
  },
];

interface ProjectInspectorModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export function ProjectInspectorModal({ project, onClose }: ProjectInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<"architecture" | "simulation" | "code">("simulation");
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [visibleLogs, setVisibleLogs] = useState<{ timestamp: string; level: string; msg: string }[]>([]);

  useEffect(() => {
    if (!project) return;
    setActiveTab("simulation");
    setSimulationRunning(false);
    setCurrentStepIndex(-1);
    setVisibleLogs([]);
  }, [project]);

  if (!project) return null;

  const runSimulation = () => {
    playHaptic("pulse");
    setSimulationRunning(true);
    setCurrentStepIndex(0);
    setVisibleLogs([]);

    const totalSteps = project.pipeline.length;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step <= totalSteps) {
        setCurrentStepIndex(step - 1);
        playHaptic("beep");
        if (project.simulationLogs[step - 1]) {
          setVisibleLogs((prev) => [...prev, project.simulationLogs[step - 1]]);
        }
      } else {
        clearInterval(interval);
        setSimulationRunning(false);
        playHaptic("success");
      }
    }, 700);
  };

  const resetSimulation = () => {
    playHaptic("click");
    setSimulationRunning(false);
    setCurrentStepIndex(-1);
    setVisibleLogs([]);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} data-lenis-prevent="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">{project.badge}</span>
            <h2>{project.name}</h2>
            <p className="modal-tagline">{project.tagline}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Live Metrics Row */}
        <div className="modal-metrics-bar">
          {project.metrics.map((m) => (
            <div key={m.label} className="modal-metric-card">
              <span className="m-label">{m.label}</span>
              <span className="m-val">{m.value}</span>
            </div>
          ))}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="modal-github-cta"
            onClick={() => playHaptic("click")}
          >
            {project.githubUrl.includes("render.com")
              ? "Live Demo"
              : project.githubUrl.includes("pypi.org")
              ? "View on PyPI"
              : "View Project"}
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === "simulation" ? "active" : ""}`}
            onClick={() => {
              playHaptic("click");
              setActiveTab("simulation");
            }}
          >
            <Play size={14} />
            Live Pipeline Simulator
          </button>
          <button
            className={`modal-tab ${activeTab === "architecture" ? "active" : ""}`}
            onClick={() => {
              playHaptic("click");
              setActiveTab("architecture");
            }}
          >
            <Layers size={14} />
            System Architecture Stages
          </button>
          <button
            className={`modal-tab ${activeTab === "code" ? "active" : ""}`}
            onClick={() => {
              playHaptic("click");
              setActiveTab("code");
            }}
          >
            <Code2 size={14} />
            Source Implementation
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="modal-content">
          {activeTab === "simulation" && (
            <div className="sim-view">
              <div className="sim-toolbar">
                <div className="sim-status">
                  <span className={`hud-dot ${simulationRunning ? "pulsing" : ""}`} />
                  <span>
                    {simulationRunning
                      ? `EXECUTING PIPELINE · STAGE ${currentStepIndex + 1}/${project.pipeline.length}`
                      : currentStepIndex >= project.pipeline.length - 1
                      ? "PIPELINE SIMULATION COMPLETED · 200 OK"
                      : "READY TO EXECUTE SIMULATED REQUEST"}
                  </span>
                </div>

                <div className="sim-actions">
                  <button
                    className="primary-action-btn"
                    onClick={runSimulation}
                    disabled={simulationRunning}
                  >
                    <Play size={14} />
                    {simulationRunning ? "Simulating..." : "Run Live Simulation"}
                  </button>
                  {visibleLogs.length > 0 && !simulationRunning && (
                    <button className="secondary-action-btn" onClick={resetSimulation}>
                      <RotateCcw size={13} />
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Visual Pipeline Stepper */}
              <div className="pipeline-stepper">
                {project.pipeline.map((p, idx) => {
                  const isDone = currentStepIndex > idx || (!simulationRunning && currentStepIndex === project.pipeline.length - 1);
                  const isCurrent = currentStepIndex === idx && simulationRunning;
                  return (
                    <div
                      key={p.step}
                      className={`pipeline-step ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}`}
                    >
                      <div className="step-circle">
                        {isDone ? <CheckCircle2 size={14} /> : <span>{idx + 1}</span>}
                      </div>
                      <span className="step-name">{p.step}</span>
                    </div>
                  );
                })}
              </div>

              {/* Terminal Logs Output */}
              <div className="terminal-box">
                <div className="terminal-bar">
                  <span className="term-dot red" />
                  <span className="term-dot yellow" />
                  <span className="term-dot green" />
                  <span className="term-title">
                    <Terminal size={12} />
                    PushkarPant@SystemConsole: ~/{project.id}/telemetry.log
                  </span>
                </div>
                <div className="terminal-body">
                  {visibleLogs.length === 0 ? (
                    <div className="terminal-empty">
                      Click <b>"Run Live Simulation"</b> above to dispatch a mock request and watch real-time
                      system logs, telemetry metrics, and pipeline transitions.
                    </div>
                  ) : (
                    visibleLogs.map((log, i) => (
                      <div key={i} className="log-line">
                        <span className="log-time">[{log.timestamp}]</span>
                        <span className={`log-lvl lvl-${log.level.toLowerCase()}`}>{log.level}</span>
                        <span className="log-msg">{log.msg}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="arch-view">
              <p className="arch-intro">{project.description}</p>
              <div className="arch-stages-list">
                {project.pipeline.map((item, idx) => (
                  <div
                    key={item.step}
                    className="arch-stage-card"
                    onClick={() => playHaptic("click")}
                  >
                    <div className="stage-num">0{idx + 1}</div>
                    <div className="stage-info">
                      <h4>{item.step}</h4>
                      <p>{item.detail}</p>
                    </div>
                    <ChevronRight size={16} className="stage-chevron" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div className="code-view">
              <div className="code-header">
                <span className="code-filename">{project.codeSnippet.filename}</span>
                <span className="code-lang">{project.codeSnippet.language.toUpperCase()}</span>
              </div>
              <pre className="code-pre">
                <code>{project.codeSnippet.code}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer Tech Tags */}
        <div className="modal-footer">
          <div className="tags-label">TECHNOLOGIES & TOOLS:</div>
          <div className="chips-list">
            {project.tags.map((tag) => (
              <span key={tag} className="tech-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
