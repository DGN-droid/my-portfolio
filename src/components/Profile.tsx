import { useLanguage } from '../i18n'

function Profile() {
  const { copy } = useLanguage()

  return (
    <section className="profile section" id="profil">
      <div className="section-kicker" data-reveal><span>01</span><span>{copy.profile.kicker}</span></div>
      <h2 className="section-title profile__title" data-reveal>{copy.profile.titleLead} <em>{copy.profile.titleAccent}</em></h2>
      <div className="profile__layout">
        <div className="profile__copy" data-reveal>
          <p className="profile__lead">{copy.profile.intro}</p>
          <p className="profile__domains">{copy.profile.domains}</p>
          <div className="principles">
            {copy.profile.principles.map((principle, index) => <span key={principle}><small>0{index + 1}</small>{principle}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
