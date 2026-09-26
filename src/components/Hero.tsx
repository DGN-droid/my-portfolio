import HeroParticles3D from './HeroParticles3D'

function Hero() {
  return (
    <section className="hero" id="top">
      <HeroParticles3D />
      <div className="hero__content">
        <p className="eyebrow hero__eyebrow">Développeur web · Designer d’interfaces · IA · Sécurité applicative</p>
        <h1 className="hero__title">
          <span className="line-mask"><span className="line-inner">Des interfaces</span></span>
          <span className="line-mask"><span className="line-inner hero__title--accent">qui ont du rythme.</span></span>
        </h1>
        <div className="hero__bottom">
          <p className="hero__intro">Je construis des produits numériques complets, de leur identité visuelle jusqu’à leur architecture technique.</p>
        </div>
      </div>
      <div className="hero__aside" aria-hidden="true">
        <span>01—04</span>
        <span className="hero__aside-line" />
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}

export default Hero
