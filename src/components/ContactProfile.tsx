import { useState } from 'react'
import { useLanguage } from '../i18n'

function ContactProfile() {
  const { copy } = useLanguage()
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <button
      className={`contact-profile${isFlipped ? ' contact-profile--flipped' : ''}`}
      type="button"
      aria-label={copy.contact.cardAria}
      onClick={() => setIsFlipped((current) => !current)}
    >
      <span className="contact-profile__inner">
        <span className="contact-profile__face contact-profile__face--front">
          <img src="/projects/img5.jpeg" alt={copy.contact.portraitAlt} />
          <span className="contact-profile__label">{copy.contact.frontLabel}</span>
        </span>
        <span className="contact-profile__face contact-profile__face--back" aria-hidden="true">
          <img src="/projects/img4.jpeg" alt="" />
          <span className="contact-profile__label">{copy.contact.backLabel}</span>
        </span>
      </span>
    </button>
  )
}

export default ContactProfile
