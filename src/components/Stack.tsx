type StackGroup = {
  number: string
  title: string
  items: string[]
}

const stackGroups: StackGroup[] = [
  {
    number: '01',
    title: 'Langages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C', 'Rust', 'Go', 'Ruby', 'HTML', 'CSS'],
  },
  {
    number: '02',
    title: 'Front-end & interactif',
    items: ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'GSAP', 'WebGL / 3D'],
  },
  {
    number: '03',
    title: 'Backend & API',
    items: ['Node.js', 'NestJS', 'FastAPI', 'Ruby on Rails', 'REST APIs'],
  },
  {
    number: '04',
    title: 'IA & Data',
    items: ['Python', 'Machine Learning', 'AI Integration', 'Data Processing', 'Automation'],
  },
  {
    number: '05',
    title: 'Sécurité & cryptographie',
    items: ['Application Security', 'Data Security', 'Cryptography', 'MFA', 'JWT', 'Authentication', 'Authorization', 'API Security', 'Access Control', 'Hashing', 'Encryption', 'Digital Signatures'],
  },
  {
    number: '06',
    title: 'Blockchain',
    items: ['Blockchain', 'Smart Contracts'],
  },
]

function Stack() {
  return (
    <section className="stack section" id="stack">
      <div className="section-kicker" data-reveal><span>03</span><span>Stack technique</span></div>
      <h2 className="section-title stack__title" data-reveal>Code <em>&amp; technologies.</em></h2>
      <div className="stack-grid">
        {stackGroups.map((group) => (
          <article className="stack-group" key={group.number} data-reveal>
            <div className="stack-group__top">
              <span>{group.number}</span>
              <span>{group.title}</span>
            </div>
            <div className="stack-group__items">
              {group.items.map((item) => <span key={item}>{item}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Stack
