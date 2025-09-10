import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import bumpTextureImage from 'figma:asset/909f56fe8d9ae4adc5edf331a0ec809810ac0469.png';

const ROTATION_DAMPING_FACTOR = 0.95;
const ROTATION_VELOCITY_MULTIPLIER = 0.01;
const ROTATION_VELOCITY_THRESHOLD = 0.0001;

const CentralBumpSphere = React.memo(function CentralBumpSphere({
  color,
  size
}: {
  color: string;
  size: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const bumpTexture = useTexture(bumpTextureImage);

  const { gl } = useThree();

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      setIsDragging(true);
      lastMousePosition.current = { x: event.clientX, y: event.clientY };
      gl.domElement.style.cursor = 'grabbing';
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      gl.domElement.style.cursor = 'grab';
    };

    const handlePointerMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - lastMousePosition.current.x;
      const deltaY = event.clientY - lastMousePosition.current.y;

      rotationVelocity.current.x = deltaY * ROTATION_VELOCITY_MULTIPLIER;
      rotationVelocity.current.y = deltaX * ROTATION_VELOCITY_MULTIPLIER;

      lastMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    const mesh = meshRef.current;
    if (mesh) {
      mesh.addEventListener('pointerdown', handlePointerDown as any);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      if (mesh) {
        mesh.removeEventListener('pointerdown', handlePointerDown as any);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl, isDragging]);

  useFrame(() => {
    if (!meshRef.current) return;
    // Restore the original animation logic as requested by the user,
    // but without using state to avoid re-renders.
    meshRef.current.rotation.x += rotationVelocity.current.x;
    meshRef.current.rotation.y += rotationVelocity.current.y;
    rotationVelocity.current.x *= ROTATION_DAMPING_FACTOR;
    rotationVelocity.current.y *= ROTATION_DAMPING_FACTOR;
  });

  return (
    <Sphere
      ref={meshRef}
      args={[size * 0.03, 128, 128]}
      position={[0, 0, 0]}
    >
      <meshPhysicalMaterial
        color={color}
        transparent={false}
        opacity={1.0}
        depthWrite={true}
        depthTest={true}
        side={THREE.DoubleSide}
        metalness={0.25}
        roughness={0.5}
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

interface SphereCanvasProps {
    color: string;
    size: number;
}

export function SphereCanvas({ color, size }: SphereCanvasProps) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 10,
                pointerEvents: 'none'
            }}
        >
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60 }}
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
                <CentralBumpSphere color={color} size={size} />
              </React.Suspense>
            </Canvas>
        </div>
    );
}
