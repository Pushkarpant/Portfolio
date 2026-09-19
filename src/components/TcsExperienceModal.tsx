import React from "react";
import { playHaptic } from "../audio";
import { X, Activity, CheckCircle2 } from "lucide-react";

interface TcsExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TcsExperienceModal({ isOpen, onClose }: TcsExperienceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} data-lenis-prevent="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">TCS · CAPITAL MARKETS</span>
            <h2>Product Engineer</h2>
            <p className="modal-tagline">Tata Consultancy Services (TCS) · New Delhi, India</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-metrics-bar">
          <div className="modal-metric-card">
            <span className="m-label">Domain</span>
            <span className="m-val">Capital Markets</span>
          </div>
          <div className="modal-metric-card">
            <span className="m-label">Role</span>
            <span className="m-val">Product Engineer</span>
          </div>
          <div className="modal-metric-card">
            <span className="m-label">Stack</span>
            <span className="m-val">Java, Python, REST APIs</span>
          </div>
        </div>

        <div className="modal-content" style={{ padding: "30px 40px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#713600", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={16} /> 
            Key Responsibilities & Achievements
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Working in the Capital Markets domain, supporting and enhancing enterprise financial applications and services.",
              "Managing end-to-end product engineering activities, including application support, system integration, and technical solution delivery.",
              "Designing, developing, and maintaining REST-based APIs and services for seamless integration across platforms.",
              "Performing root cause analysis, troubleshooting, and resolution of production incidents to ensure system stability and business continuity.",
              "Collaborating with business stakeholders, development teams, and support groups to gather requirements and implement solutions.",
              "Executing complex SQL queries and database investigations to analyze issues, validate data, and improve application performance.",
              "Supporting application deployments, environment setup, build management, and release activities using enterprise development tools.",
              "Monitoring application health, identifying performance bottlenecks, and implementing corrective actions to improve reliability.",
              "Preparing technical documentation, status reports, and management presentations for project tracking and governance.",
              "Driving continuous improvement initiatives by automating manual processes and enhancing operational efficiency."
            ].map((achievement, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px", fontSize: "13px", lineHeight: 1.6, color: "rgba(56, 36, 13, 0.85)" }}>
                <CheckCircle2 size={16} color="#C05800" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
