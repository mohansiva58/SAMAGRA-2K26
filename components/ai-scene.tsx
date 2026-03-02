'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

function RotatingBox() {
  return (
    <mesh rotation={[0.3, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#1a1a1a"
        emissive="#00ff88"
        emissiveIntensity={0.6}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} color="#00d4ff" />
      <directionalLight position={[10, 10, 10]} intensity={0.8} color="#00ff88" />
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#00ff88" />
    </>
  );
}

export function AIScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0a0a0a']} />
      <Lights />
      <RotatingBox />
      <Environment preset="night" />
      <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} />
    </Canvas>
  );
}
