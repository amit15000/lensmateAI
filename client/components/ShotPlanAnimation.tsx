"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

interface ShotPlanAnimationProps {
  shotPlan?: {
    path: Array<{ x: number; y: number; z: number }>
    lookAt?: { x: number; y: number; z: number }
  }
  isPlaying: boolean
  isFullscreen: boolean
}

function AnimatedCamera({ shotPlan, isPlaying }: { shotPlan: any; isPlaying: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const [progress, setProgress] = useState(0)

  useFrame((state, delta) => {
    if (!isPlaying || !shotPlan?.path || !cameraRef.current) return

    setProgress((prev) => {
      const newProgress = prev + delta * 0.1 // Adjust speed
      return newProgress > 1 ? 0 : newProgress
    })

    // Interpolate along path
    const pathLength = shotPlan.path.length
    const currentIndex = Math.floor(progress * (pathLength - 1))
    const nextIndex = Math.min(currentIndex + 1, pathLength - 1)
    const localProgress = (progress * (pathLength - 1)) % 1

    const current = shotPlan.path[currentIndex]
    const next = shotPlan.path[nextIndex]

    if (current && next) {
      const position = new THREE.Vector3(
        THREE.MathUtils.lerp(current.x, next.x, localProgress),
        THREE.MathUtils.lerp(current.y, next.y, localProgress),
        THREE.MathUtils.lerp(current.z, next.z, localProgress),
      )

      cameraRef.current.position.copy(position)

      if (shotPlan.lookAt) {
        cameraRef.current.lookAt(shotPlan.lookAt.x, shotPlan.lookAt.y, shotPlan.lookAt.z)
      }
    }
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault={isPlaying} position={[0, 5, 10]} fov={75} />
}

function Scene() {
  return (
    <>
      {/* Mountain-like geometry */}
      <mesh position={[0, -2, -5]}>
        <coneGeometry args={[3, 4, 8]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>

      <mesh position={[-4, -1, -3]}>
        <coneGeometry args={[2, 3, 6]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      <mesh position={[3, -1.5, -4]}>
        <coneGeometry args={[2.5, 3.5, 7]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>

      {/* Ground plane */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </>
  )
}

function PathVisualization({ shotPlan }: { shotPlan: any }) {
  if (!shotPlan?.path) return null

  const points = shotPlan.path.map((point: any) => new THREE.Vector3(point.x, point.y, point.z))

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#60a5fa" linewidth={2} />
    </line>
  )
}

export function ShotPlanAnimation({ shotPlan, isPlaying, isFullscreen }: ShotPlanAnimationProps) {
  const defaultShotPlan = {
    path: [
      { x: -5, y: 2, z: 8 },
      { x: -2, y: 3, z: 6 },
      { x: 0, y: 4, z: 4 },
      { x: 2, y: 3, z: 6 },
      { x: 5, y: 2, z: 8 },
    ],
    lookAt: { x: 0, y: 0, z: -5 },
  }

  const activeShotPlan = shotPlan || defaultShotPlan

  return (
    <div className="w-full h-full bg-gray-900">
      <Canvas>
        <Environment preset="sunset" />

        <AnimatedCamera shotPlan={activeShotPlan} isPlaying={isPlaying} />

        {!isPlaying && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}

        <Scene />
        <PathVisualization shotPlan={activeShotPlan} />
      </Canvas>

      {!isPlaying && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-400">Use mouse to orbit • Scroll to zoom</div>
      )}
    </div>
  )
}
