import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import * as THREE from 'three';

import cosmicBackground from 'figma:asset/ee1d60b6da6ffbe59028c887ab600f760e18e0fd.png';
import centralHUD from 'figma:asset/c6d76206b55efd4e478665a24d810b12f592c316.png';
import urbanFabricIcon from 'figma:asset/da675ef43a920905acce551f8e42797f4ca0dd62.png';
import futureCitiesIcon from 'figma:asset/ef5503dd4088387aaa2896030c8428aaadf85a66.png';
import buildingLifecycleIcon from 'figma:asset/c80b4788f34c09f4111ad6d7302dc08ac0a6fd28.png';
import infrastructureIcon from 'figma:asset/9a7512aa78450bb20185392d88b764bd99bd1a7f.png';
import twinLabLogo from 'figma:asset/ce140d08c83da0d1ba52cf9a1573bf2859276974.png';
import bumpTextureImage from 'figma:asset/909f56fe8d9ae4adc5edf331a0ec809810ac0469.png';

const sphereColorPalette = [
  { name: 'Dark Gray', value: '#404040' },
  { name: 'Deep Blue', value: '#0066CC' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Amber', value: '#F59E0B' },
];

const CentralBumpSphere = React.memo(function CentralBumpSphere({ 
  color, 
  size 
}: { 
  color: string; 
  size: number; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });
  
  // Create advanced bump texture for maximum visibility
  const bumpTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create multiple noise layers for complex bump pattern
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        // Combine multiple frequencies for rich detail
        const noise1 = Math.sin(x * 0.05) * Math.cos(y * 0.05);
        const noise2 = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5;
        const noise3 = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 0.25;
        
        // Combine and normalize to 0-1 range
        const combinedNoise = (noise1 + noise2 + noise3) * 0.5 + 0.5;
        const gray = Math.floor(Math.max(0, Math.min(1, combinedNoise)) * 255);
        
        ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.generateMipmaps = true;
    texture.flipY = false;
    return texture;
  }, []);

  // Mouse interaction handlers
  const { gl, camera } = useThree();
  
  const handlePointerDown = (event: any) => {
    setIsDragging(true);
    lastMousePosition.current = { x: event.clientX, y: event.clientY };
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
  };

  const handlePointerMove = (event: any) => {
    if (!isDragging) return;
    
    const deltaX = event.clientX - lastMousePosition.current.x;
    const deltaY = event.clientY - lastMousePosition.current.y;
    
    rotationVelocity.current.x = deltaY * 0.01;
    rotationVelocity.current.y = deltaX * 0.01;
    
    lastMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  // Add global event listeners
  useEffect(() => {
    const handleGlobalPointerMove = (event: PointerEvent) => handlePointerMove(event);
    const handleGlobalPointerUp = () => handlePointerUp();
    
    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isDragging]);

  // Animation frame loop for smooth rotation
  useFrame(() => {
    if (meshRef.current) {
      if (isDragging) {
        setRotation(prev => ({
          x: prev.x + rotationVelocity.current.x,
          y: prev.y + rotationVelocity.current.y
        }));
      } else {
        // Gradual slowdown when not dragging
        rotationVelocity.current.x *= 0.95;
        rotationVelocity.current.y *= 0.95;
        
        setRotation(prev => ({
          x: prev.x + rotationVelocity.current.x,
          y: prev.y + rotationVelocity.current.y
        }));
      }
      
      meshRef.current.rotation.x = rotation.x;
      meshRef.current.rotation.y = rotation.y;
    }
  });

  return (
    <Sphere 
      ref={meshRef} 
      args={[size * 0.03, 128, 128]} 
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => { gl.domElement.style.cursor = 'grab'; }}
      onPointerLeave={() => { gl.domElement.style.cursor = 'default'; }}
    >
      <meshPhysicalMaterial 
        color={color}
        transparent={false}
        opacity={1.0}
        depthWrite={false}
        depthTest={true}
        side={THREE.DoubleSide}
        metalness={0.85}
        roughness={0.1}
        emissive={new THREE.Color(0x000000)}
        emissiveIntensity={0.0}
        bumpMap={bumpTexture}
        bumpScale={1.0}
        polygonOffset={true}
        polygonOffsetFactor={-4}
        polygonOffsetUnits={-4}
      />
    </Sphere>
  );
});

