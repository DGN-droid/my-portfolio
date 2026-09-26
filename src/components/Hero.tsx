import { useLanguage } from '../i18n'
import HeroParticles3D from './HeroParticles3D'

function Hero() {
  const { copy } = useLanguage()

  return (
    <section className="hero" id="top">
      <HeroParticles3D />
      <div className="hero__content">
        <p className="eyebrow hero__eyebrow">{copy.hero.eyebrow}</p>
        <h1 className="hero__title">
          <span className="line-mask"><span className="line-inner">{copy.hero.lineOne}</span></span>
          <span className="line-mask"><span className="line-inner hero__title--accent">{copy.hero.lineTwo}</span></span>
        </h1>
        <div className="hero__bottom">
          <p className="hero__intro">{copy.hero.intro}</p>
        </div>
      </div>
      <div className="hero__aside" aria-hidden="true">
        <span>{copy.hero.asideTop}</span>
        <span className="hero__aside-line" />
        <span>{copy.hero.asideBottom}</span>
      </div>
    </section>
  )
}

export default Hero
