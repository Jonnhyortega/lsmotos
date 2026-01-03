"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Colors
const ACCENT_COLOR = new THREE.Color("#00CEFE");
const DARK_COLOR = new THREE.Color("#1a1a1a");
const METALLIC_COLOR = new THREE.Color("#2a2a2a");

function Particles({ count = 80 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const lightMesh = useRef<THREE.InstancedMesh>(null);

  // Generate random data for particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const t = Math.random() * 100;
        const factor = 10 + Math.random() * 20; // Reduced spread
        const speed = 0.05 + Math.random() / 50; // Increased speed (was 0.01)
        const xFactor = -20 + Math.random() * 40; // Closer to center (was -50 to 50)
        const yFactor = -20 + Math.random() * 40;
        const zFactor = -20 + Math.random() * 40;
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  // Dummy object for calculating matrices
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Entrance animation state
  const startTime = useMemo(() => Date.now(), []);

  useFrame((state) => {
    if (!mesh.current) return;

    // Calculate entrance progress (0 to 1 over 1.5 seconds)
    const now = Date.now();
    const elapsed = (now - startTime) / 1500; 
    const entranceScale = Math.min(1, 1 - Math.pow(1 - Math.min(1, elapsed), 3)); // Cubic ease-out

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      
      // Calculate position
      const x = Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos(t / 10) * 10 + (Math.sin(t * 1) * factor) / 10;
      const y = Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + (Math.cos(t / 2) * factor) / 10;
      const z = Math.cos(t) + Math.sin(t * 3) / 10 + zFactor + (Math.cos(t / 2) * factor) / 10;

      // Rotate and scale
      dummy.position.set(x, y, z);
      dummy.rotation.set(
        Math.cos(t),
        Math.sin(t),
        Math.cos(t) * Math.sin(t)
      );
      
      const baseScale = 1 + Math.cos(t) * 0.5;
      dummy.scale.setScalar(baseScale * entranceScale); // Apply entrance scale

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            {/* Hexagonal nuts/bolt heads */}
            <cylinderGeometry args={[0.35, 0.35, 0.15, 6]} />
            <meshStandardMaterial 
                color="#888" 
                emissive="#111"
                roughness={0.4} 
                metalness={0.6} 
            />
        </instancedMesh>
    </>
  );
}

function FloatingAccentParticles({ count = 20 }) {
   const mesh = useRef<THREE.InstancedMesh>(null);
   const dummy = useMemo(() => new THREE.Object3D(), []);
   
   const particles = useMemo(() => {
     const temp = [];
     for (let i = 0; i < count; i++) {
         const t = Math.random() * 100;
         const factor = 10 + Math.random() * 30; // Closer
         const speed = 0.03 + Math.random() / 50; // Faster
         const xFactor = -20 + Math.random() * 40;
         const yFactor = -20 + Math.random() * 40;
         const zFactor = -20 + Math.random() * 40;
         temp.push({ t, factor, speed, xFactor, yFactor, zFactor });
     }
     return temp;
   }, [count]);
 
   const startTime = useMemo(() => Date.now(), []);

   useFrame(() => {
     if (!mesh.current) return;

     const now = Date.now();
     const elapsed = (now - startTime) / 1500; 
     const entranceScale = Math.min(1, 1 - Math.pow(1 - Math.min(1, elapsed), 3));

     particles.forEach((particle, i) => {
       // Similar logic but maybe faster or different phase
       let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
       t = particle.t += speed; 
       
       const x = Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos(t / 10) * 10 + (Math.sin(t * 1) * factor) / 10;
       const y = Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + (Math.cos(t / 2) * factor) / 10;
       const z = Math.cos(t) + Math.sin(t * 3) / 10 + zFactor + (Math.cos(t / 2) * factor) / 10;
 
       dummy.position.set(x, y, z);
       dummy.rotation.set(t, t, t);
       dummy.scale.setScalar(0.7 * entranceScale); // Apply entrance scale
       dummy.updateMatrix();
       mesh.current!.setMatrixAt(i, dummy.matrix);
     });
     mesh.current.instanceMatrix.needsUpdate = true;
   });
 
   return (
     <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
       {/* Washers */}
       <torusGeometry args={[0.35, 0.08, 8, 24]} /> 
       {/* Accent color glowing washers */}
       <meshStandardMaterial 
          color={ACCENT_COLOR} 
          emissive={ACCENT_COLOR}
          emissiveIntensity={2}
          roughness={0.2}
          toneMapped={false}
       />
     </instancedMesh>
   );
 }

export function ThreeBackground() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        dpr={isMobile ? 1 : [1, 1.5]} // Strictly 1 on mobile, adaptive on desktop
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 10, 40]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00CEFE" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />
        <directionalLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />

        <Particles count={isMobile ? 30 : 80} />
        <FloatingAccentParticles count={isMobile ? 6 : 15} />
      </Canvas>
      
       {/* Overlay gradient to ensure text readability */}
       <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent opacity-80" />
       <div className="absolute inset-0 bg-linear-to-b from-[#050505] via-transparent to-transparent opacity-40" />
    </div>
  );
}