function MaterialTestLighting() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[10, 6, 8]}
        intensity={4}
        castShadow
      />
      <directionalLight
        position={[-5, -3, 6]}
        intensity={2}
        color="#FFFFFF"
      />
    </>
  );
}

interface CosmicLandingPageProps {
  onLoginClick: () => void;
  onEnterUniverse: () => void;
}

const contentTypes = [
  { name: 'Audio Podcast', icon: '🎧', color: '#FF6B6B' },
  { name: 'Video Presentation', icon: '🎥', color: '#4ECDC4' },
  { name: 'TWiki Read', icon: '📚', color: '#45B7D1' },
  { name: 'Study Guide', icon: '📝', color: '#96CEB4' }
];

export function CosmicLandingPage({ onLoginClick }: CosmicLandingPageProps) {
  const [debugOffset, setDebugOffset] = useState({ x: -4, y: -28 });
  const [showDebugPanel, setShowDebugPanel] = useState(true);
  const [sphereSize, setSphereSize] = useState(46);
  const [selectedCube, setSelectedCube] = useState<{ chapterId: string; episodeId: string } | null>(null);
  const [cubeRotation, setCubeRotation] = useState(0);
  const [sphereColor, setSphereColor] = useState('#8B5CF6');
  const [knowledgeDomains, setKnowledgeDomains] = useState<any[]>([]);

  const rotationRef = useRef(0);
  //const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Inline knowledge domains data - no external fetch needed
    const knowledgeDomainsData = [
      {
        "id": "chapter-1",
        "title": "CHAPTER 1",
        "subtitle": "The Mechanics of Transformation",
        "image": "figma:asset/da675ef43a920905acce551f8e42797f4ca0dd62.png",
        "angle": 315,
        "backgroundColor": "linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #9333EA 100%)",
        "episodes": [
          {
            "id": "ep1-1",
            "title": "What is an Organizational Transformation?",
            "description": "Defines transformation as a fundamental re-engineering of an organization's core logic to meet a new strategic ambition that exceeds its current capacity."
          },
          {
            "id": "ep1-2",
            "title": "What is a Sector Transformation?",
            "description": "Elevates the transformation challenge from a single entity to an entire ecosystem. It redesigns how value flows across multiple, interdependent organizations."
          },
          {
            "id": "ep1-3",
            "title": "What is the People Transformation?",
            "description": "Addresses the human and political resistance inherent in public sector reform. Acknowledging that a perfect plan can be derailed by cultural inertia."
          },
          {
            "id": "ep1-4",
            "title": "The Entangled Transformation Battleground",
            "description": "Introduces \"entangled\" transformations where multiple entities must change simultaneously. Presents the Complexity Index (CI) as a risk assessment tool."
          }
        ]
      },
      {
        "id": "chapter-2",
        "title": "CHAPTER 2",
        "subtitle": "The Architectural Blueprint in Practice",
        "image": "figma:asset/ef5503dd4088387aaa2896030c8428aaadf85a66.png",
        "angle": 45,
        "backgroundColor": "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #7C2D12 100%)",
        "episodes": [
          {
            "id": "ep2-1",
            "title": "Strategic Performance (KPIs)",
            "description": "Explains how to create a \"golden thread\" from a high-level national objective (L0) down to a frontline process metric (L3)."
          },
          {
            "id": "ep2-2",
            "title": "Portfolios & Initiatives",
            "description": "Defines the portfolio as the control system that translates strategy into funded work with direct links to strategic KPIs."
          },
          {
            "id": "ep2-3",
            "title": "Process Architecture",
            "description": "Establishes that strategy is executed through processes. Defining L3 executable processes and linking them to owners and metrics."
          },
          {
            "id": "ep2-4",
            "title": "Organizational Design",
            "description": "Frames organizational structure as the backbone of accountability. A dynamic structure where every role maps to specific L3 processes and KPIs."
          }
        ]
      },
      {
        "id": "chapter-3",
        "title": "CHAPTER 3",
        "subtitle": "The Management Operating System",
        "image": "figma:asset/c80b4788f34c09f4111ad6d7302dc08ac0a6fd28.png",
        "angle": 135,
        "backgroundColor": "linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #5B21B6 100%)",
        "episodes": [
          {
            "id": "ep3-1",
            "title": "The Integrated Governance",
            "description": "Defines governance as the decision-making \"operating system\" that integrates strategy, execution (PMO), and operations through structured reviews."
          },
          {
            "id": "ep3-2",
            "title": "The Delivery Engine",
            "description": "Outlines the dual disciplines of Value Assurance (Program Management) and Delivery Assurance (Project Management) that execute governance decisions."
          },
          {
            "id": "ep3-3",
            "title": "Change Architecture",
            "description": "Presents Change Architecture as the discipline for mitigating adoption risk by integrating human readiness activities with technical deliverables."
          },
          {
            "id": "ep3-4",
            "title": "The Enablers",
            "description": "Describes foundational capabilities required for sustainable transformation: Digital Support, Corporate Knowledge Management, and talent culture."
          }
        ]
      },
      {
        "id": "chapter-4",
        "title": "CHAPTER 4",
        "subtitle": "An Open-Source Toolkit for Your First 90 Days",
        "image": "figma:asset/9a7512aa78450bb20185392d88b764bd99bd1a7f.png",
        "angle": 225,
        "backgroundColor": "linear-gradient(135deg, #5B21B6 0%, #6D28D9 50%, #4C1D95 100%)",
        "episodes": [
          {
            "id": "ep4-1",
            "title": "Day 1-15: Diagnose Your Starting Point",
            "description": "Using the Public Sector Complexity Index (CI) to assess your transformation readiness and identify key risk factors."
          },
          {
            "id": "ep4-2",
            "title": "Day 16-60: Architect Your First Golden Thread",
            "description": "Using the open source DTO Entity-Relationship Diagram (ERD) to create your strategic alignment framework."
          },
          {
            "id": "ep4-3",
            "title": "Day 61-90: Launch Your First GenAI-powered Use Case",
            "description": "Implementing your first AI-powered transformation use case to demonstrate value and build momentum for broader adoption."
          },
          {
            "id": "ep4-4",
            "title": "Beyond 90 Days: Scale and Sustain",
            "description": "Strategies for scaling successful transformation initiatives and building sustainable change management capabilities across the organization."
          }
        ]
      }
    ];
    
    setKnowledgeDomains(knowledgeDomainsData);
  }, []);

  const handleCubeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startRotation = rotationRef.current;

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const newRotation = startRotation + deltaX * 0.5;
        rotationRef.current = newRotation;
        setCubeRotation(newRotation); // Update immediately during drag
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        // No need to cancel animationFrame since we're not using continuous animation
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const domainElements = useMemo(() => knowledgeDomains.map((domain, index) => {
    const circleWidth = 192;
    const spacing = circleWidth * 0.4;
    const radius = 280 + spacing;
    const angleRad = (domain.angle * Math.PI) / 180;
    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius * 0.7;
    
    return (
      <motion.div
        key={domain.id}
        className="absolute group z-20"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${x + debugOffset.x}px), calc(-50% + ${y + debugOffset.y}px))`
        }}
      >
        <motion.div
          className="w-48 h-48 relative shadow-2xl rounded-full border-8 border-white"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: '8px',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            background: domain.backgroundColor
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, ease: "easeInOut", delay: index * 0.7 }}
        >
          <ImageWithFallback 
            src={domain.image} 
            alt={domain.title}
            className="w-full h-full object-contain rounded-full opacity-80"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/20 rounded-full">
            <h3 className="text-lg font-inter font-bold text-white mb-1 leading-tight">
              {domain.title}
            </h3>
            <p className="text-sm font-inter text-white/90 leading-tight whitespace-pre-line">
              {domain.subtitle}
            </p>
          </div>
        </motion.div>

        {domain.episodes?.map((episode: any, episodeIndex: number) => {
          const cubeRadius = 120;
          const angles = [315, 45, 135, 225];
          const cubeAngle = angles[episodeIndex];
          const cubeAngleRad = (cubeAngle * Math.PI) / 180;
          const cubeX = Math.cos(cubeAngleRad) * cubeRadius;
          const cubeY = Math.sin(cubeAngleRad) * cubeRadius;
          
          return (
            <motion.div
              key={episode.id}
              className="absolute cursor-pointer z-30"
              style={{
                left: `calc(50% + ${cubeX}px)`,
                top: `calc(50% + ${cubeY}px)`,
                transform: 'translate(-50%, -50%)',
                perspective: '200px',
                width: '32px',
                height: '32px'
              }}
              whileHover={{ scale: 1.2 }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedCube({ chapterId: domain.id, episodeId: episode.id });
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: episodeIndex * 0.5 } }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white border border-white/20"
                style={{
                  background: 'linear-gradient(45deg, #7C3AED 0%, #8B5CF6 50%, #A855F7 100%)',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)'
                }}
              >
                {episodeIndex + 1}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }), [knowledgeDomains, debugOffset]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img 
          src={cosmicBackground}
          alt="Cosmic Background"
          className="w-full h-full object-cover object-center"
          style={{ 
            imageRendering: 'crisp-edges',
            transform: 'scale(1.1)',
            transformOrigin: 'center center'
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-20 min-h-screen flex flex-col">
        <header className="pt-8 pb-8">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={twinLabLogo} 
                    alt="TwinLab Logo" 
                    className="w-12 h-12 object-contain filter brightness-110"
                  />
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg animate-pulse" />
                </div>
                <h1 className="text-4xl font-allerta text-white tracking-wider">
                  TwinLab - The Future, Ready Today
                </h1>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={onLoginClick}
                className="px-8 py-3 border-2 border-white/30 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-inter"
              >
                LOGIN / REGISTER
              </button>
              <button
                onClick={onLoginClick}
                className="px-8 py-3 border-2 border-white/30 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-inter"
              >
                CONTRIBUTE KNOWLEDGE
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center py-16">
          <div className="relative w-full max-w-4xl mx-auto px-8">
            <div className="flex items-center justify-center relative">
              <motion.div
                className="relative z-20"
                animate={{ rotate: [0, 360] }}
                transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
              >
                <div 
                  className="relative"
                  style={{
                    transform: `translate(${debugOffset.x}px, ${debugOffset.y}px)`
                  }}
                >
                  <ImageWithFallback 
                    src={centralHUD}
                    alt="Central HUD Interface"
                    className="object-contain border-none outline-none w-auto h-auto"
                    style={{
                      imageRendering: 'crisp-edges',
                      transform: 'scale(1.5)',
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              </motion.div>

              <div 
                className="absolute flex items-center justify-center z-50"
                style={{
                  top: `calc(50% + ${debugOffset.y}px)`,
                  left: `calc(50% + ${debugOffset.x}px)`,
                  transform: 'translate(-50%, -50%)',
                  width: `${sphereSize * 4}px`,
                  height: `${sphereSize * 4}px`,
                  pointerEvents: 'auto'
                }}
              >
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 60 }}
                  className="w-full h-full"
                  gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: false,
                    logarithmicDepthBuffer: false
                  }}
                  dpr={1}
                  frameloop="always"
                  style={{ pointerEvents: 'auto' }}
                >
                  <MaterialTestLighting />
                  <React.Suspense fallback={null}>
                    <CentralBumpSphere color={sphereColor} size={sphereSize} />
                  </React.Suspense>
                </Canvas>
              </div>

              {domainElements}
            </div>
          </div>
        </div>

        <div className="pb-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center">
              <h2 className="text-2xl font-inter text-white/90 mb-2">EXPLORE THE UNIVERSE OF DIGITAL TWIN KNOWLEDGE</h2>
              <p className="text-lg text-white/70 font-inter">Navigate. Learn. Contribute.</p>
            </div>
          </div>
        </div>

        <div className="pb-16"></div>
      </div>

      {selectedCube && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedCube(null)}
          />
          
          <motion.div
            className="relative w-96 h-96"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ perspective: '1000px' }}
          >
            <div 
              className="w-full h-full relative cursor-grab active:cursor-grabbing"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${cubeRotation}deg)`
              }}
              onMouseDown={handleCubeMouseDown}
            >
              <div
                className="absolute w-full h-full flex flex-col items-center justify-center cursor-pointer border-4 border-white/50 rounded-lg"
                style={{
                  backgroundColor: contentTypes[0].color,
                  transform: 'translateZ(192px)',
                  backfaceVisibility: 'hidden'
                }}
                onClick={() => {
                  const selectedEpisode = knowledgeDomains
                    .find(d => d.id === selectedCube.chapterId)?.episodes
                    ?.find(ep => ep.id === selectedCube.episodeId);
                  if (selectedEpisode) {
                    alert(`Opening ${contentTypes[0].name} for:\n"${selectedEpisode.title}"\n\n${selectedEpisode.description}\n\n(This would open the actual content in a full implementation)`);
                  }
                }}
              >
                <div className="text-6xl mb-4">{contentTypes[0].icon}</div>
                <h3 className="text-xl font-bold text-white text-center px-4">
                  {contentTypes[0].name}
                </h3>
              </div>

              <div
                className="absolute w-full h-full flex flex-col items-center justify-center cursor-pointer border-4 border-white/50 rounded-lg"
                style={{
                  backgroundColor: contentTypes[1].color,
                  transform: 'rotateY(90deg) translateZ(192px)',
                  backfaceVisibility: 'hidden'
                }}
                onClick={() => {
                  const selectedEpisode = knowledgeDomains
                    .find(d => d.id === selectedCube.chapterId)?.episodes
                    ?.find(ep => ep.id === selectedCube.episodeId);
                  if (selectedEpisode) {
                    alert(`Opening ${contentTypes[1].name} for:\n"${selectedEpisode.title}"\n\n${selectedEpisode.description}\n\n(This would open the actual content in a full implementation)`);
                  }
                }}
              >
                <div className="text-6xl mb-4">{contentTypes[1].icon}</div>
                <h3 className="text-xl font-bold text-white text-center px-4">
                  {contentTypes[1].name}
                </h3>
              </div>

              <div
                className="absolute w-full h-full flex flex-col items-center justify-center cursor-pointer border-4 border-white/50 rounded-lg"
                style={{
                  backgroundColor: contentTypes[2].color,
                  transform: 'rotateY(180deg) translateZ(192px)',
                  backfaceVisibility: 'hidden'
                }}
                onClick={() => {
                  const selectedEpisode = knowledgeDomains
                    .find(d => d.id === selectedCube.chapterId)?.episodes
                    ?.find(ep => ep.id === selectedCube.episodeId);
                  if (selectedEpisode) {
                    alert(`Opening ${contentTypes[2].name} for:\n"${selectedEpisode.title}"\n\n${selectedEpisode.description}\n\n(This would open the actual content in a full implementation)`);
                  }
                }}
              >
                <div className="text-6xl mb-4">{contentTypes[2].icon}</div>
                <h3 className="text-xl font-bold text-white text-center px-4">
                  {contentTypes[2].name}
                </h3>
              </div>

              <div
                className="absolute w-full h-full flex flex-col items-center justify-center cursor-pointer border-4 border-white/50 rounded-lg"
                style={{
                  backgroundColor: contentTypes[3].color,
                  transform: 'rotateY(270deg) translateZ(192px)',
                  backfaceVisibility: 'hidden'
                }}
                onClick={() => {
                  const selectedEpisode = knowledgeDomains
                    .find(d => d.id === selectedCube.chapterId)?.episodes
                    ?.find(ep => ep.id === selectedCube.episodeId);
                  if (selectedEpisode) {
                    alert(`Opening ${contentTypes[3].name} for:\n"${selectedEpisode.title}"\n\n${selectedEpisode.description}\n\n(This would open the actual content in a full implementation)`);
                  }
                }}
              >
                <div className="text-6xl mb-4">{contentTypes[3].icon}</div>
                <h3 className="text-xl font-bold text-white text-center px-4">
                  {contentTypes[3].name}
                </h3>
              </div>
            </div>
          </motion.div>
          
          <button
            className="absolute top-8 right-8 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            onClick={() => setSelectedCube(null)}
          >
            ✕
          </button>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white">
            <p className="text-lg mb-2">Drag to rotate the cube horizontally</p>
            <p className="text-sm opacity-70">Click on a face to access the content</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-bold text-white font-inter mb-3">Sphere Color</h3>
          
          <div>
            <Select value={sphereColor} onValueChange={setSphereColor}>
              <SelectTrigger className="w-48 bg-black/40 border-white/20 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                {sphereColorPalette.map((color) => (
                  <SelectItem key={color.value} value={color.value} className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded border border-white/30"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-xs">{color.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {showDebugPanel && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white font-inter">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">HUD Debug Controls</h3>
            <button 
              onClick={() => setShowDebugPanel(false)}
              className="text-white/60 hover:text-white text-xs px-2 py-1 border border-white/20 rounded"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6">X:</span>
              <button 
                onClick={() => setDebugOffset(prev => ({ ...prev, x: prev.x - 1 }))}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
              >
                -
              </button>
              <span className="w-8 text-center font-mono">{debugOffset.x}</span>
              <button 
                onClick={() => setDebugOffset(prev => ({ ...prev, x: prev.x + 1 }))}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6">Y:</span>
              <button 
                onClick={() => setDebugOffset(prev => ({ ...prev, y: prev.y - 1 }))}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
              >
                -
              </button>
              <span className="w-8 text-center font-mono">{debugOffset.y}</span>
              <button 
                onClick={() => setDebugOffset(prev => ({ ...prev, y: prev.y + 1 }))}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6">Size:</span>
              <button 
                onClick={() => setSphereSize(prev => Math.max(10, prev - 2))}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
              >
                -
              </button>
              <span className="w-8 text-center font-mono">{sphereSize}</span>
              <button 
                onClick={() => setSphereSize(prev => Math.min(60, prev + 2))}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
              >
                +
              </button>
            </div>
            <div className="text-xs text-white/60 mt-2 border-t border-white/20 pt-2">
              <div>Offset: translate({debugOffset.x}px, {debugOffset.y}px)</div>
              <div>Sphere: {sphereSize}tw = {sphereSize * 4}px</div>
            </div>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => setDebugOffset({ x: -4, y: -28 })}
                className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
              >
                Reset Offset
              </button>
              <button 
                onClick={() => setSphereSize(46)}
                className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
              >
                Reset Size
              </button>
            </div>
          </div>
        </div>
      )}

      {!showDebugPanel && (
        <button 
          onClick={() => setShowDebugPanel(true)}
          className="fixed top-4 right-4 z-50 px-3 py-2 bg-black/60 border border-white/20 rounded text-white text-xs font-inter hover:bg-black/80"
        >
          HUD Debug
        </button>
      )}
    </div>
  );
}