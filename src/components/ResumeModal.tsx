import React, { useState } from "react";
import { playHaptic } from "../audio";
import { Check, Copy, Download, ExternalLink, Printer, X } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    playHaptic("click");
    window.print();
  };

  const handleCopy = () => {
    playHaptic("beep");
    const resumeText = `PUSHKAR PANT
SOFTWARE ENGINEER | JAVA | SPRING BOOT | REST APIs | SYSTEM DESIGN | CLOUD | GENAI
Phone: +91 7905590951 | Email: pantpushkar4@gmail.com | GitHub: https://github.com/Pushkarpant

PROFESSIONAL SUMMARY
Software Engineer with hands-on experience in enterprise application engineering, Java backend development, REST APIs, SQL, system integration and production support. Strong foundation in Data Structures & Algorithms, object-oriented design and system design, with practical knowledge of Spring Boot, Docker, CI/CD, cloud-native deployment, distributed-system concepts and reliability engineering. Built production-oriented AI platforms and developer tooling in Python, applying scalable architecture, security, caching and observability practices.

PROFESSIONAL EXPERIENCE
Software Engineer | Tata Consultancy Services (TCS) | India (Capital Markets domain)
- Develop and maintain enterprise applications and REST APIs in the Capital Markets domain, contributing to system integration, business workflows and end-to-end technical delivery.
- Apply Java, Maven, object-oriented design and SQL to build, enhance and troubleshoot backend services and integration flows.
- Perform root-cause analysis, production debugging and database investigations to resolve application defects, integration failures and reliability issues.
- Support deployment, environment setup, build and release activities; monitor application health and investigate performance and operational bottlenecks.
- Collaborate with developers, business stakeholders and support teams; automate recurring processes and document technical solutions, incidents and releases.

PROJECTS
1. VERITY - Enterprise RAG Platform | React, TypeScript, FastAPI, PostgreSQL, Redis, Pinecone, Gemini Embeddings, Cohere Reranking, LLMs, JWT, SSE, Docker, GitHub Actions
- Designed a multi-user AI platform with tenant isolation and a two-stage retrieval architecture using vector search plus cross-encoder reranking before LLM generation.
- Implemented JWT security, Redis caching, rate limiting, streaming responses, Docker containerization and GitHub Actions CI/CD for repeatable deployment.

2. PRODKIT - FastAPI Production Engineering Library | Python, FastAPI, Redis, Prometheus, OpenTelemetry, Docker, Nginx, GitHub Actions
- Built and published a reusable production-hardening library focused on secure API delivery, reliability, observability and deployment automation for FastAPI services.
- Implemented request IDs, structured logging, OWASP security headers, RFC 9457 errors, Kubernetes health probes, rate limiting, Prometheus metrics and OpenTelemetry tracing.

TECHNICAL SKILLS
- Programming & CS: Java 17/21, Python, JavaScript, TypeScript, SQL, Data Structures & Algorithms, OOP, DBMS, Operating Systems, Networking Fundamentals
- Java & Backend: Spring Boot, REST APIs, Maven, API Design, Object-Oriented Design, FastAPI, Node.js, Express
- System Design: System Design, Solution Architecture, Microservices, Distributed Systems Concepts, Scalability, Performance, Reliability, Security, Integration
- Databases: MongoDB, Oracle, PostgreSQL, Redis
- Docker & Deployment: Docker, Docker Compose, containerization, Nginx, Kubernetes health probes, CI/CD, GitHub Actions, deployment automation, cloud-native development
- AI / GenAI: RAG, LLM Integration, LangChain, Pinecone, Gemini Embeddings, Cohere Reranking, SSE, Prometheus, OpenTelemetry, Monitoring, RCA

EDUCATION
- Master of Computer Applications (MCA) - Lovely Professional University (LPU) | 2026-2028 | Pursuing
- Bachelor of Computer Applications (BCA) - University of Lucknow (LU) | 2021-2024`;

    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} data-lenis-prevent="true">
      <div className="resume-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top bar with quick actions */}
        <div className="resume-modal-bar">
          <div className="resume-modal-title">
            <span>PUSHKAR PANT · OFFICIAL RÉSUMÉ</span>
          </div>
          <div className="resume-modal-actions">
            <button className="resume-action-btn" onClick={handleCopy} title="Copy Plain Text">
              {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button className="resume-action-btn" onClick={handlePrint} title="Print or Save as PDF">
              <Printer size={14} />
              Print / Save PDF
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close resume">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Paper format printable document */}
        <div className="resume-sheet">
          <header className="resume-header">
            <h1>PUSHKAR PANT</h1>
            <div className="resume-subtitle">
              SOFTWARE ENGINEER | JAVA | PYTHON | SPRING BOOT | REST APIs | SYSTEM DESIGN | CLOUD | GENAI
            </div>
            <div className="resume-contact-line">
              <span>📞 +91 7905590951</span>
              <span>·</span>
              <a href="mailto:pantpushkar4@gmail.com">✉️ pantpushkar4@gmail.com</a>
              <span>·</span>
              <a href="https://github.com/Pushkarpant" target="_blank" rel="noreferrer">
                🌐 github.com/Pushkarpant
              </a>
            </div>
          </header>

          <section className="resume-sec">
            <h3 className="resume-sec-title">PROFESSIONAL SUMMARY</h3>
            <p className="resume-text">
              Software Engineer with hands-on experience in enterprise application engineering, Java and Python
              backend development, REST APIs, SQL, system integration and production support. Strong foundation in
              Data Structures & Algorithms, object-oriented design and system design, with practical knowledge of
              Spring Boot, Docker, CI/CD, cloud-native deployment, distributed-system concepts and reliability
              engineering. Built production-oriented AI platforms and developer tooling in Python, applying scalable
              architecture, security, caching and observability practices.
            </p>
          </section>

          <section className="resume-sec">
            <h3 className="resume-sec-title">PROFESSIONAL EXPERIENCE</h3>
            <div className="resume-item">
              <div className="resume-item-head">
                <b>Software Engineer</b> · <span>Tata Consultancy Services (TCS) | India</span>
              </div>
              <div className="resume-item-sub">Capital Markets Domain</div>
              <ul className="resume-bullets">
                <li>
                  Develop and maintain enterprise applications and REST APIs in the Capital Markets domain,
                  contributing to system integration, business workflows and end-to-end technical delivery.
                </li>
                <li>
                  Apply Java, Maven, object-oriented design and SQL to build, enhance and troubleshoot backend
                  services and integration flows.
                </li>
                <li>
                  Perform root-cause analysis, production debugging and database investigations to resolve application
                  defects, integration failures and reliability issues.
                </li>
                <li>
                  Support deployment, environment setup, build and release activities; monitor application health and
                  investigate performance and operational bottlenecks.
                </li>
                <li>
                  Collaborate with developers, business stakeholders and support teams; automate recurring processes
                  and document technical solutions, incidents and releases.
                </li>
              </ul>
            </div>
          </section>

          <section className="resume-sec">
            <h3 className="resume-sec-title">PROJECTS</h3>
            <div className="resume-item">
              <div className="resume-item-head">
                <b>VERITY - Enterprise RAG Platform</b>
              </div>
              <div className="resume-item-tech">
                React, TypeScript, FastAPI, PostgreSQL, Redis, Pinecone, Gemini Embeddings, Cohere Reranking, LLMs,
                JWT, SSE, Docker, GitHub Actions
              </div>
              <ul className="resume-bullets">
                <li>
                  Designed a multi-user AI platform with tenant isolation and a two-stage retrieval architecture
                  using vector search plus cross-encoder reranking before LLM generation.
                </li>
                <li>
                  Implemented JWT security, Redis caching, rate limiting, streaming responses, Docker containerization
                  and GitHub Actions CI/CD for repeatable deployment.
                </li>
              </ul>
            </div>

            <div className="resume-item">
              <div className="resume-item-head">
                <b>PRODKIT - FastAPI Production Engineering Library</b>
              </div>
              <div className="resume-item-tech">
                Python, FastAPI, Redis, Prometheus, OpenTelemetry, Docker, Nginx, GitHub Actions
              </div>
              <ul className="resume-bullets">
                <li>
                  Built and published a reusable production-hardening library focused on secure API delivery,
                  reliability, observability and deployment automation for FastAPI services.
                </li>
                <li>
                  Implemented request IDs, structured logging, OWASP security headers, RFC 9457 errors, Kubernetes
                  health probes, rate limiting, Prometheus metrics and OpenTelemetry tracing.
                </li>
              </ul>
            </div>
          </section>

          <section className="resume-sec">
            <h3 className="resume-sec-title">TECHNICAL SKILLS</h3>
            <div className="resume-skills-list">
              <div>
                <b>Programming & CS:</b> Java 17/21, Python, JavaScript, TypeScript, SQL, Data Structures &
                Algorithms, OOP, DBMS, Operating Systems, Networking Fundamentals
              </div>
              <div>
                <b>Java, Python & Backend:</b> Spring Boot, REST APIs, Maven, API Design, Object-Oriented Design,
                FastAPI, Node.js, Express, AsyncIO
              </div>
              <div>
                <b>System Design:</b> Solution Architecture, Microservices, Distributed Systems Concepts, Scalability,
                Performance, Reliability, Security, Integration
              </div>
              <div>
                <b>Databases:</b> MongoDB, Oracle, PostgreSQL, Redis, PL/SQL
              </div>
              <div>
                <b>Docker & Deployment:</b> Docker, Docker Compose, containerization, Nginx, Kubernetes health probes,
                CI/CD, GitHub Actions, deployment automation, cloud-native development
              </div>
              <div>
                <b>AI / GenAI & Observability:</b> RAG, LLM Integration, LangChain, Pinecone, Gemini Embeddings, Cohere
                Reranking, SSE, Prometheus, OpenTelemetry, Monitoring, RCA
              </div>
            </div>
          </section>

          <section className="resume-sec">
            <h3 className="resume-sec-title">EDUCATION</h3>
            <div className="resume-edu-item">
              <div>
                <b>Master of Computer Applications (MCA)</b> — Lovely Professional University (LPU)
              </div>
              <span className="edu-dates">2026–2028 | Pursuing</span>
            </div>
            <div className="resume-edu-item">
              <div>
                <b>Bachelor of Computer Applications (BCA)</b> — University of Lucknow (LU)
              </div>
              <span className="edu-dates">2021–2024</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
