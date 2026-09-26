import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { useLanguage } from '../i18n'
import ContactProfile from './ContactProfile'

type ContactFields = {
  name: string
  email: string
  message: string
}

const initialFields: ContactFields = { name: '', email: '', message: '' }

function Contact() {
  const { copy } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const [fields, setFields] = useState<ContactFields>(initialFields)
  const [status, setStatus] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFields((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const subject = `${copy.contact.titleLead} ${copy.contact.titleAccent} — ${fields.name}`
    const body = `${copy.contact.name} : ${fields.name}\n${copy.contact.email} : ${fields.email}\n\n${fields.message}`
    setStatus(copy.contact.openingMail)
    window.location.href = `mailto:cafudang@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="contact section" id="contact">
      <div className="section-kicker" data-reveal><span>04</span><span>{copy.contact.kicker}</span></div>
      <div className="contact__heading" data-reveal>
        <h2 className="section-title">{copy.contact.titleLead} <em>{copy.contact.titleAccent}</em></h2>
        <p>{copy.contact.intro}</p>
      </div>

      <div className="contact__layout">
        <form className="contact__form" ref={formRef} onSubmit={handleSubmit} data-reveal>
          <label className="contact__field" htmlFor="contact-name">
            <span>{copy.contact.name}</span>
            <input id="contact-name" name="name" type="text" value={fields.name} onChange={handleChange} placeholder=" " required />
          </label>
          <label className="contact__field" htmlFor="contact-email">
            <span>{copy.contact.email}</span>
            <input id="contact-email" name="email" type="email" value={fields.email} onChange={handleChange} placeholder=" " required />
          </label>
          <label className="contact__field" htmlFor="contact-message">
            <span>{copy.contact.message}</span>
            <textarea id="contact-message" name="message" value={fields.message} onChange={handleChange} placeholder=" " rows={5} required />
          </label>
          <button className="contact__submit" type="submit">{copy.contact.send} <span>↗︎</span></button>
          <p className="contact__status" aria-live="polite">{status}</p>
        </form>

        <div className="contact__visual">
          <ContactProfile />
          <span className="contact__visual-note">{copy.contact.visualNote}</span>
          <a className="contact__model-credit" href="https://sketchfab.com/3d-models/low-poly-parrot-aac71bed4a784536964748569dcf1537" target="_blank" rel="noreferrer">{copy.contact.modelCredit}</a>
        </div>
      </div>
    </section>
  )
}

export default Contact
