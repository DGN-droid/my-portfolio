import { useLanguage } from '../i18n'

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
              {group.items.map((item) => <span key={item}>{item}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Stack
