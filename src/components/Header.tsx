import { useState } from 'react'
import { useLanguage } from '../i18n'

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, copy } = useLanguage()
  const links = [
    { label: copy.header.nav[0], href: '#profil' },
    { label: copy.header.nav[1], href: '#stack' },
    { label: copy.header.nav[2], href: '#projets' },
    { label: copy.header.nav[3], href: '#contact' },
  ]

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label={copy.header.backToTop}>
        <span className="brand__mark">C</span>
        <span>DANGNIVO STEFAN</span>
      </a>

      <nav className={isOpen ? 'site-nav site-nav--open' : 'site-nav'} aria-label={copy.header.navigation}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>{link.label}</a>
        ))}
        <div className="language-switcher" role="group" aria-label={copy.header.language}>
          <button type="button" className={language === 'fr' ? 'language-switcher__active' : ''} aria-pressed={language === 'fr'} onClick={() => setLanguage('fr')}>FR</button>
          <span>/</span>
          <button type="button" className={language === 'en' ? 'language-switcher__active' : ''} aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
        </div>
      </nav>

      <div className="header-actions">
        <button className="menu-toggle" type="button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label={isOpen ? copy.header.closeMenu : copy.header.openMenu}>
        <span />
        <span />
        </button>
      </div>
    </header>
  )
}

export default Header
