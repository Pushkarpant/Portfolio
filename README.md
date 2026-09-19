<div align="center">

# 🔶 Pushkar Pant — Portfolio

**Premium Interactive Portfolio · Software Engineer**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r179-000000?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org)
[![GSAP](https://img.shields.io/badge/GSAP-3.13-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-713600?style=flat-square)](./LICENSE)
[![Deploy](https://img.shields.io/badge/Live-portfolio--pushkar-C05800?style=flat-square&logo=vercel&logoColor=white)](https://portfolio-pushkar-eef9.vercel.app)

🔗 **Live:** [portfolio-pushkar-eef9.vercel.app](https://portfolio-pushkar-eef9.vercel.app)

<br/>

*A handcrafted, interaction-rich portfolio built with React, Three.js, and GSAP — featuring a live 3D scene, pipeline simulators, tactile audio feedback, and fully responsive design across all devices.*

</div>

---

## ✨ Features

### 🎨 Design & Visual Identity
- **"Chocolate Truffle" Color Palette** — Warm ivory background (`#faf9e5`), deep espresso text (`#38240D`), terracotta rust accents (`#C05800`), and rich chocolate brown (`#713600`)
- **Custom Typography** — Inter, JetBrains Mono, and Space Grotesk via Google Fonts
- **Smooth Scroll** — Lenis-powered buttery smooth scrolling with GSAP ScrollTrigger reveal animations
- **Micro-Animations** — Staggered entrance animations on panels, project cards, and skill items

### 🌐 Interactive 3D Hero Scene
- **Real-time WebGL Orb** — Wireframe sphere with orbiting ring and particle system built with React Three Fiber + Drei
- **Mouse-Reactive Rotation** — Orb tilts toward cursor with smooth damping
- **Clickable Tech Labels** — Floating labels (Java 17/21, Python/FastAPI, Spring Boot, Docker, RAG/LLM) that pulse and trigger visual shockwaves
- **Live Diagnostics Banner** — Displays real-time FPS, render status, and frame timing

### 🔊 Tactile Audio Engine
- **Zero-Asset Sound System** — Procedurally generated haptic sounds via Web Audio API (no external audio files)
- **Sound Effects** — Click, beep, pulse, and success tones with oscillator-based synthesis
- **Toggle Control** — Header sound toggle with persistent `localStorage` preference

### 📋 Section Panels (6 Sections)
| # | Section | Highlights |
|---|---------|------------|
| 01 | **About Me** | Two-column grid with statement + interactive fact cards |
| 02 | **Experience** | TCS Capital Markets role card with clickable case study tabs and full detail modal |
| 03 | **Projects** | Featured project cards with pipeline flow diagrams and live simulator modals |
| 04 | **Skills** | Expandable skill cards with production code snippet drawers |
| 05 | **Engineering** | Principles accordion + interactive architecture flow diagram with click-to-test nodes |
| 06 | **Contact** | Contact links + form with submission feedback |

### 🚀 Project Inspector Modal (Live Pipeline Simulator)
- **Step-by-step Simulation** — Click "Run Simulation" to watch each pipeline stage execute with animated progress
- **Real-time Log Feed** — Terminal-style log output with timestamps, levels (AUTH, CACHE, EMBED, etc.), and messages
- **Architecture Tab** — Visual pipeline stepper with step details
- **Code Tab** — Syntax-highlighted production code snippets with copy-to-clipboard
- **Metrics Bar** — Performance metrics (latency, cache speed, rerank ratio)

### 📄 Interactive Resume Modal
- Full resume viewer rendered inside the app
- Structured sections: Summary, Experience, Projects, Skills, Education

### 🏢 TCS Experience Modal
- Detailed role breakdown with key achievements
- Production scenario case studies

### 📱 Fully Responsive Design
Tested and optimized across **5 breakpoints**:

| Breakpoint | Target Devices |
|------------|----------------|
| `≥ 1600px` | Ultra-wide monitors, 4K displays |
| `≤ 1200px` | Standard laptops, small desktops |
| `≤ 900px` | Tablets (iPad, Surface) |
| `≤ 600px` | Phones (iPhone, Pixel) |
| `≤ 400px` | Small phones (iPhone SE, Galaxy Fold) |

- Fluid `clamp()` typography that scales smoothly
- Collapsible hamburger navigation on mobile
- Horizontally scrollable tabs with hidden scrollbars
- Full-width CTA buttons on small screens
- Compact modal layouts for touch devices

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 (ESM, HMR) |
| **3D Graphics** | Three.js + React Three Fiber + Drei |
| **Animation** | GSAP + ScrollTrigger |
| **Smooth Scroll** | Lenis |
| **Icons** | Lucide React |
| **Audio** | Web Audio API (procedural, zero assets) |
| **Styling** | Vanilla CSS with CSS custom properties |
| **Fonts** | Google Fonts (Inter, JetBrains Mono, Space Grotesk) |

---

## 📁 Project Structure

```
Portfolio/
├── index.html                  # Entry HTML with meta tags & font preloads
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── public/                     # Static assets (resume PDF, favicons)
└── src/
    ├── main.tsx                # App component, all 6 section panels, navigation
    ├── styles.css              # Complete design system + 5-breakpoint responsive
    ├── audio.ts                # Web Audio API tactile sound engine
    └── components/
        ├── ThreeCanvas.tsx     # Interactive 3D orb scene with particles & labels
        ├── ProjectInspectorModal.tsx  # Pipeline simulator + code viewer modal
        ├── ResumeModal.tsx     # Interactive resume overlay
        └── TcsExperienceModal.tsx    # TCS role detail modal
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Development
```bash
# Install dependencies
npm install

# Start dev server (HMR enabled)
npm run dev
```

### Production Build
```bash
# Type-check + build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔗 Featured Projects

### VERITY — Enterprise RAG Platform
> Two-stage retrieval architecture with tenant isolation, Cohere reranking, and sub-second SSE streaming.

**Stack:** Python · FastAPI · React · Pinecone · Cohere · Gemini · Redis · Docker

### PRODKIT — FastAPI Production Hardening Library
> One-line production hardening: OWASP security headers, Redis rate limiting, Prometheus metrics, OpenTelemetry tracing, and Kubernetes health probes.

**Stack:** Python · FastAPI · OpenTelemetry · Prometheus · Redis · Docker · Kubernetes

---

## 🔧 Backend Integration

- **Contact Form** — Currently frontend-only preview. Connect to the planned Spring Boot REST API for actual email delivery.
- **Resume PDF** — Replace `public/Pushkar_Pant_Resume.pdf` with the final version.

---

<div align="center">

**Built by [Pushkar Pant](https://github.com/Pushkarpant)** · Software Engineer · Java & Python

</div>
