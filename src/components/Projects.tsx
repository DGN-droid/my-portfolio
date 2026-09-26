import { useEffect, useRef, useState } from 'react'

type Project = {
  number: string
  name: string
  type: string
  role: string
  description: string
  slot: string
  accent: string
  image?: string
  link?: string
}

const projects: Project[] = [
  {
    number: '01',
    name: 'IOKEO',
    type: 'Site web',
    role: 'Développement web',
    description: 'Une fiche prête à accueillir la présentation du site, le contexte de la mission et les choix d’interface.',
    slot: 'Ajouter une image IOKEO',
    accent: 'project-card--acid',
    image: '/projects/img1.jpeg',
    link: 'https://www.iokeo.com/',
  },
  {
    number: '02',
    name: 'Ribbit',
    type: 'Tests QA',
    role: 'Tests QA',
    description: 'Un espace pour décrire la démarche de test, les parcours couverts et les éléments que tu souhaites documenter.',
    slot: 'Ajouter une image Ribbit',
    accent: 'project-card--orange',
    image: '/projects/img3.png',
    link: 'https://ribbit.dk/',
  },
  {
    number: '03',
    name: 'Les Patronnes',
    type: 'Identité visuelle',
    role: 'Identité visuelle',
    description: 'Une scène dédiée à l’identité, aux supports et aux décisions graphiques du projet, sans extrapoler le périmètre réel.',
    slot: 'Ajouter une image Les Patronnes',
    accent: 'project-card--paper',
    image: '/projects/img2.jpeg',
    link: 'https://les-patronnes-website-8wwa.vercel.app/',
  },
]

const carouselProjects = [...projects, ...projects, ...projects]
const middleOffset = projects.length

function ProjectCard({ project, active }: { project: Project; active: boolean }) {
  const cardRef = useRef<HTMLElement>(null)

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !cardRef.current) return
    const bounds = cardRef.current.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5
    cardRef.current.style.setProperty('--tilt-x', `${y}deg`)
    cardRef.current.style.setProperty('--tilt-y', `${x}deg`)
  }

  const resetPointer = () => {
    cardRef.current?.style.setProperty('--tilt-x', '0deg')
    cardRef.current?.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <article
      className={`project-card ${project.accent}${active ? ' project-card--active' : ''}`}
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      tabIndex={active ? 0 : -1}
      aria-current={active ? 'true' : undefined}
    >
      <div className="project-card__top">
        <span>{project.number} / 03</span>
        <span>{project.type}</span>
      </div>

      <div className={`project-card__media${project.image ? ' project-card__media--image' : ''}`} data-image-slot={project.slot}>
        {project.image ? (
          <img className="project-card__media-image" src={project.image} alt={`Aperçu du projet ${project.name}`} />
        ) : (
          <>
            <div className="project-card__media-grid" aria-hidden="true" />
            <span className="project-card__slot">{project.slot}</span>
            <span className="project-card__slot-note">Emplacement visuel</span>
          </>
        )}
        {project.link && <a className="project-card__media-link" href={project.link} target="_blank" rel="noreferrer" aria-label={`Ouvrir le projet ${project.name}`} />}
        
      </div>

      {project.link && (
        <a className="project-card__arrow" href={project.link} target="_blank" rel="noreferrer" aria-label={`Ouvrir le projet ${project.name}`}>
          ↗
        </a>
      )}

      <div className="project-card__bottom">
        <div>
          <p className="project-card__role">{project.role}</p>
          <h3>{project.name}</h3>
        </div>
        <p className="project-card__description">{project.description}</p>
      </div>

    </article>
  )
}

