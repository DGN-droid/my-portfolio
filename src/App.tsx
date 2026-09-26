import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header'
import Hero from './components/Hero'
import Profile from './components/Profile'
import Stack from './components/Stack'
import Projects from './components/Projects'
import Contact from './components/Contact'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const appRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
      intro
        .to('.page-loader__line', { scaleX: 1, duration: 0.75 })
        .to('.page-loader', { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut' }, '+=0.15')
        .from('.site-header', { y: -24, opacity: 0, duration: 0.7 }, '-=0.35')

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 84%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('.focus-card').forEach((card, index) => {
        gsap.from(card, {
          y: 70,
          rotate: index % 2 === 0 ? -2 : 2,
          opacity: 0,
          duration: 0.9,
          delay: index * 0.08,
          ease: 'power4.out',
          scrollTrigger: { trigger: card, start: 'top 86%', once: true },
        })
      })

    }, appRef)

    return () => context.revert()
  }, [])

  return (
    <div ref={appRef} className="app-shell">
      <div className="page-loader" aria-hidden="true">
        <span className="page-loader__label">DANGNIVO STEFAN / 2026</span>
        <span className="page-loader__line" />
      </div>
      <Header />
      <main>
        <Hero />
        <Profile />
        <Stack />
        <div className="ticker" aria-hidden="true">
          <div className="ticker__track">
            <div className="ticker__group">
              WEB DESIGN <span>✳</span> UI/UX <span>✳</span> SOFTWARE ENGINEERING <span>✳</span> IA APPLIQUÉE <span>✳</span> DATA <span>✳</span> CYBERSÉCURITÉ <span>✳</span> CRYPTOGRAPHIE <span>✳</span> 2D/3D
            </div>
            <div className="ticker__group" aria-hidden="true">
              WEB DESIGN <span>✳</span> UI/UX <span>✳</span> SOFTWARE ENGINEERING <span>✳</span> IA APPLIQUÉE <span>✳</span> DATA <span>✳</span> CYBERSÉCURITÉ <span>✳</span> CRYPTOGRAPHIE <span>✳</span> 2D/3D
            </div>
          </div>
        </div>
        <Projects />
        <Contact />
      </main>
      <footer className="site-footer">
        <p>Disponible pour les idées exigeantes.</p>
        <a href="mailto:hello@cafud.dev">hello@cafud.dev <span>↗</span></a>
      </footer>
    </div>
  )
}

export default App
