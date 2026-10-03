import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export type Language = 'fr' | 'en'

export type ProjectTranslation = {
  number: string
  name: string
  type: string
  role: string
  description: string
  slot: string
}

type SiteCopy = {
  header: {
    nav: string[]
    backToTop: string
    navigation: string
    openMenu: string
    closeMenu: string
    language: string
  }
  hero: {
    eyebrow: string
    lineOne: string
    lineTwo: string
    intro: string
    asideTop: string
    asideBottom: string
  }
  profile: {
    kicker: string
    titleLead: string
    titleAccent: string
    intro: string
    paragraphs: string[]
    domains: string
    principles: string[]
  }
  stack: {
    kicker: string
    titleLead: string
    titleAccent: string
    groups: Array<{ number: string; title: string; items: string[] }>
  }
  ticker: string[]
  projects: {
    kicker: string
    titleLead: string
    titleAccent: string
    intro: string
    previous: string
    next: string
    carouselLabel: string
    openProject: string
    visualLocation: string
    items: ProjectTranslation[]
  }
  contact: {
    kicker: string
    titleLead: string
    titleAccent: string
    intro: string
    name: string
    email: string
    message: string
    send: string
    openingMail: string
    visualNote: string
    modelCredit: string
    cardAria: string
    portraitAlt: string
    frontLabel: string
    backLabel: string
  }
  footer: string
}

