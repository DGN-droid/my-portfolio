import type { IconType } from 'react-icons'
import { FaJava } from 'react-icons/fa6'
import { LuBrainCircuit, LuCodeXml, LuDatabase, LuKeyRound, LuShieldCheck } from 'react-icons/lu'
import { TbBrandOpenai } from 'react-icons/tb'
import { SiAuth0, SiCss, SiFastapi, SiGo, SiGsap, SiHtml5, SiJavascript, SiJsonwebtokens, SiNestjs, SiNextdotjs, SiNodedotjs, SiPython, SiReact, SiRubyonrails, SiRuby, SiRust, SiSharp, SiTailwindcss, SiTensorflow, SiTypescript, SiWebgl } from 'react-icons/si'
import { useLanguage } from '../i18n'

const technologyIcons: Record<string, IconType> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Python: SiPython,
  Java: FaJava,
  'C#': SiSharp,
  C: LuCodeXml,
  Rust: SiRust,
  Go: SiGo,
  Ruby: SiRuby,
  HTML: SiHtml5,
  CSS: SiCss,
  HTML5: SiHtml5,
  CSS3: SiCss,
  React: SiReact,
  'Next.js': SiNextdotjs,
  'Tailwind CSS': SiTailwindcss,
  GSAP: SiGsap,
  'WebGL / 3D': SiWebgl,
  'Node.js': SiNodedotjs,
  NestJS: SiNestjs,
  FastAPI: SiFastapi,
  'Ruby on Rails': SiRubyonrails,
  'REST APIs': LuCodeXml,
  'Machine Learning': SiTensorflow,
  'AI Integration': TbBrandOpenai,
  'Data Processing': LuDatabase,
  Automation: LuBrainCircuit,
  'Application Security': LuShieldCheck,
  'Data Security': LuShieldCheck,
  Cryptography: LuKeyRound,
  MFA: LuShieldCheck,
  JWT: SiJsonwebtokens,
  Authentication: SiAuth0,
  Authorization: LuShieldCheck,
  'API Security': LuShieldCheck,
  'Access Control': LuShieldCheck,
  Hashing: LuKeyRound,
  Encryption: LuKeyRound,
  'Digital Signatures': LuKeyRound,
  Blockchain: LuCodeXml,
  'Smart Contracts': LuCodeXml,
}

function Stack() {
  const { copy } = useLanguage()

  return (
    <section className="stack section" id="stack">
      <div className="section-kicker" data-reveal><span>03</span><span>{copy.stack.kicker}</span></div>
      <h2 className="section-title stack__title" data-reveal>{copy.stack.titleLead} <em>{copy.stack.titleAccent}</em></h2>
      <div className="stack-grid">
        {copy.stack.groups.map((group) => (
          <article className="stack-group" key={group.number} data-reveal>
            <div className="stack-group__top">
              <span>{group.number}</span>
              <span>{group.title}</span>
            </div>
            <div className="stack-group__items">
              {group.items.map((item) => {
                const Icon = technologyIcons[item] ?? LuCodeXml
                return <span key={item}><Icon aria-hidden="true" focusable="false" />{item}</span>
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Stack
