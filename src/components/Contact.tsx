import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import ContactBird from './ContactBird'
import ContactProfile from './ContactProfile'

type ContactFields = {
  name: string
  email: string
  message: string
}

const initialFields: ContactFields = { name: '', email: '', message: '' }

function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [fields, setFields] = useState<ContactFields>(initialFields)
  const [birdTarget, setBirdTarget] = useState<string | null>('contact-name')
  const [status, setStatus] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFields((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const subject = `Contact portfolio — ${fields.name}`
    const body = `Nom : ${fields.name}\nEmail : ${fields.email}\n\n${fields.message}`
    setStatus('Ouverture de votre messagerie…')
    window.location.href = `mailto:cafudang@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="contact section" id="contact">
      <div className="section-kicker" data-reveal><span>04</span><span>Contact</span></div>
      <div className="contact__heading" data-reveal>
        <h2 className="section-title">Parlons d’un <em>projet.</em></h2>
        <p>Une idée, une interface ou une expérience interactive à construire ?</p>
      </div>

      <div className="contact__layout" ref={sceneRef}>
        <ContactBird containerRef={sceneRef} targetId={birdTarget} />
        <form className="contact__form" ref={formRef} onSubmit={handleSubmit} data-reveal>
          <label className="contact__field" htmlFor="contact-name" onMouseEnter={() => setBirdTarget('contact-name')}>
            <span>Nom</span>
            <input id="contact-name" name="name" type="text" value={fields.name} onChange={handleChange} onFocus={() => setBirdTarget('contact-name')} placeholder=" " required />
          </label>
          <label className="contact__field" htmlFor="contact-email" onMouseEnter={() => setBirdTarget('contact-email')}>
            <span>Email</span>
            <input id="contact-email" name="email" type="email" value={fields.email} onChange={handleChange} onFocus={() => setBirdTarget('contact-email')} placeholder=" " required />
          </label>
          <label className="contact__field" htmlFor="contact-message" onMouseEnter={() => setBirdTarget('contact-message')}>
            <span>Message</span>
            <textarea id="contact-message" name="message" value={fields.message} onChange={handleChange} onFocus={() => setBirdTarget('contact-message')} placeholder=" " rows={5} required />
          </label>
          <button className="contact__submit" type="submit">Envoyer le message <span>↗</span></button>
          <p className="contact__status" aria-live="polite">{status}</p>
        </form>

        <div className="contact__visual">
          <ContactProfile />
          <span className="contact__visual-note">DANGNIVO STEFAN / DISPONIBLE</span>
          <a className="contact__model-credit" href="https://sketchfab.com/3d-models/low-poly-parrot-aac71bed4a784536964748569dcf1537" target="_blank" rel="noreferrer">Modèle 3D : Ceyhun / Sketchfab</a>
        </div>
      </div>
    </section>
  )
}

export default Contact
