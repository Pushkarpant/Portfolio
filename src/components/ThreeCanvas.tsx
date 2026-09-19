import React, { Suspense, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, Text } from "@react-three/drei";
import { playHaptic } from "../audio";

interface InteractiveOrbProps {
  mode: string;
  speedMultiplier: number;
  pulseTrigger: number;
  onOrbClick: () => void;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

function InteractiveOrb({ mode, speedMultiplier, pulseTrigger, onOrbClick, mousePosition }: InteractiveOrbProps) {
  const group = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const shockwaveProgress = useRef(1);
  const currentSpeed = useRef(speedMultiplier);

  // Smooth mouse follow targets
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);

  React.useEffect(() => {
    if (pulseTrigger > 0) {
      shockwaveProgress.current = 0;
    }
  }, [pulseTrigger]);

  // Subtle data particles in Chocolate Truffle colors
  const particleCount = 65;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.35 + Math.random() * 0.85;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    // Smooth damp speed transitions
    currentSpeed.current = THREE.MathUtils.damp(currentSpeed.current, speedMultiplier, 4, delta);
    const t = state.clock.elapsedTime * currentSpeed.current;

    // Mouse-driven rotation (smooth follow)
    const mx = mousePosition.current.x;
    const my = mousePosition.current.y;
    targetRotX.current = THREE.MathUtils.damp(targetRotX.current, my * 0.3, 3, delta);
    targetRotY.current = THREE.MathUtils.damp(targetRotY.current, mx * 0.4, 3, delta);

    if (group.current) {
      group.current.rotation.y = t * 0.1 + targetRotY.current;
      group.current.rotation.x = Math.sin(t * 0.15) * 0.05 + targetRotX.current;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.1) * 0.04 + targetRotX.current * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.12 + targetRotY.current * 0.2;
    }
    if (shockwaveRef.current && shockwaveProgress.current < 1) {
      shockwaveProgress.current += delta * 1.8;
      const scale = 1 + shockwaveProgress.current * 3.6;
      shockwaveRef.current.scale.set(scale, scale, scale);
      const mat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, (1 - shockwaveProgress.current) * 0.55);
      }
    }
  });

  // Get display text based on mode
  let displayText = "JAVA 17 / 21";
  if (mode === "python") displayText = "PYTHON / FASTAPI";
  if (mode === "spring") displayText = "SPRING BOOT";
  if (mode === "rag") displayText = "RAG / LLM";
  if (mode === "cloud") displayText = "DOCKER + CI/CD";

  return (
    <group ref={group}>
      {/* Outer wireframe icosahedron (#713600) */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onOrbClick();
        }}
      >
        <icosahedronGeometry args={[1.35, 3]} />
        <meshStandardMaterial wireframe color="#713600" transparent opacity={0.24} />
      </mesh>

      {/* Inner glowing icosahedron (#C05800) */}
      <mesh
        scale={0.76}
        onClick={(e) => {
          e.stopPropagation();
          onOrbClick();
        }}
      >
        <icosahedronGeometry args={[1.35, 2]} />
        <meshStandardMaterial color="#C05800" transparent opacity={0.12} />
      </mesh>

      {/* Primary Coordinate Ring (#C05800) */}
      <mesh ref={ringRef} scale={1.45} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.009, 12, 100]} />
        <meshBasicMaterial color="#C05800" transparent opacity={0.7} />
      </mesh>

      {/* Secondary Coordinate Ring (#713600) */}
      <mesh ref={ring2Ref} scale={1.6} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.35, 0.007, 12, 80]} />
        <meshBasicMaterial color="#713600" transparent opacity={0.4} />
      </mesh>

      {/* Shockwave visual */}
      <mesh ref={shockwaveRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.1, 48]} />
        <meshBasicMaterial color="#C05800" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Data particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#C05800" transparent opacity={0.65} />
      </points>

      {/* Core mode label — only the main text, no subtitle */}
      <Text position={[0, 0, 1.28]} fontSize={0.16} color="#38240D" anchorX="center" anchorY="middle">
        {displayText}
      </Text>
    </group>
  );
}

export function HeroScene() {
  const [activeLabel, setActiveLabel] = useState("java");
  const [speedMultiplier, setSpeedMultiplier] = useState(1.8);
  const [pulseTrigger, setPulseTrigger] = useState(0);

  React.useEffect(() => {
    const labels = ["java", "python", "spring", "rag", "cloud"];
    const interval = setInterval(() => {
      setActiveLabel((current) => {
        const available = labels.filter((l) => l !== current);
        return available[Math.floor(Math.random() * available.length)];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking ref for smooth follow
  const mousePosition = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    // Normalize to -1 to 1
    mousePosition.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mousePosition.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Smoothly return to center
    mousePosition.current.x = 0;
    mousePosition.current.y = 0;
  }, []);

  const handleOrbClick = () => {
    playHaptic("pulse");
    setPulseTrigger((v) => v + 1);
    setSpeedMultiplier((v) => (v === 1.8 ? 3.5 : 1.8));
  };

  const handleLabelClick = (labelKey: string, text: string, status: string) => {
    playHaptic("beep");
    setActiveLabel(labelKey);
    setPulseTrigger((v) => v + 1);
  };

  return (
    <div
      className="scene"
      ref={sceneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      <Canvas camera={{ position: [0, 0, 5], fov: 38 }} dpr={[1, 1.8]}>
        <ambientLight intensity={1.8} />
        <directionalLight position={[3, 4, 4]} intensity={2} />
        <Suspense fallback={null}>
          <Float speed={1.0} rotationIntensity={1.0} floatIntensity={1.0}>
            <InteractiveOrb
              mode={activeLabel}
              speedMultiplier={speedMultiplier}
              pulseTrigger={pulseTrigger}
              onOrbClick={handleOrbClick}
              mousePosition={mousePosition}
            />
          </Float>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} dampingFactor={0.05} />
      </Canvas>

      {/* Interactive Labels */}
      <div
        className={`scene-label label-a ${activeLabel === "java" ? "active" : ""}`}
        onClick={() => handleLabelClick("java", "JAVA 17/21", "VIRTUAL THREADS · CONCURRENCY")}
      >
        JAVA 17 / 21
      </div>

      <div
        className={`scene-label label-b ${activeLabel === "python" ? "active" : ""}`}
        onClick={() => handleLabelClick("python", "PYTHON / FASTAPI", "ASYNCIO · PRODKIT")}
      >
        PYTHON / FASTAPI
      </div>

      <div
        className={`scene-label label-c ${activeLabel === "spring" ? "active" : ""}`}
        onClick={() => handleLabelClick("spring", "SPRING BOOT", "MICROSERVICES · ENTERPRISE")}
      >
        SPRING BOOT
      </div>

      <div
        className={`scene-label label-d ${activeLabel === "rag" ? "active" : ""}`}
        onClick={() => handleLabelClick("rag", "RAG / LLM", "PINECONE · COHERE RERANK")}
      >
        RAG / LLM
      </div>

      <div
        className={`scene-label label-e ${activeLabel === "cloud" ? "active" : ""}`}
        onClick={() => handleLabelClick("cloud", "DOCKER + CI/CD", "K8S PROBES · REPEATABLE BUILDS")}
      >
        DOCKER + CI/CD
      </div>
    </div>
  );
}
