import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import electronConfigurations from '../data/electronConfigurations'

function Electron({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshStandardMaterial
        color="#8b9cff"
        emissive="#5364ff"
        emissiveIntensity={2}
        metalness={0.2}
        roughness={0.25}
      />
    </mesh>
  )
}

function ElectronShell({ radius, electrons, rotation, speed }) {
  const shellRef = useRef()

  useFrame((_, delta) => {
    if (shellRef.current) {
      shellRef.current.rotation.z += delta * speed
    }
  })

  const electronPositions = useMemo(() => {
    return Array.from({ length: electrons }, (_, index) => {
      const angle = (index / electrons) * Math.PI * 2

      return [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0,
      ]
    })
  }, [electrons, radius])

  return (
    <group ref={shellRef} rotation={rotation}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 8, 96]} />

        <meshBasicMaterial
          color="#6877ff"
          transparent
          opacity={0.28}
        />
      </mesh>

      {electronPositions.map((position, index) => (
        <Electron
          key={`${radius}-${index}`}
          position={position}
        />
      ))}
    </group>
  )
}

function Nucleus() {
  const nucleusRef = useRef()

  useFrame((state) => {
    if (nucleusRef.current) {
      const scale =
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.035

      nucleusRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={nucleusRef}>
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />

        <meshStandardMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.8}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0.35, 0.15, 0.35]}>
        <sphereGeometry args={[0.13, 12, 12]} />

        <meshStandardMaterial
          color="#f8fafc"
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[-0.3, -0.2, 0.35]}>
        <sphereGeometry args={[0.13, 12, 12]} />

        <meshStandardMaterial
          color="#c7d2fe"
          emissive="#818cf8"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0.1, -0.35, -0.35]}>
        <sphereGeometry args={[0.13, 12, 12]} />

        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

function AtomModel({ atomicNumber }) {
  const shellData =
    electronConfigurations[atomicNumber] || [1]

  const shellRotations = [
    [0, 0, 0],
    [Math.PI / 2.5, 0, 0],
    [0, Math.PI / 2.5, 0],
    [Math.PI / 3, Math.PI / 4, 0],
    [Math.PI / 4, Math.PI / 3, Math.PI / 5],
    [Math.PI / 5, Math.PI / 6, Math.PI / 4],
    [Math.PI / 6, Math.PI / 4, Math.PI / 3],
  ]

  return (
    <group>
      <Nucleus />

      {shellData.map((electronCount, index) => (
        <ElectronShell
          key={`${atomicNumber}-${index}`}
          radius={1.35 + index * 0.72}
          electrons={electronCount}
          rotation={
            shellRotations[index % shellRotations.length]
          }
          speed={0.35 + index * 0.05}
        />
      ))}
    </group>
  )
}

export default function Atom3D({ element }) {
  if (!element) {
    return (
      <div className="atom3d-empty">
        Select an element to view its 3D atom.
      </div>
    )
  }

  const configuration =
    electronConfigurations[element.atomic_number] || []

  return (
    <div className="atom3d-container">
      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: 45,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#080d1d']} />

        <ambientLight intensity={1.4} />

        <pointLight
          position={[4, 5, 5]}
          intensity={35}
          distance={20}
        />

        <pointLight
          position={[-4, -3, 2]}
          intensity={18}
          distance={15}
        />

        <Stars
          radius={30}
          depth={20}
          count={700}
          factor={2}
          saturation={0}
          fade
          speed={0.4}
        />

        <AtomModel
          atomicNumber={element.atomic_number}
        />

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      <div className="atom3d-overlay">
        <span>3D ATOM</span>

        <strong>{element.symbol}</strong>

        <small>{element.name}</small>

        <div className="atom-shell-info">
          <span>Electron shells</span>

          <strong>
            {configuration.join(' • ')}
          </strong>
        </div>
      </div>
    </div>
  )
}