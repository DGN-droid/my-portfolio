import { useState } from 'react'

function ContactProfile() {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <button
      className={`contact-profile${isFlipped ? ' contact-profile--flipped' : ''}`}
      type="button"
      aria-label="Retourner la photo de profil"
      onClick={() => setIsFlipped((current) => !current)}
    >
      <span className="contact-profile__inner">
        <span className="contact-profile__face contact-profile__face--front">
          <img src="/projects/img5.jpeg" alt="Portrait de DANGNIVO STEFAN" />
          <span className="contact-profile__label">DANGNIVO STEFAN / PROFIL</span>
        </span>
        <span className="contact-profile__face contact-profile__face--back" aria-hidden="true">
          <img src="/projects/img4.jpeg" alt="" />
          <span className="contact-profile__label">DESIGN / CODE / IA</span>
        </span>
      </span>
    </button>
  )
}

export default ContactProfile
