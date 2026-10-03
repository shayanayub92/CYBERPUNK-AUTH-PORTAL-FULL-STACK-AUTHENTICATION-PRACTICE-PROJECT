import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Line } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useMediaQuery } from '../../hooks/useMediaQuery'

function CoreSphere() {
  const meshRef = useRef()
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.15
  })
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color="#00f0ff"
        wireframe
        emissive="#00f0ff"
        emissiveIntensity={0.4}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function InnerGlow() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.x += delta * 0.08
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.25} />
    </mesh>
  )
}

function OrbitNodes({ count }) {
  const group = useRef()
  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const r = 2 + (i % 3) * 0.3
      return {
        angle,
        r,
        speed: 0.2 + (i % 5) * 0.04,
        y: Math.sin(i) * 0.5,
      }
    })
  }, [count])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const n = nodes[i]
      const a = n.angle + t * n.speed
      child.position.set(Math.cos(a) * n.r, n.y + Math.sin(t + i) * 0.15, Math.sin(a) * n.r)
    })
  })

  return (
    <group ref={group}>
      {nodes.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  )
}

function NetworkLines({ count }) {
  const lines = useMemo(() => {
    const pts = []
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      const r = 1.8
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(i * 2) * 0.3, Math.sin(a) * r))
    }
    pts.push(pts[0].clone())
    return pts
  }, [count])

  return <Line points={lines} color="#00f0ff" lineWidth={1} transparent opacity={0.35} />
}

function Scene({ particleCount }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#00f0ff" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#a855f7" />
      <CoreSphere />
      <InnerGlow />
      <OrbitNodes count={particleCount} />
      <NetworkLines count={12} />
      <Stars radius={80} depth={40} count={800} factor={2} saturation={0} fade speed={0.5} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
    </>
  )
}

export default function SecuritySphere({ className = '', compact = false }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const particleCount = isMobile ? 8 : compact ? 12 : 18

  return (
    <div className={`relative h-full min-h-[240px] w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, compact ? 5.5 : 4.5], fov: 50 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene particleCount={particleCount} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyber-bg/80 via-transparent to-transparent" />
    </div>
  )
}
