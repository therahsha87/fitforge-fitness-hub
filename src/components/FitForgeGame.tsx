'use client'

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface GameStats {
  level: number
  strength: number
  materials: Record<string, number>
  gold: number
  items: Array<{ name: string; value: number }>
}

const FitForgeGame: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [fps, setFps] = useState<number>(60)
  
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 1,
    strength: 10,
    materials: { iron: 0, copper: 0, silver: 0, gold: 0, coal: 5 },
    gold: 100,
    items: []
  })

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x1a1a1a)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    cameraRef.current = camera
    camera.position.set(5, 3, 5)
    camera.lookAt(0, 0, 0)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    rendererRef.current = renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    scene.add(ambientLight)

    const fireLight = new THREE.PointLight(0xff4500, 2, 10)
    fireLight.position.set(0, 2, 0)
    fireLight.castShadow = true
    scene.add(fireLight)

    // Forge elements
    const forgeGeometry = new THREE.BoxGeometry(3, 0.5, 2)
    const forgeMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
    const forge = new THREE.Mesh(forgeGeometry, forgeMaterial)
    forge.position.y = 0.25
    forge.receiveShadow = true
    scene.add(forge)

    // Fire effect (simplified)
    const fireGeometry = new THREE.ConeGeometry(0.3, 1, 8)
    const fireMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500 })
    const fire = new THREE.Mesh(fireGeometry, fireMaterial)
    fire.position.set(0, 1, 0)
    scene.add(fire)

    // Materials floating around
    const materialColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x6c5ce7]
    const materials: THREE.Mesh[] = []

    for (let i = 0; i < 10; i++) {
      const materialGeometry = new THREE.OctahedronGeometry(0.1)
      const materialMaterial = new THREE.MeshLambertMaterial({ 
        color: materialColors[i % materialColors.length] 
      })
      const material = new THREE.Mesh(materialGeometry, materialMaterial)
      
      material.position.set(
        (Math.random() - 0.5) * 8,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 8
      )
      
      materials.push(material)
      scene.add(material)
    }

    // Animation loop
    let frameCount = 0
    let lastTime = performance.now()

    const animate = (): void => {
      requestAnimationFrame(animate)

      // Calculate FPS
      frameCount++
      const currentTime = performance.now()
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }

      // Animate fire
      fire.rotation.y += 0.02
      fire.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.2

      // Animate materials
      materials.forEach((material, index) => {
        material.rotation.x += 0.01
        material.rotation.y += 0.02
        material.position.y += Math.sin(Date.now() * 0.003 + index) * 0.002
      })

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = (): void => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('resize', handleResize)

    // Mouse controls
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    const handleMouseDown = (event: MouseEvent): void => {
      isDragging = true
      previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseMove = (event: MouseEvent): void => {
      if (!isDragging || !cameraRef.current) return

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      }

      const rotationSpeed = 0.005
      camera.position.x = camera.position.x * Math.cos(deltaMove.x * rotationSpeed) - camera.position.z * Math.sin(deltaMove.x * rotationSpeed)
      camera.position.z = camera.position.x * Math.sin(deltaMove.x * rotationSpeed) + camera.position.z * Math.cos(deltaMove.x * rotationSpeed)
      
      camera.lookAt(0, 0, 0)
      previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = (): void => {
      isDragging = false
    }

    renderer.domElement.addEventListener('mousedown', handleMouseDown)
    renderer.domElement.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  const mineAction = (): void => {
    const materials = ['iron', 'copper', 'silver', 'gold']
    const randomMaterial = materials[Math.floor(Math.random() * materials.length)]
    const amount = Math.floor(Math.random() * 3) + 1
    
    setGameStats(prev => ({
      ...prev,
      materials: {
        ...prev.materials,
        [randomMaterial]: prev.materials[randomMaterial] + amount
      },
      strength: prev.strength + 1
    }))
  }

  const craftAction = (): void => {
    if (gameStats.materials.iron >= 3 && gameStats.materials.coal >= 1) {
      const items = ['Iron Sword', 'Steel Pickaxe', 'Bronze Shield']
      const newItem = { 
        name: items[Math.floor(Math.random() * items.length)], 
        value: Math.floor(Math.random() * 20) + 10 
      }
      
      setGameStats(prev => ({
        ...prev,
        materials: {
          ...prev.materials,
          iron: prev.materials.iron - 3,
          coal: prev.materials.coal - 1
        },
        items: [...prev.items, newItem],
        level: prev.level + (prev.items.length % 5 === 4 ? 1 : 0)
      }))
    }
  }

  const sellAction = (): void => {
    const totalValue = gameStats.items.reduce((sum, item) => sum + item.value, 0)
    setGameStats(prev => ({
      ...prev,
      gold: prev.gold + totalValue,
      items: []
    }))
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Stats Monitor */}
      <Card className="absolute top-4 right-4 bg-black/80 text-white border-gray-700">
        <CardContent className="p-3 text-xs space-y-1">
          <div>FPS: {fps}</div>
          <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
          <div>Level: {gameStats.level}</div>
          <div>Strength: {gameStats.strength}</div>
          <div>Gold: {gameStats.gold}</div>
        </CardContent>
      </Card>

      {/* Controls Display */}
      <Card className={`absolute ${isMobile ? 'top-4 left-4' : 'top-4 left-1/2 transform -translate-x-1/2'} bg-black/80 text-white border-gray-700`}>
        <CardContent className="p-3 text-xs">
          <div className="font-semibold mb-2">🎮 Controls</div>
          <div>M - Mine Materials</div>
          <div>C - Craft Items</div>
          <div>S - Sell All Items</div>
          {!isMobile && <div>Mouse Drag - Rotate View</div>}
        </CardContent>
      </Card>

      {/* Materials Display */}
      <Card className="absolute bottom-20 left-4 bg-black/80 text-white border-gray-700">
        <CardContent className="p-3 text-xs">
          <div className="font-semibold mb-2">⛏️ Materials</div>
          {Object.entries(gameStats.materials).map(([material, count]) => (
            <div key={material} className="flex justify-between">
              <span className="capitalize">{material}:</span>
              <span>{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Desktop Controls */}
      {!isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <Button onClick={mineAction} className="bg-orange-600 hover:bg-orange-700">
            Mine (M)
          </Button>
          <Button onClick={craftAction} className="bg-blue-600 hover:bg-blue-700">
            Craft (C)
          </Button>
          <Button onClick={sellAction} className="bg-green-600 hover:bg-green-700">
            Sell (S)
          </Button>
        </div>
      )}

      {/* Mobile Controls */}
      {isMobile && (
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <Button onClick={mineAction} size="sm" className="bg-orange-600 hover:bg-orange-700">
            ⛏️ Mine
          </Button>
          <Button onClick={craftAction} size="sm" className="bg-blue-600 hover:bg-blue-700">
            🔨 Craft
          </Button>
          <Button onClick={sellAction} size="sm" className="bg-green-600 hover:bg-green-700">
            💰 Sell
          </Button>
        </div>
      )}

      {/* Keyboard Controls */}
      <div className="hidden">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === 'm' || e.key === 'M') mineAction()
            if (e.key === 'c' || e.key === 'C') craftAction()
            if (e.key === 's' || e.key === 'S') sellAction()
          }}
          autoFocus
          style={{ position: 'absolute', left: '-9999px' }}
        />
      </div>
    </div>
  )
}

export default FitForgeGame
