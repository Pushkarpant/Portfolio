import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  Phone,
  Play,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { isSoundEnabled, playHaptic, toggleSound } from "./audio";
import { HeroScene } from "./components/ThreeCanvas";
import { ProjectData, PROJECTS_DATA, ProjectInspectorModal } from "./components/ProjectInspectorModal";
import { ResumeModal } from "./components/ResumeModal";
import { TcsExperienceModal } from "./components/TcsExperienceModal";
import "./styles.css";

type Section = "about" | "experience" | "projects" | "skills" | "engineering" | "contact";

const sections: { id: Section; label: string }[] = [
  { id: "about", label: "About Me" },
  { id: "experience", label: "My Experience" },
  { id: "projects", label: "My Projects" },
  { id: "skills", label: "My Skills" },
  { id: "engineering", label: "Engineering" },
  { id: "contact", label: "Contact" },
];

const SKILLS_DATA = [
  {
    title: "Languages & Core",
    text: "Java 17/21 · Python 3.12 · TypeScript · JavaScript · SQL · Data Structures & Algorithms",
    snippet: `// Java 21 Virtual Threads & Structured Concurrency
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Supplier<Order> orderSub = scope.fork(() -> fetchOrder(id));
    Supplier<Inventory> invSub = scope.fork(() -> checkStock(id));
    scope.join().throwIfFailed();
    return new OrderContext(orderSub.get(), invSub.get());
}`,
  },
  {
    title: "Java & Backend",
    text: "Spring Boot 3 · REST APIs · Maven · Microservices · Concurrency · OOP Design",
    snippet: `@RestController
@RequestMapping("/api/v1/settlements")
public class SettlementApi {
    @PostMapping("/execute")
    public CompletableFuture<Response> executeBatch(@RequestBody BatchDto dto) {
        return asyncService.processSettlement(dto).thenApply(Response::ok);
    }
}`,
  },
  {
    title: "Python & Microservices",
    text: "FastAPI · AsyncIO · Pydantic v2 · ProdKit · Celery · PyTest · RESTful Architecture",
    snippet: `# Python FastAPI with ProdKit production middleware
from fastapi import FastAPI
from prodkit import ProductionKit, RateLimitConfig

app = FastAPI(title="Capital Markets Streaming API")
ProductionKit(app).enable_all(
    service_name="trading-stream",
    rate_limiting=RateLimitConfig(rps=200),
    prometheus_metrics=True
)`,
  },
  {
    title: "AI / GenAI & RAG",
    text: "RAG Pipelines · LLM Integration · LangChain · Pinecone · Gemini Embeddings · Cohere Reranking · SSE",
    snippet: `# Two-stage retrieval: dense vector search + cross-encoder reranking
async def retrieve_pipeline(query: str, tenant_id: str):
    vec = await embed_service.embed(query)
    candidates = await pinecone.query(vec, top_k=25, filter={"tenant": tenant_id})
    return await cohere.rerank(query=query, documents=candidates, top_n=5)`,
  },
  {
    title: "Distributed Systems & Streaming",
    text: "Apache Kafka · Redis Distributed Caching · Rate Limiting · Message Queues · Sharding",
    snippet: `# Kafka consumer loop with batch processing & dead-letter queue
async for msg in kafka_consumer:
    batch = json.loads(msg.value)
    processed = await process_event_batch(batch)
    await redis.setex(f"audit:{batch['id']}", 86400, processed)`,
  },
  {
    title: "Databases & Storage",
    text: "PostgreSQL · Oracle · MongoDB · Redis · PL/SQL · Query Plan & Index Optimization",
    snippet: `-- Composite index for high-cardinality multi-tenant financial transactions
CREATE INDEX CONCURRENTLY idx_trades_tenant_exec_ts 
ON capital_trades (tenant_id, ticker, executed_at DESC);`,
  },
  {
    title: "DevOps & Cloud",
    text: "Docker · Docker Compose · Nginx · GitHub Actions CI/CD · Kubernetes health probes · AWS concepts",
    snippet: `# Docker multi-stage slim build with health probes
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
HEALTHCHECK --interval=15s CMD wget -q -O - http://localhost:8080/healthz || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]`,
  },
  {
    title: "Engineering Practice",
    text: "Root-Cause Analysis (RCA) · Production support · Incident resolution · Automation · Technical documentation",
    snippet: `// Incident runbook automation: Thread dump & heap diagnostics analyzer
public void captureDiagnosticSnapshot(String incidentId) {
    DiagnosticCommand.execute("Thread.print", "/var/log/diagnostics/" + incidentId + ".tdump");
}`,
  },
];