function Projects() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const activeDisplayIndexRef = useRef(middleOffset)
  const pauseUntilRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(middleOffset)

  const pauseAutoplay = () => {
    pauseUntilRef.current = Date.now() + 4500
  }

  const focusCardHorizontally = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const viewport = viewportRef.current
    const card = cardRefs.current[index]
    if (!viewport || !card) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const left = card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2
    viewport.scrollTo({ left, behavior: reducedMotion ? 'auto' : behavior })
  }

  const moveBy = (direction: -1 | 1, manual = true) => {
    let nextDisplayIndex = activeDisplayIndexRef.current + direction

    // Recentrer sur une copie identique avant de continuer dans la même direction.
    if (nextDisplayIndex <= 0 || nextDisplayIndex >= carouselProjects.length - 1) {
      const equivalentIndex = middleOffset + (activeDisplayIndexRef.current % projects.length)
      activeDisplayIndexRef.current = equivalentIndex
      setActiveDisplayIndex(equivalentIndex)
      focusCardHorizontally(equivalentIndex, 'auto')
      nextDisplayIndex = equivalentIndex + direction
    }

    const nextIndex = nextDisplayIndex % projects.length
    activeDisplayIndexRef.current = nextDisplayIndex
    if (manual) pauseAutoplay()
    setActiveIndex(nextIndex)
    setActiveDisplayIndex(nextDisplayIndex)
    focusCardHorizontally(nextDisplayIndex)
  }

  useEffect(() => {
    focusCardHorizontally(middleOffset, 'auto')
  }, [])

  useEffect(() => {
    const autoplay = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return
      moveBy(1, false)
    }, 6000)

    return () => window.clearInterval(autoplay)
  }, [])

  const handleViewportScroll = () => {
    const viewport = viewportRef.current
    if (!viewport) return

    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
    let closestDisplayIndex = activeDisplayIndexRef.current
    let closestDistance = Number.POSITIVE_INFINITY

    cardRefs.current.forEach((card, index) => {
      if (!card) return
      const bounds = card.getBoundingClientRect()
      const distance = Math.abs(bounds.left + bounds.width / 2 - viewportCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestDisplayIndex = index
      }
    })

    if (closestDisplayIndex >= carouselProjects.length - 1) {
      closestDisplayIndex = middleOffset + projects.length - 1
      activeDisplayIndexRef.current = closestDisplayIndex
      focusCardHorizontally(closestDisplayIndex, 'auto')
    }

    activeDisplayIndexRef.current = closestDisplayIndex
    setActiveDisplayIndex(closestDisplayIndex)
    const closestIndex = closestDisplayIndex % projects.length
    if (closestIndex !== activeIndex) setActiveIndex(closestIndex)
  }

  return (
    <section className="projects section" id="projets">
      <div className="section-kicker" data-reveal><span>02</span><span>Projets sélectionnés</span></div>
      <div className="projects__heading" data-reveal>
        <h2 className="section-title">Des projets<br /><em>qui prennent forme.</em></h2>
        <div className="projects__intro">
          <p>Trois entrées, trois façons de travailler. Les informations qui manquent restent volontairement ouvertes pour être complétées avec tes contenus.</p>
          <span className="projects__counter"><strong>0{activeIndex + 1}</strong> / 0{projects.length}</span>
        </div>
      </div>

      <div className="projects__carousel">
        <button type="button" className="projects__side-control projects__side-control--prev" onClick={() => moveBy(-1)} aria-label="Projet précédent">←</button>
        <div
          className="projects__viewport"
          ref={viewportRef}
          onScroll={handleViewportScroll}
          onPointerDown={pauseAutoplay}
          tabIndex={0}
          aria-label="Carrousel des projets"
        >
          <div className="projects-track">
            {carouselProjects.map((project, displayIndex) => {
              const distance = Math.min(2, Math.abs(displayIndex - activeDisplayIndex))
              return <div className={`projects-track__item projects-track__item--distance-${distance}`} key={`${project.number}-${displayIndex}`} ref={(element) => { cardRefs.current[displayIndex] = element }}><ProjectCard project={project} active={displayIndex === activeDisplayIndex} /></div>
            })}
          </div>
        </div>
        <button type="button" className="projects__side-control projects__side-control--next" onClick={() => moveBy(1)} aria-label="Projet suivant">→</button>
      </div>
    </section>
  )
}

export default Projects
