import { useState } from 'react'

const links = [
  { label: 'Profil', href: '#profil' },
  { label: 'Stack', href: '#stack' },
  { label: 'Projets', href: '#projets' },
  { label: 'Contact', href: '#contact' },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Retour en haut">
        <span className="brand__mark">C</span>
        <span>DANGNIVO STEFAN</span>
      </a>

      <nav className={isOpen ? 'site-nav site-nav--open' : 'site-nav'} aria-label="Navigation principale">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>{link.label}</a>
        ))}
      </nav>

      <button className="menu-toggle" type="button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label="Ouvrir le menu">
        <span />
        <span />
      </button>
    </header>
  )
}

export default Header
