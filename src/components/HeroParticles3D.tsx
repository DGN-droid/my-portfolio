import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const DESKTOP_PARTICLE_COUNT = 800
const MOBILE_PARTICLE_COUNT = 400
const MAX_PARALLAX = THREE.MathUtils.degToRad(12)

const vertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aInfluence;
  varying vec3 vColor;
  varying float vInfluence;
  uniform float uPixelRatio;

  void main() {
    vColor = aColor;
    vInfluence = aInfluence;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * 6.0 * uPixelRatio * (300.0 / -modelViewPosition.z) * (1.0 + aInfluence * 0.8);
    gl_Position = projectionMatrix * modelViewPosition;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vInfluence;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    float glow = 1.0 - smoothstep(0.05, 0.5, distanceToCenter);
    gl_FragColor = vec4(vColor, glow * (0.9 + vInfluence * 0.1));
  }
`

const POINTER_RADIUS = 150
const MAX_PARTICLE_PUSH = 36
const FORM_PARTICLE_PUSH = 14
const LINK_DISTANCE = 40
const LINK_INFLUENCE_THRESHOLD = 0.35
const SHAPE_CLICK_RADIUS = 12
const INTERACTION_LERP = 0.12
const INFLUENCE_LERP = 0.2
const AUTO_ROTATION_SPEED = 0.0008
const MODEL_TILT = 0.16
const MODEL_SCALE_BOOST = 0.045
const IDLE_DELAY = 15_000
const STATE_HOLD = 10_000
const MORPH_DURATION = 1_200
const CINEMATIC_SPREAD_DURATION = 1_200

const easeInOut = (value: number) => value * value * (3 - 2 * value)

function createShapeTargets(count: number, width: number, height: number): Float32Array[] {
  const shapeCenterX = 150
  const centerY = 0
  const createTarget = (points: Array<{ x: number; y: number; z?: number }>, zRange: number) => {
    const target = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const point = points[index % points.length] ?? { x: shapeCenterX, y: centerY }
      const offset = index * 3
      target[offset] = point.x
      target[offset + 1] = point.y
      target[offset + 2] = point.z ?? (Math.random() * 2 - 1) * zRange
    }
    return target
  }

  const circleRadius = 180
  const circleDepth = 110
  const circle = Array.from({ length: count }, (_, index) => {
    const latitude = (index + 0.5) / count
    const polarCosine = 1 - latitude * 2
    const polarSine = Math.sqrt(Math.max(0, 1 - polarCosine * polarCosine))
    const angle = index * Math.PI * (3 - Math.sqrt(5))
    return {
      x: shapeCenterX + Math.cos(angle) * polarSine * circleRadius,
      y: centerY + Math.sin(angle) * polarSine * circleRadius,
      z: polarCosine * circleDepth + (Math.random() * 2 - 1) * 8,
    }
  })

  const sampleText = (text: string, fontSize: number, zRange: number) => {
    const textCanvas = document.createElement('canvas')
    textCanvas.width = Math.max(1, Math.ceil(width))
    textCanvas.height = Math.max(1, Math.ceil(height))
    const textContext = textCanvas.getContext('2d')
    if (!textContext) return createTarget([], zRange)

    textContext.clearRect(0, 0, textCanvas.width, textCanvas.height)
    textContext.fillStyle = '#ffffff'
    textContext.font = `800 ${fontSize}px Manrope, Arial, sans-serif`
    textContext.textAlign = 'center'
    textContext.textBaseline = 'middle'
    textContext.fillText(text, width / 2 + shapeCenterX, height * 0.52)

    const pixels = textContext.getImageData(0, 0, textCanvas.width, textCanvas.height).data
    const candidates: Array<{ x: number; y: number }> = []
    const sampleStep = Math.max(2, Math.floor(fontSize / 32))

    for (let y = 0; y < textCanvas.height; y += sampleStep) {
      for (let x = 0; x < textCanvas.width; x += sampleStep) {
        if (pixels[(y * textCanvas.width + x) * 4 + 3] > 100) {
          candidates.push({ x, y })
        }
      }
    }

    const target = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const candidate = candidates[Math.floor(index * candidates.length / count)]
      const offset = index * 3
      target[offset] = candidate ? candidate.x - width / 2 : shapeCenterX
      target[offset + 1] = candidate ? height / 2 - candidate.y : centerY
      target[offset + 2] = (Math.random() * 2 - 1) * zRange
    }
    return target
  }

  const c = sampleText('C', Math.min(height * 0.5, width * 0.42), 38)

  return [createTarget(circle, circleDepth), c]
}

function HeroParticles3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas?.closest('.hero') as HTMLElement | null

    if (!canvas || !hero) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 1, 2_000)

    let renderer: THREE.WebGLRenderer
    try {
      canvas.style.display = 'block'
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        precision: 'lowp',
        powerPreference: 'high-performance',
      })
    } catch (error) {
      canvas.style.display = 'none'
      console.error('Three.js WebGL context unavailable for HeroParticles3D.', error)
      return
    }
    let geometry: THREE.BufferGeometry | null = null
    let material: THREE.ShaderMaterial | null = null
    let points: THREE.Points | null = null
    let positions: Float32Array | null = null
    let originalPositions: Float32Array | null = null
    let currentTargetPositions: Float32Array | null = null
    let morphPositions: Float32Array | null = null
    let shapeTargets: Float32Array[] = []
    let influences: Float32Array | null = null
    let influenceAttribute: THREE.BufferAttribute | null = null
    let pointerWorld: THREE.Vector3 | null = null
    let pointerOverActiveShape = false
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#f0eee7',
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    })
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial)
    lineSegments.visible = false
    let animationFrame = 0
    let targetRotationX = 0
    let targetRotationY = 0
    let isRunning = false
    let lastPointerActivity = performance.now()
    let idleCycleStartedAt: number | null = null
    let cinematicStartedAt: number | null = null
    let cinematicSpreadTargets: Float32Array | null = null
    let titleIsDimmed = false
    let viewportWidth = 1
    let targetModelTiltX = 0
    let targetModelTiltZ = 0
    let targetModelScale = 1
    const pointerLocal = new THREE.Vector3()
    const rotationAxisY = new THREE.Vector3(0, 1, 0)

    const handleContextLost = (event: Event) => {
      event.preventDefault()
      canvas.style.display = 'none'
      cancelAnimationFrame(animationFrame)
      console.error('WebGL context lost for HeroParticles3D.')
    }
    canvas.addEventListener('webglcontextlost', handleContextLost)

    camera.position.z = 560
    renderer.setClearColor(0x000000, 0)
    renderer.setClearAlpha(0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    const disposeParticleField = () => {
      if (points) scene.remove(points)
      geometry?.dispose()
      material?.dispose()
      geometry = null
      material = null
      points = null
      positions = null
      originalPositions = null
      currentTargetPositions = null
      morphPositions = null
      shapeTargets = []
      influences = null
      influenceAttribute = null
      cinematicStartedAt = null
      cinematicSpreadTargets = null
      targetModelTiltX = 0
      targetModelTiltZ = 0
      targetModelScale = 1
    }

    const setTitleDimmed = (dimmed: boolean) => {
      if (titleIsDimmed === dimmed) return
      titleIsDimmed = dimmed
      hero.classList.toggle('hero--particle-text', dimmed)
    }

    const createParticleField = (width: number, height: number) => {
      disposeParticleField()
      viewportWidth = width

      const count = width < 760 ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT
      const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.position.z
      const visibleWidth = visibleHeight * camera.aspect
      positions = new Float32Array(count * 3)
      originalPositions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)
      influences = new Float32Array(count)
      const paper = new THREE.Color('#f0eee7')
      const acid = new THREE.Color('#d9fb63')
      const orange = new THREE.Color('#fe6e45')

      for (let index = 0; index < count; index += 1) {
        const isAcid = index % 20 === 0
        const isOrange = !isAcid && Math.random() < 1 / 12
        const color = isOrange ? orange : isAcid ? acid : paper
        const offset = index * 3

        const x = (Math.random() - 0.5) * visibleWidth * 1.25
        const y = (Math.random() - 0.5) * visibleHeight * 1.25
        const z = Math.random() * 640 - 320
        positions[offset] = x
        positions[offset + 1] = y
        positions[offset + 2] = z
        originalPositions[offset] = x
        originalPositions[offset + 1] = y
        originalPositions[offset + 2] = z
        colors[offset] = color.r
        colors[offset + 1] = color.g
        colors[offset + 2] = color.b
        sizes[index] = 0.5 + Math.random() * 1.7
      }

      shapeTargets = createShapeTargets(count, visibleWidth, visibleHeight)
      morphPositions = new Float32Array(count * 3)
      currentTargetPositions = originalPositions

      geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
      influenceAttribute = new THREE.BufferAttribute(influences, 1)
      geometry.setAttribute('aInfluence', influenceAttribute)

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

      points = new THREE.Points(geometry, material)
      scene.add(points)
      lineSegments.rotation.y = points.rotation.y
    }

    scene.add(lineSegments)

    const updateConnectionLines = () => {
      if (!positions || !influences) return

      const influencedIndices: number[] = []
      for (let index = 0; index < influences.length; index += 1) {
        if (influences[index] > LINK_INFLUENCE_THRESHOLD) influencedIndices.push(index)
      }

      const linePositions: number[] = []
      for (let first = 0; first < influencedIndices.length; first += 1) {
        const firstIndex = influencedIndices[first]
        const firstOffset = firstIndex * 3

        for (let second = first + 1; second < influencedIndices.length; second += 1) {
          const secondIndex = influencedIndices[second]
          const secondOffset = secondIndex * 3
          const distance = Math.hypot(
            positions[firstOffset] - positions[secondOffset],
            positions[firstOffset + 1] - positions[secondOffset + 1],
            positions[firstOffset + 2] - positions[secondOffset + 2],
          )

          if (distance >= LINK_DISTANCE) continue

          linePositions.push(
            positions[firstOffset], positions[firstOffset + 1], positions[firstOffset + 2],
            positions[secondOffset], positions[secondOffset + 1], positions[secondOffset + 2],
          )
        }
      }

      lineGeometry.deleteAttribute('position')
      if (linePositions.length > 0) {
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
        lineGeometry.computeBoundingSphere()
      }
    }

    const updateIdleTarget = (now: number) => {
      if (cinematicStartedAt !== null && cinematicSpreadTargets && originalPositions) {
        if (now - cinematicStartedAt < CINEMATIC_SPREAD_DURATION) {
          currentTargetPositions = cinematicSpreadTargets
          setTitleDimmed(false)
          return
        }

        cinematicStartedAt = null
        cinematicSpreadTargets = null
        lastPointerActivity = now
        currentTargetPositions = originalPositions
        const positionAttribute = geometry?.getAttribute('position')
        if (positionAttribute) positionAttribute.needsUpdate = true
        setTitleDimmed(false)
      }

      if (!originalPositions || shapeTargets.length === 0 || reducedMotion.matches) {
        currentTargetPositions = originalPositions
        idleCycleStartedAt = null
        setTitleDimmed(false)
        return
      }

      if (now - lastPointerActivity < IDLE_DELAY) {
        currentTargetPositions = originalPositions
        idleCycleStartedAt = null
        setTitleDimmed(false)
        return
      }

      if (idleCycleStartedAt === null) idleCycleStartedAt = now

      const cycleShapeCount = viewportWidth < 760
        ? Math.min(2, shapeTargets.length)
        : shapeTargets.length
      const shapeCycleDuration = MORPH_DURATION * 2 + STATE_HOLD * 2
      const elapsed = now - idleCycleStartedAt
      const cycleTime = elapsed % (shapeCycleDuration * cycleShapeCount)
      const shapeIndex = Math.floor(cycleTime / shapeCycleDuration)
      const phaseTime = cycleTime - shapeIndex * shapeCycleDuration
      const shape = shapeTargets[shapeIndex]

      if (phaseTime < MORPH_DURATION) {
        if (morphPositions) {
          const progress = easeInOut(phaseTime / MORPH_DURATION)
          for (let offset = 0; offset < morphPositions.length; offset += 1) {
            morphPositions[offset] = originalPositions[offset]
              + (shape[offset] - originalPositions[offset]) * progress
          }
          currentTargetPositions = morphPositions
        }
      } else if (phaseTime < MORPH_DURATION + STATE_HOLD) {
        currentTargetPositions = shape
      } else if (phaseTime < MORPH_DURATION * 2 + STATE_HOLD) {
        if (morphPositions) {
          const progress = easeInOut(
            (phaseTime - MORPH_DURATION - STATE_HOLD) / MORPH_DURATION,
          )
          for (let offset = 0; offset < morphPositions.length; offset += 1) {
            morphPositions[offset] = shape[offset]
              + (originalPositions[offset] - shape[offset]) * progress
          }
          currentTargetPositions = morphPositions
        }
      } else {
        currentTargetPositions = originalPositions
      }

      setTitleDimmed(false)
    }

    const updateParticleInteraction = () => {
      if (!positions || !originalPositions || !currentTargetPositions || !influences || !influenceAttribute) return

      const shapeIsActive = currentTargetPositions !== originalPositions
      const hasPointer = !reducedMotion.matches
        && pointerWorld !== null
        && (!shapeIsActive || pointerOverActiveShape)
      if (hasPointer && pointerWorld) {
        pointerLocal.copy(pointerWorld)
        if (points) pointerLocal.applyAxisAngle(rotationAxisY, -points.rotation.y)
      }

      let strongestInfluence = 0

      for (let index = 0; index < influences.length; index += 1) {
        const offset = index * 3
        const targetOriginX = currentTargetPositions[offset]
        const targetOriginY = currentTargetPositions[offset + 1]
        const targetOriginZ = currentTargetPositions[offset + 2]
        let targetX = targetOriginX
        let targetY = targetOriginY
        let targetInfluence = 0

        if (hasPointer) {
          const distanceX = targetOriginX - pointerLocal.x
          const distanceY = targetOriginY - pointerLocal.y
          const distance = Math.hypot(distanceX, distanceY)
          const particlePush = shapeIsActive
            ? FORM_PARTICLE_PUSH
            : MAX_PARTICLE_PUSH

          if (distance < POINTER_RADIUS) {
            targetInfluence = 1 - distance / POINTER_RADIUS
            strongestInfluence = Math.max(strongestInfluence, targetInfluence)
            const directionX = distance === 0 ? 0 : distanceX / distance
            const directionY = distance === 0 ? 0 : distanceY / distance
            targetX += directionX * targetInfluence * particlePush
            targetY += directionY * targetInfluence * particlePush
          }
        }

        if (reducedMotion.matches) {
          positions[offset] = originalPositions[offset]
          positions[offset + 1] = originalPositions[offset + 1]
          positions[offset + 2] = originalPositions[offset + 2]
          influences[index] = 0
        } else {
          positions[offset] += (targetX - positions[offset]) * INTERACTION_LERP
          positions[offset + 1] += (targetY - positions[offset + 1]) * INTERACTION_LERP
          positions[offset + 2] += (targetOriginZ - positions[offset + 2]) * INTERACTION_LERP
          influences[index] += (targetInfluence - influences[index]) * INFLUENCE_LERP
          if (influences[index] < 0.001) influences[index] = 0
        }
      }

      if (shapeIsActive && hasPointer) {
        const shapeDistance = Math.hypot(pointerLocal.x - 150, pointerLocal.y)
        const shapeHover = THREE.MathUtils.clamp(1 - shapeDistance / 420, 0, 1)
        targetModelTiltX = THREE.MathUtils.clamp(-pointerLocal.y / 420, -1, 1) * MODEL_TILT * shapeHover
        targetModelTiltZ = THREE.MathUtils.clamp((pointerLocal.x - 150) / 420, -1, 1) * MODEL_TILT * shapeHover
        targetModelScale = 1 + shapeHover * MODEL_SCALE_BOOST
      } else {
        targetModelTiltX = 0
        targetModelTiltZ = 0
        targetModelScale = 1
      }

      const positionAttribute = geometry?.getAttribute('position')
      if (positionAttribute) positionAttribute.needsUpdate = true
      influenceAttribute.needsUpdate = true
      lineMaterial.opacity = 0.08 + strongestInfluence * 0.24
      updateConnectionLines()
    }

    const render = (now = performance.now()) => {
      updateIdleTarget(now)
      if (!reducedMotion.matches) {
        camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.06
        camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.06
      } else {
        camera.rotation.x = 0
        camera.rotation.y = 0
      }
      if (!reducedMotion.matches && points) {
        points.rotation.y += AUTO_ROTATION_SPEED
        points.rotation.x += (targetModelTiltX - points.rotation.x) * 0.08
        points.rotation.z += (targetModelTiltZ - points.rotation.z) * 0.08
        points.scale.x += (targetModelScale - points.scale.x) * 0.08
        points.scale.y += (targetModelScale - points.scale.y) * 0.08
        points.scale.z += (targetModelScale - points.scale.z) * 0.08
        lineSegments.rotation.copy(points.rotation)
        lineSegments.scale.copy(points.scale)
      } else if (points) {
        points.rotation.set(0, 0, 0)
        points.scale.set(1, 1, 1)
        lineSegments.rotation.copy(points.rotation)
        lineSegments.scale.copy(points.scale)
      }
      camera.updateMatrixWorld()
      updateParticleInteraction()
      renderer.render(scene, camera)
    }

    const loop = (now: number) => {
      render(now)
      animationFrame = requestAnimationFrame(loop)
    }

    const resize = () => {
      const bounds = hero.getBoundingClientRect()
      const width = Math.max(1, bounds.width)
      const height = Math.max(1, bounds.height)
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(width, height, false)
      if (material) material.uniforms.uPixelRatio.value = pixelRatio
      createParticleField(width, height)
      render()
    }

    const updatePointerWorld = (clientX: number, clientY: number) => {
      if (reducedMotion.matches) return

      const bounds = hero.getBoundingClientRect()
      const normalizedX = ((clientX - bounds.left) / bounds.width) * 2 - 1
      const normalizedY = ((clientY - bounds.top) / bounds.height) * 2 - 1
      targetRotationY = normalizedX * MAX_PARALLAX
      targetRotationX = -normalizedY * MAX_PARALLAX

      camera.updateMatrixWorld()
      const rayPoint = new THREE.Vector3(normalizedX, -normalizedY, 0.5).unproject(camera)
      const rayDirection = rayPoint.sub(camera.position).normalize()
      const distanceToPlane = -camera.position.z / rayDirection.z

      if (!Number.isFinite(distanceToPlane)) return
      pointerWorld = camera.position.clone().add(rayDirection.multiplyScalar(distanceToPlane))
    }

    const resetIdleCycle = () => {
      lastPointerActivity = performance.now()
      idleCycleStartedAt = null
      cinematicStartedAt = null
      cinematicSpreadTargets = null
      const wasShowingShape = currentTargetPositions !== originalPositions || titleIsDimmed
      currentTargetPositions = originalPositions
      setTitleDimmed(false)

      if (wasShowingShape && positions && originalPositions && influences && influenceAttribute) {
        positions.set(originalPositions)
        influences.fill(0)
        const positionAttribute = geometry?.getAttribute('position')
        if (positionAttribute) positionAttribute.needsUpdate = true
        influenceAttribute.needsUpdate = true
        updateConnectionLines()
      }
    }

    const triggerModelCollapse = () => {
      if (
        !positions ||
        !originalPositions ||
        !currentTargetPositions ||
        currentTargetPositions === originalPositions
      ) return

      cinematicSpreadTargets = new Float32Array(currentTargetPositions.length)
      for (let offset = 0; offset < cinematicSpreadTargets.length; offset += 3) {
        const x = currentTargetPositions[offset]
        const y = currentTargetPositions[offset + 1]
        const z = currentTargetPositions[offset + 2]
        const distance = Math.hypot(x - 150, y) || 1
        const directionX = (x - 150) / distance
        const directionY = y / distance
        const spread = 2.2 + Math.random() * 1.8

        cinematicSpreadTargets[offset] = 150 + (x - 150) * spread + directionX * 80
        cinematicSpreadTargets[offset + 1] = y * spread + directionY * 80
        cinematicSpreadTargets[offset + 2] = z + (Math.random() - 0.5) * 220
      }

      cinematicStartedAt = performance.now()
      idleCycleStartedAt = null
      currentTargetPositions = cinematicSpreadTargets
      setTitleDimmed(false)
    }

    const isPointerOnActiveShape = (clientX: number, clientY: number) => {
      const isStableShape = shapeTargets.some((target) => target === currentTargetPositions)
      if (
        cinematicStartedAt !== null ||
        !points ||
        !currentTargetPositions ||
        !isStableShape
      ) {
        return false
      }

      const bounds = hero.getBoundingClientRect()
      const projectedPoint = new THREE.Vector3()
      camera.updateMatrixWorld()
      points.updateMatrixWorld()

      for (let offset = 0; offset < currentTargetPositions.length; offset += 3) {
        projectedPoint.set(
          currentTargetPositions[offset],
          currentTargetPositions[offset + 1],
          currentTargetPositions[offset + 2],
        )
        points.localToWorld(projectedPoint)
        projectedPoint.project(camera)

        const screenX = bounds.left + (projectedPoint.x * 0.5 + 0.5) * bounds.width
        const screenY = bounds.top + (-projectedPoint.y * 0.5 + 0.5) * bounds.height
        if (Math.hypot(clientX - screenX, clientY - screenY) < SHAPE_CLICK_RADIUS) return true
      }

      return false
    }

    const handlePointerMove = (event: PointerEvent) => {
      updatePointerWorld(event.clientX, event.clientY)
      pointerOverActiveShape = isPointerOnActiveShape(event.clientX, event.clientY)
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return
      updatePointerWorld(event.clientX, event.clientY)
      pointerOverActiveShape = isPointerOnActiveShape(event.clientX, event.clientY)
      if (pointerOverActiveShape) triggerModelCollapse()
    }

    const handlePointerLeave = () => {
      targetRotationX = 0
      targetRotationY = 0
      pointerWorld = null
      pointerOverActiveShape = false
      resetIdleCycle()
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) {
        updatePointerWorld(touch.clientX, touch.clientY)
        pointerOverActiveShape = isPointerOnActiveShape(touch.clientX, touch.clientY)
      }
    }

    const handleTouchEnd = () => {
      pointerWorld = null
      pointerOverActiveShape = false
      if (cinematicStartedAt === null) resetIdleCycle()
    }

    const handleMotionPreference = () => {
      cancelAnimationFrame(animationFrame)
      camera.rotation.x = 0
      camera.rotation.y = 0
      pointerWorld = null
      resetIdleCycle()
      render()
      if (!reducedMotion.matches) {
        isRunning = true
        animationFrame = requestAnimationFrame(loop)
      } else {
        isRunning = false
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    hero.addEventListener('pointermove', handlePointerMove, { passive: true })
    hero.addEventListener('pointerdown', handlePointerDown, { passive: true })
    hero.addEventListener('pointerleave', handlePointerLeave)
    hero.addEventListener('touchmove', handleTouchMove, { passive: true })
    hero.addEventListener('touchend', handleTouchEnd)
    hero.addEventListener('touchcancel', handleTouchEnd)
    reducedMotion.addEventListener('change', handleMotionPreference)
    resizeObserver.observe(hero)
    resize()

    if (!reducedMotion.matches && !isRunning) {
      isRunning = true
      animationFrame = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      hero.removeEventListener('pointermove', handlePointerMove)
      hero.removeEventListener('pointerdown', handlePointerDown)
      hero.removeEventListener('pointerleave', handlePointerLeave)
      hero.removeEventListener('touchmove', handleTouchMove)
      hero.removeEventListener('touchend', handleTouchEnd)
      hero.removeEventListener('touchcancel', handleTouchEnd)
      reducedMotion.removeEventListener('change', handleMotionPreference)
      disposeParticleField()
      lineGeometry.dispose()
      lineMaterial.dispose()
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__particles" aria-hidden="true" />
}

export default HeroParticles3D