export const translations: Record<Language, SiteCopy> = {
  fr: {
    header: {
      nav: ['Profil', 'Stack', 'Projets', 'Contact'],
      backToTop: 'Retour en haut',
      navigation: 'Navigation principale',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      language: 'Changer de langue',
    },
    hero: {
      eyebrow: 'Développeur web · Designer d’interfaces · IA · Sécurité applicative',
      lineOne: 'Des interfaces',
      lineTwo: 'qui ont du rythme.',
      intro: 'Je construis des produits numériques complets, de leur identité visuelle jusqu’à leur architecture technique.',
      asideTop: '01—04',
      asideBottom: 'Faire défiler pour explorer',
    },
    profile: {
      kicker: 'Le profil',
      titleLead: 'Design,',
      titleAccent: 'technique & intelligence.',
      intro: 'Je suis DANGNIVO STEFAN, étudiant en informatique et passionné par la conception de produits numériques. Je travaille à l’intersection du design d’interfaces, du développement web, de l’intelligence artificielle, de la data et de la cybersécurité. J’aime transformer des idées en expériences interactives, modernes et accessibles, tout en construisant des architectures fiables, évolutives et sécurisées. Curieux et polyvalent, j’explore également les animations 2D/3D, le motion design, les API, l’authentification et la protection des données.',
      paragraphs: [
        'Je conçois et développe des expériences numériques où design, technologie, intelligence artificielle et sécurité avancent ensemble. Mon travail ne se limite pas à créer des interfaces web : je construis des produits numériques complets, de leur identité visuelle jusqu’à leur architecture technique.',
        'J’interviens sur la direction artistique, le design d’interfaces et le développement front-end, avec une attention particulière portée à l’expérience utilisateur et au mouvement. Je conçois des interfaces interactives, des expériences immersives ainsi que des animations 2D et 3D, en combinant développement, motion design et technologies web modernes.',
        'Côté ingénierie, je travaille également sur la conception d’architectures logicielles et applicatives, la structuration des données, les API, les systèmes d’authentification, la gestion des rôles et des permissions ainsi que la conception de solutions pensées pour évoluer.',
        'L’intelligence artificielle constitue également l’un de mes principaux terrains d’exploration. Je peux concevoir et intégrer des systèmes capables d’apprendre à partir de données, d’automatiser des processus, d’analyser des informations ou encore d’interagir avec une application et ses utilisateurs.',
        'La cybersécurité occupe une place importante dans ma manière de concevoir ces systèmes. Je travaille particulièrement sur la sécurité applicative et la protection des données : authentification multifacteur, gestion des identités et des accès, contrôle des autorisations, sécurisation des échanges, protection des API, gestion des sessions et des tokens ainsi que conception d’architectures intégrant la sécurité dès leur création.',
        'Je travaille également avec la cryptographie appliquée : chiffrement et protection des données sensibles, fonctions de hachage, signatures numériques, gestion et vérification de l’intégrité des données, ainsi que mécanismes cryptographiques utilisés pour sécuriser les communications et les systèmes d’authentification.',
        'Je possède également des connaissances en sécurité des systèmes, même si mon approche est davantage orientée vers la sécurité des applications, des architectures et surtout des données.',
        'La data complète naturellement cet ensemble : structuration, traitement, exploitation et sécurisation des données, notamment lorsqu’elles servent de fondation à des applications intelligentes ou à des systèmes d’IA.',
        'Mon profil se situe ainsi à l’intersection de plusieurs disciplines :',
      ],
      domains: 'Software Engineering & Architecture · Web Development · UI/UX & Creative Development · Artificial Intelligence · Data · Cybersecurity · Cryptography · 2D/3D & Interactive Experiences',
      principles: ['Direction artistique', 'Architecture évolutive', 'Sécurité par conception'],
    },
    stack: {
      kicker: 'Stack technique',
      titleLead: 'Code',
      titleAccent: '& technologies.',
      groups: [
        { number: '01', title: 'Langages', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C', 'Rust', 'Go', 'Ruby', 'HTML', 'CSS'] },
        { number: '02', title: 'Front-end & interactif', items: ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'GSAP', 'WebGL / 3D'] },
        { number: '03', title: 'Backend & API', items: ['Node.js', 'NestJS', 'FastAPI', 'Ruby on Rails', 'REST APIs'] },
        { number: '04', title: 'IA & Data', items: ['Python', 'Machine Learning', 'AI Integration', 'Data Processing', 'Automation'] },
        { number: '05', title: 'Sécurité & cryptographie', items: ['Application Security', 'Data Security', 'Cryptography', 'MFA', 'JWT', 'Authentication', 'Authorization', 'API Security', 'Access Control', 'Hashing', 'Encryption', 'Digital Signatures'] },
        { number: '06', title: 'Blockchain', items: ['Blockchain', 'Smart Contracts'] },
      ],
    },
    ticker: ['WEB DESIGN', 'UI/UX', 'SOFTWARE ENGINEERING', 'IA APPLIQUÉE', 'DATA', 'CYBERSÉCURITÉ', 'CRYPTOGRAPHIE', '2D/3D'],
    projects: {
      kicker: 'Projets sélectionnés',
      titleLead: 'Des projets',
      titleAccent: 'qui prennent forme.',
      intro: 'Trois entrées, trois façons de travailler. Les informations qui manquent restent volontairement ouvertes pour être complétées avec tes contenus.',
      previous: 'Projet précédent',
      next: 'Projet suivant',
      carouselLabel: 'Carrousel des projets',
      openProject: 'Ouvrir le projet',
      visualLocation: 'Emplacement visuel',
      items: [
        { number: '01', name: 'IOKEO', type: 'Site web', role: 'Développement web', description: 'Une fiche prête à accueillir la présentation du site, le contexte de la mission et les choix d’interface.', slot: 'Ajouter une image IOKEO' },
        { number: '02', name: 'Ribbit', type: 'Tests QA', role: 'Tests QA', description: 'Un espace pour décrire la démarche de test, les parcours couverts et les éléments que tu souhaites documenter.', slot: 'Ajouter une image Ribbit' },
        { number: '03', name: 'Chronoswiss', type: 'Identité visuelle', role: 'Identité visuelle', description: 'Une scène dédiée à l’identité, aux supports et aux décisions graphiques du projet, sans extrapoler le périmètre réel.', slot: 'Ajouter une image Chronoswiss' },
      ],
    },
    contact: {
      kicker: 'Contact',
      titleLead: 'Parlons d’un',
      titleAccent: 'projet.',
      intro: 'Une idée, une interface ou une expérience interactive à construire ?',
      name: 'Nom',
      email: 'Email',
      message: 'Message',
      send: 'Envoyer le message',
      openingMail: 'Ouverture de votre messagerie…',
      visualNote: 'DANGNIVO STEFAN / DISPONIBLE',
      modelCredit: 'Modèle 3D : Ceyhun / Sketchfab',
      cardAria: 'Retourner la photo de profil',
      portraitAlt: 'Portrait de DANGNIVO STEFAN',
      frontLabel: 'DANGNIVO STEFAN / PROFIL',
      backLabel: 'DESIGN / CODE / IA',
    },
    footer: '© 2026 DANGNIVO STEFAN — Portfolio',
  },
  en: {
    header: {
      nav: ['Profile', 'Stack', 'Projects', 'Contact'],
      backToTop: 'Back to top',
      navigation: 'Main navigation',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      language: 'Change language',
    },
    hero: {
      eyebrow: 'Web developer · Interface designer · Applied AI · Application security',
      lineOne: 'Interfaces',
      lineTwo: 'with rhythm.',
      intro: 'I build complete digital products, from their visual identity to their technical architecture.',
      asideTop: '01—04',
      asideBottom: 'Scroll to explore',
    },
    profile: {
      kicker: 'The profile',
      titleLead: 'Design,',
      titleAccent: 'technology & intelligence.',
      intro: 'I am DANGNIVO STEFAN, a computer science student passionate about designing digital products. I work at the intersection of interface design, web development, artificial intelligence, data and cybersecurity. I enjoy turning ideas into interactive, modern and accessible experiences while building reliable, scalable and secure architectures. Curious and versatile, I also explore 2D/3D animation, motion design, APIs, authentication and data protection.',
      paragraphs: [
        'I design and develop digital experiences where design, technology, artificial intelligence and security move forward together. My work goes beyond creating web interfaces: I build complete digital products, from their visual identity to their technical architecture.',
        'I work across art direction, interface design and front-end development, with particular attention to user experience and motion. I create interactive interfaces, immersive experiences and 2D/3D animations by combining development, motion design and modern web technologies.',
        'On the engineering side, I also work on software and application architecture, data structuring, APIs, authentication systems, role and permission management, and solutions designed to evolve.',
        'Artificial intelligence is another major field of exploration for me. I can design and integrate systems that learn from data, automate processes, analyze information or interact with applications and their users.',
        'Cybersecurity plays an important role in how I design these systems. I focus on application security and data protection: multi-factor authentication, identity and access management, authorization controls, secure exchanges, API protection, session and token management, and architectures that integrate security from the start.',
        'I also work with applied cryptography: encryption and protection of sensitive data, hashing functions, digital signatures, data integrity verification and cryptographic mechanisms used to secure communications and authentication systems.',
        'I also have knowledge of systems security, although my approach is more focused on application security, architecture and especially data.',
        'Data naturally completes this set of skills: structuring, processing, using and securing data, especially when it forms the foundation of intelligent applications or AI systems.',
        'My profile sits at the intersection of several disciplines:',
      ],
      domains: 'Software Engineering & Architecture · Web Development · UI/UX & Creative Development · Artificial Intelligence · Data · Cybersecurity · Cryptography · 2D/3D & Interactive Experiences',
      principles: ['Art direction', 'Evolving architecture', 'Security by design'],
    },
    stack: {
      kicker: 'Technical stack',
      titleLead: 'Code',
      titleAccent: '& technologies.',
      groups: [
        { number: '01', title: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C', 'Rust', 'Go', 'Ruby', 'HTML', 'CSS'] },
        { number: '02', title: 'Front-end & interactive', items: ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'GSAP', 'WebGL / 3D'] },
        { number: '03', title: 'Backend & API', items: ['Node.js', 'NestJS', 'FastAPI', 'Ruby on Rails', 'REST APIs'] },
        { number: '04', title: 'AI & Data', items: ['Python', 'Machine Learning', 'AI Integration', 'Data Processing', 'Automation'] },
        { number: '05', title: 'Security & cryptography', items: ['Application Security', 'Data Security', 'Cryptography', 'MFA', 'JWT', 'Authentication', 'Authorization', 'API Security', 'Access Control', 'Hashing', 'Encryption', 'Digital Signatures'] },
        { number: '06', title: 'Blockchain', items: ['Blockchain', 'Smart Contracts'] },
      ],
    },
    ticker: ['WEB DESIGN', 'UI/UX', 'SOFTWARE ENGINEERING', 'APPLIED AI', 'DATA', 'CYBERSECURITY', 'CRYPTOGRAPHY', '2D/3D'],
    projects: {
      kicker: 'Selected projects',
      titleLead: 'Projects',
      titleAccent: 'taking shape.',
      intro: 'Three entries, three ways of working. Missing information is intentionally left open to be completed with your content.',
      previous: 'Previous project',
      next: 'Next project',
      carouselLabel: 'Project carousel',
      openProject: 'Open project',
      visualLocation: 'Visual placeholder',
      items: [
        { number: '01', name: 'IOKEO', type: 'Website', role: 'Web development', description: 'A space ready for the website presentation, project context and interface decisions.', slot: 'Add an IOKEO image' },
        { number: '02', name: 'Ribbit', type: 'QA testing', role: 'QA testing', description: 'A space to describe the testing approach, covered journeys and the elements you want to document.', slot: 'Add a Ribbit image' },
        { number: '03', name: 'Chronoswiss', type: 'Visual identity', role: 'Visual identity', description: 'A scene dedicated to the identity, assets and graphic decisions of the project, without expanding beyond its real scope.', slot: 'Add a Chronoswiss image' },
      ],
    },
    contact: {
      kicker: 'Contact',
      titleLead: 'Let’s discuss a',
      titleAccent: 'project.',
      intro: 'An idea, an interface or an interactive experience to build?',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send message',
      openingMail: 'Opening your mail app…',
      visualNote: 'DANGNIVO STEFAN / AVAILABLE',
      modelCredit: '3D model: Ceyhun / Sketchfab',
      cardAria: 'Flip the profile photo',
      portraitAlt: 'Portrait of DANGNIVO STEFAN',
      frontLabel: 'DANGNIVO STEFAN / PROFILE',
      backLabel: 'DESIGN / CODE / AI',
    },
    footer: '© 2026 DANGNIVO STEFAN — Portfolio',
  },
}

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  copy: SiteCopy
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'fr'
  return window.localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'fr'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    window.localStorage.setItem('portfolio-language', language)
    document.documentElement.lang = language
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage, copy: translations[language] }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
