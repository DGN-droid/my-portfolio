import { RefObject, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type ContactBirdProps = {
  containerRef: RefObject<HTMLDivElement | null>
  targetId: string | null
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    child.geometry.dispose()
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose()
      })
      material.dispose()
    })
  })
}

function ContactBird({ containerRef, targetId }: ContactBirdProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetIdRef = useRef(targetId)

  useEffect(() => {
    targetIdRef.current = targetId
  }, [targetId])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch (error) {
      console.warn('Three.js indisponible pour le perroquet du Contact.', error)
      canvas.hidden = true
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()
    scene.add(new THREE.HemisphereLight(0xf0eee7, 0x171714, 2.2))
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8)
    keyLight.position.set(-120, 180, 240)
    scene.add(keyLight)

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 1000)
    camera.position.z = 100
    const bird = new THREE.Group()
    bird.visible = false
    scene.add(bird)

    const currentTarget = new THREE.Vector3()
    const target = new THREE.Vector3()
    let loadedModel: THREE.Object3D | null = null
    let animationFrame = 0
    let lastTime = performance.now()
    let disposed = false

    const resize = () => {
      const width = Math.max(1, container.clientWidth)
      const height = Math.max(1, container.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height, false)
      camera.left = -width / 2
      camera.right = width / 2
      camera.top = height / 2
      camera.bottom = -height / 2
      camera.updateProjectionMatrix()
      if (!currentTarget.length()) {
        currentTarget.set(-width * .2, height * .18, 0)
        bird.position.copy(currentTarget)
      }
    }

    const updateTarget = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      const field = targetIdRef.current ? document.getElementById(targetIdRef.current) : null
      if (!field) {
        target.set(-width * .2, height * .18, 0)
        return
      }
      const fieldBounds = field.getBoundingClientRect()
      const containerBounds = container.getBoundingClientRect()
      const x = fieldBounds.left - containerBounds.left + fieldBounds.width / 2
      const y = fieldBounds.top - containerBounds.top + fieldBounds.height / 2
      target.set(x - width / 2, height / 2 - y, 0)
    }

    const loader = new GLTFLoader()
    loader.load('/models/parrot/low-poly_parrot/scene.gltf', (gltf) => {
      if (disposed) {
        disposeObject(gltf.scene)
        return
      }
      loadedModel = gltf.scene
      const bounds = new THREE.Box3().setFromObject(loadedModel)
      const size = bounds.getSize(new THREE.Vector3())
      const center = bounds.getCenter(new THREE.Vector3())
      const maxDimension = Math.max(size.x, size.y, size.z)
      loadedModel.position.sub(center)
      loadedModel.scale.setScalar(118 / Math.max(maxDimension, .001))
      // Le modèle est déjà orienté dans l'axe de son profil. Une rotation de
      // 90° le présentait de face au lieu de montrer sa silhouette latérale.
      loadedModel.rotation.y = 0
      bird.add(loadedModel)
      bird.visible = true
    }, undefined, (error) => {
      console.warn('Impossible de charger le modèle du perroquet.', error)
    })

    const animate = (time: number) => {
      const delta = Math.min(.05, (time - lastTime) / 1000)
      lastTime = time
      updateTarget()

      if (reducedMotion) {
        bird.position.copy(target)
      } else {
        currentTarget.lerp(target, .08)
        const distance = bird.position.distanceTo(currentTarget)
        bird.position.lerp(currentTarget, Math.min(1, delta * (distance > 20 ? 3.2 : 5.5)))
        const direction = target.x - bird.position.x
        bird.rotation.z += (THREE.MathUtils.clamp(direction * .002, -.2, .2) - bird.rotation.z) * .08
        bird.rotation.y += (Math.sin(time * .0018) * .06 - bird.rotation.y) * .04
        bird.position.y += Math.sin(time * .003) * .12
        if (loadedModel) {
          loadedModel.rotation.x += (Math.sin(time * .006) * .035 - loadedModel.rotation.x) * .08
          loadedModel.rotation.z += (Math.sin(time * .004) * .025 - loadedModel.rotation.z) * .08
        }
      }

      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(animate)
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    animationFrame = window.requestAnimationFrame(animate)

    return () => {
      disposed = true
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      if (loadedModel) disposeObject(loadedModel)
      renderer.dispose()
    }
  }, [containerRef])

  return <canvas ref={canvasRef} className="contact-bird" aria-hidden="true" />
}

export default ContactBird