const EXPERIENCE_CASES = [
  {
    id: "settlements",
    title: "Capital Markets Enterprise API Architecture",
    detail:
      "Engineered mission-critical Java and Spring Boot backend services processing financial transactions with strict SLA guarantees and integration flows across business units.",
  },
  {
    id: "rca",
    title: "Root-Cause Analysis & Database Query Tuning",
    detail:
      "Investigated production defects through heap dump inspection, thread profiling, and execution plan optimization on Oracle and PostgreSQL databases, reducing transaction latency by 45%.",
  },
  {
    id: "cicd",
    title: "Deployment Automation & Health Monitoring",
    detail:
      "Managed build and release processes, configured containerized staging environments, automated operational runbooks, and monitored Kubernetes health probes to eliminate manual overhead.",
  },
];

function App() {
  const [active, setActive] = useState<Section>("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Modals & Interactive State
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [expandedSkillIndex, setExpandedSkillIndex] = useState<number | null>(null);
  const [activeExpCase, setActiveExpCase] = useState(0);
  const [activeFlowBox, setActiveFlowBox] = useState<string | null>(null);
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [tcsModalOpen, setTcsModalOpen] = useState(false);

  // Contact form state
  const [submitted, setSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const lenisRef = React.useRef<Lenis | null>(null);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".hero-copy > *",
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.07, ease: "power2.out" }
    );
    gsap.fromTo(
      ".hero-name",
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.95, ease: "power3.out", delay: 0.12 }
    );
    gsap.fromTo(
      ".scene",
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out", delay: 0.25 }
    );

    // ScrollTrigger reveal animations for each panel
    gsap.utils.toArray<HTMLElement>(".panel").forEach((panel) => {
      gsap.fromTo(
        panel,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Stagger project cards entrance
    gsap.utils.toArray<HTMLElement>(".project").forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Skills grid stagger
    gsap.utils.toArray<HTMLElement>(".skill").forEach((skill, i) => {
      gsap.fromTo(
        skill,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: i * 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: skill,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Stop background scrolling when modals are open
  useEffect(() => {
    if (selectedProject !== null || resumeOpen || tcsModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedProject, resumeOpen, tcsModalOpen]);

  const go = (id: Section) => {
    playHaptic("click");
    setActive(id);
    setMenuOpen(false);
    const panel = document.getElementById(`panel-${id}`);
    if (panel && lenisRef.current) {
      lenisRef.current.scrollTo(panel, { offset: -25, duration: 1.1 });
    } else {
      panel?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playHaptic("success");
    setSubmitted(true);
  };

  const handleFlowClick = (name: string) => {
    playHaptic("beep");
    setActiveFlowBox(name);
    setTimeout(() => setActiveFlowBox(null), 1200);
  };

  return (
    <div className="app">
      {/* ==========================================================================
          HEADER / TOPBAR
          ========================================================================== */}
      <header className="topbar">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Go to top">
          <span className="mark">PP</span>
          <span>
            <b>PUSHKAR PANT</b>
            <small>Software Engineer · Java & Python</small>
          </span>
        </button>

        <nav className={`desktop-nav ${menuOpen ? "open" : ""}`}>
          {sections.map((s) => (
            <button
              key={s.id}
              className={active === s.id ? "active" : ""}
              onClick={() => go(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="top-actions">
          {/* Audio toggle */}
          <button
            className="sound-btn"
            onClick={handleSoundToggle}
            title={soundOn ? "Tactile Audio: ON" : "Tactile Audio: OFF"}
            aria-label="Toggle sound"
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* GitHub Profile */}
          <a
            href="https://github.com/Pushkarpant"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            title="GitHub (Pushkarpant)"
            onClick={() => playHaptic("click")}
          >
            <Github size={17} />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/pushkarpant18"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn Profile"
            onClick={() => playHaptic("click")}
          >
            <Linkedin size={17} />
          </a>

          {/* Interactive Resume Trigger */}
          <button
            className="resume"
            onClick={() => {
              playHaptic("beep");
              setResumeOpen(true);
            }}
          >
            <FileText size={12} />
            RÉSUMÉ
          </button>

          {/* Mobile menu hamburger */}
          <button
            className="menu"
            onClick={() => {
              playHaptic("click");
              setMenuOpen((v) => !v);
            }}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ==========================================================================
          HERO SECTION & INTERACTIVE 3D SCENE
          ========================================================================== */}
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">SOFTWARE ENGINEER · JAVA 17/21 · PYTHON · AI · SYSTEMS</div>
            <h1 className="hero-name">
              𝒫𝓊𝓈𝒽𝓀𝒶𝓇<br />
              <span>𝒫𝒶𝓃𝓉.</span>
            </h1>
            <h2>I build systems worth remembering.</h2>
            <p>
              Software Engineer at <b>Tata Consultancy Services (TCS)</b> in Capital Markets. Working across{" "}
              <b>Java</b>, <b>Python</b>, Spring Boot, FastAPI, distributed systems, cloud deployment, and AI-powered applications.
            </p>
            <div className="buttons">
              <button className="primary" onClick={() => go("projects")}>
                Explore my projects <ArrowDown size={15} />
              </button>
              <button className="secondary" onClick={() => go("about")}>
                About me
              </button>
            </div>
          </div>

          {/* Interactive 3D Scene with clickable labels & live diagnostics */}
          <HeroScene />
        </section>

        {/* Section navigation tabs */}
        <div className="section-tabs">
          {sections.map((s) => (
            <button
              key={s.id}
              className={active === s.id ? "active" : ""}
              onClick={() => go(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* ==========================================================================
            PANEL 01: ABOUT ME
            ========================================================================== */}
        <SectionPanel
          id="about"
          number="01"
          title={
            <>
              About<br />me.
            </>
          }
          description="A concise view of the engineer behind the systems."
        >
          <div className="about-grid">
            <div>
              <p className="statement">
                I work at the intersection of <em>backend engineering</em>, system architecture, and{" "}
                <em>AI-powered products</em> in <em>Java</em> and <em>Python</em>.
              </p>
              <p className="muted">
                My focus is turning complex requirements into software that is understandable, reliable, and ready to
                run in production. I enjoy working from API design and data flows through deployment, observability,
                and operational problem-solving.
              </p>
            </div>
            <div className="facts">
              <Fact label="Current role" value="Software Engineer · TCS" />
              <Fact label="Domain" value="Capital Markets & Enterprise APIs" />
              <Fact label="Postgraduate" value="MCA · Lovely Professional University" />
              <Fact label="Undergraduate" value="BCA · University of Lucknow" />
              <Fact label="Core Focus" value="Java · Python · Backend · Systems · AI" />
            </div>
          </div>
        </SectionPanel>

        {/* ==========================================================================
            PANEL 02: EXPERIENCE (TCS CAPITAL MARKETS)
            ========================================================================== */}
        <SectionPanel
          id="experience"
          number="02"
          title={
            <>
              My<br />experience.
            </>
          }
          description="Enterprise application engineering, enhancement, integration and production problem-solving."
        >
          <article
            className="experience"
            onClick={() => {
              playHaptic("click");
              setTcsModalOpen(true);
            }}
            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
            title="Click to view full role details"
          >
            <div className="period">
              TCS<br />CAPITAL MARKETS
            </div>
            <div>
              <h3>Software Engineer</h3>
              <b className="accent-text">TATA CONSULTANCY SERVICES (TCS) · INDIA</b>
              <p className="muted">
                Enterprise application engineering and production support; REST API and service development in Java
                and Python; root-cause analysis and incident resolution; complex SQL and database investigations;
                deployment, environment setup, build and release activities.
                <br /><span style={{ fontSize: "10px", color: "#C05800", marginTop: 8, display: "inline-block", fontWeight: 700, letterSpacing: "0.05em" }}>▼ CLICK TO VIEW KEY ACHIEVEMENTS</span>
              </p>

              {/* Interactive Case Studies Tabs */}
              <div className="exp-interactive-details">
                <span className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
                  CLICK TO INSPECT REAL-WORLD PRODUCTION SCENARIOS:
                </span>
                <div className="exp-tabs">
                  {EXPERIENCE_CASES.map((item, idx) => (
                    <button
                      key={item.id}
                      className={`exp-tab-btn ${activeExpCase === idx ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        playHaptic("beep");
                        setActiveExpCase(idx);
                      }}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "#38240D", margin: 0 }}>
                  {EXPERIENCE_CASES[activeExpCase].detail}
                </p>
              </div>
            </div>
            <ArrowUpRight className="arrow" />
          </article>
        </SectionPanel>

        {/* ==========================================================================
            PANEL 03: PROJECTS (WITH LIVE SIMULATOR MODAL)
            ========================================================================== */}
        <SectionPanel
          id="projects"
          number="03"
          title={
            <>
              My<br />projects.
            </>
          }
          description="Production-oriented projects built around AI retrieval, developer infrastructure, and distributed streaming. Click any card to launch the Interactive Pipeline Simulator."
        >
          {PROJECTS_DATA.map((proj, idx) => (
            <ProjectCard
              key={proj.id}
              number={`0${idx + 1}`}
              name={proj.name.split("·")[0].trim()}
              type={proj.badge}
              text={proj.description}
              tags={proj.tags}
              diagram={proj.pipeline.map((p) => p.step)}
              onClick={() => {
                playHaptic("beep");
                setSelectedProject(proj);
              }}
            />
          ))}
        </SectionPanel>

        {/* ==========================================================================
            PANEL 04: SKILLS (INTERACTIVE CODE SNIPPETS)
            ========================================================================== */}
        <SectionPanel
          id="skills"
          number="04"
          title={
            <>
              My<br />skills.
            </>
          }
          description="Grouped around how I actually build software. Click any skill to inspect the production implementation pattern."
        >
          <div className="skills-grid">
            {SKILLS_DATA.map((skill, index) => {
              const isOpen = expandedSkillIndex === index;
              return (
                <article
                  key={skill.title}
                  className={`skill ${isOpen ? "active" : ""}`}
                  onClick={() => {
                    playHaptic("click");
                    setExpandedSkillIndex(isOpen ? null : index);
                  }}
                >
                  <h3>
                    <span>{skill.title}</span>
                    {isOpen ? <ChevronUp size={16} color="#C05800" /> : <ChevronDown size={16} opacity={0.5} />}
                  </h3>
                  <p>{skill.text}</p>
                  {isOpen && (
                    <div className="skill-code-drawer">
                      <pre style={{ margin: 0 }}>
                        <code>{skill.snippet}</code>
                      </pre>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </SectionPanel>

        {/* ==========================================================================
            PANEL 05: ENGINEERING & BLUEPRINT
            ========================================================================== */}
        <SectionPanel
          id="engineering"
          number="05"
          title={
            <>
              How I think<br />about systems.
            </>
          }
          description="The engineering principles behind the work I showcase. Click any flow node to simulate request routing."
        >
          <div className="engineering-grid">
            <div className="principles">
              <Principle
                title="Architecture"
                text="Start with requirements, contracts and boundaries, then design data flow, service interactions and deployment."
                active={activePrinciple === 0}
                onClick={() => {
                  playHaptic("click");
                  setActivePrinciple(0);
                }}
              />
              <Principle
                title="Reliability"
                text="Health checks, structured logs, metrics, tracing, retries and rate limiting are considered part of the system."
                active={activePrinciple === 1}
                onClick={() => {
                  playHaptic("click");
                  setActivePrinciple(1);
                }}
              />
              <Principle
                title="Security"
                text="Authentication, authorization, validation, security headers and tenant isolation are designed around the actual threat surface."
                active={activePrinciple === 2}
                onClick={() => {
                  playHaptic("click");
                  setActivePrinciple(2);
                }}
              />
              <Principle
                title="Delivery"
                text="Automated builds, repeatable environments and deployment pipelines reduce friction between code and production."
                active={activePrinciple === 3}
                onClick={() => {
                  playHaptic("click");
                  setActivePrinciple(3);
                }}
              />
            </div>

            <div className="architecture">
              <span>PORTFOLIO BACKEND REFERENCE (CLICK NODES TO TEST FLOW)</span>
              <div className="flow">
                <Flow
                  items={["React + TS", "Nginx", "Spring Boot / Java 21"]}
                  activeItem={activeFlowBox}
                  onItemClick={handleFlowClick}
                />
                <Flow
                  items={["FastAPI AI", "Pinecone Vector DB", "Cohere Rerank"]}
                  activeItem={activeFlowBox}
                  onItemClick={handleFlowClick}
                />
                <Flow
                  items={["PostgreSQL", "+ Redis Hot Cache", "+ Docker"]}
                  activeItem={activeFlowBox}
                  onItemClick={handleFlowClick}
                />
                <Flow
                  items={["GitHub Actions", "Deployment", "Monitoring"]}
                  activeItem={activeFlowBox}
                  onItemClick={handleFlowClick}
                />
              </div>
            </div>
          </div>
        </SectionPanel>

        {/* ==========================================================================
            PANEL 06: CONTACT
            ========================================================================== */}
        <SectionPanel
          id="contact"
          number="06"
          title={
            <>
              Let's build<br />something <em>useful.</em>
            </>
          }
          description="Have a technical problem, a system to discuss, or an interesting engineering opportunity?"
        >
          <div className="contact-grid">
            <div>
              <p className="contact-copy">
                Start a conversation about software, systems, AI or engineering.
              </p>
              <div className="contact-links">
                {/* One-click email */}
                <a
                  href="mailto:pantpushkar4@gmail.com"
                  className="contact-copy-btn"
                  title="Send an email"
                  onClick={() => playHaptic("click")}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Mail size={16} /> pantpushkar4@gmail.com
                  </span>
                  <ExternalLink size={14} />
                </a>

                {/* One-click phone */}
                <a
                  href="tel:+917905590951"
                  className="contact-copy-btn"
                  title="Call phone number"
                  onClick={() => playHaptic("click")}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Phone size={16} /> +91 7905590951
                  </span>
                  <ExternalLink size={14} />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/Pushkarpant"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playHaptic("click")}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Github size={16} /> GitHub / Pushkarpant
                  </span>
                  <ExternalLink size={14} />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playHaptic("click")}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Linkedin size={16} /> LinkedIn
                  </span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Interactive Form */}
            <form className="contact-form" onSubmit={handleFormSubmit}>
              <label>
                Name
                <input
                  required
                  placeholder="Your name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </label>
              <label>
                Message
                <textarea
                  required
                  placeholder="Tell me what you're building..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </label>
              <button className="primary" type="submit">
                Send message <ArrowUpRight size={15} />
              </button>
              {submitted && (
                <small className="form-note">
                  ✓ Message transmitted (Ticket #ENG-9428). I look forward to speaking with you!
                </small>
              )}
            </form>
          </div>
        </SectionPanel>
      </main>

      {/* ==========================================================================
          FOOTER
          ========================================================================== */}
      <footer>
        <span>PUSHKAR PANT · SOFTWARE ENGINEER (JAVA & PYTHON)</span>
        <button
          onClick={() => {
            playHaptic("click");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          BACK TO TOP ↑
        </button>
        <span>JAVA · PYTHON · AI · SYSTEMS</span>
      </footer>

      {/* ==========================================================================
          MODALS
          ========================================================================== */}
      {selectedProject && (
        <ProjectInspectorModal
          project={selectedProject}
          onClose={() => {
            playHaptic("beep");
            setSelectedProject(null);
          }}
        />
      )}

      <TcsExperienceModal
        isOpen={tcsModalOpen}
        onClose={() => {
          playHaptic("beep");
          setTcsModalOpen(false);
        }}
      />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => {
          playHaptic("click");
          setResumeOpen(false);
        }}
      />
    </div>
  );
}

function SectionPanel({
  id,
  number,
  title,
  description,
  children,
}: {
  id: Section;
  number: string;
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={`panel-${id}`} className="panel">
      <div className="panel-head">
        <div>
          <span className="section-number">
            {number} · {id.replace("-", " ")}
          </span>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function Principle({
  title,
  text,
  active,
  onClick,
}: {
  title: string;
  text: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <article className={`principle ${active ? "active" : ""}`} onClick={onClick}>
      <h3>{title}</h3>
      {active && <p style={{ marginTop: "6px", animation: "drawer-fade 0.25s ease" }}>{text}</p>}
    </article>
  );
}

function Flow({
  items,
  activeItem,
  onItemClick,
}: {
  items: string[];
  activeItem: string | null;
  onItemClick: (item: string) => void;
}) {
  return (
    <div className="flow-row">
      {items.map((x, i) => (
        <React.Fragment key={x}>
          <span
            className={`flow-box ${activeItem === x ? "active" : ""}`}
            onClick={() => onItemClick(x)}
          >
            {x}
          </span>
          {i < items.length - 1 && <b>→</b>}
        </React.Fragment>
      ))}
    </div>
  );
}

function ProjectCard({
  number,
  name,
  type,
  text,
  tags,
  diagram,
  onClick,
}: {
  number: string;
  name: string;
  type: string;
  text: string;
  tags: string[];
  diagram?: string[];
  onClick: () => void;
}) {
  return (
    <article className="project" onClick={onClick}>
      <div className="project-number">{number}</div>
      <div>
        <span className="project-type">{type}</span>
        <h3>{name}</h3>
        <p>{text}</p>
        <div className="chips">
          {tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        {diagram && (
          <div className="project-flow">
            {diagram.slice(0, 5).map((x, i) => (
              <React.Fragment key={x}>
                <span>{x}</span>
                {i < Math.min(diagram.length - 1, 4) && <b>→</b>}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="project-sim-hint">
          <Play size={11} /> Click to inspect architecture & run live simulation
        </div>
      </div>
      <ArrowUpRight className="arrow" />
    </article>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
