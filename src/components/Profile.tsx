const principles = ['Direction artistique', 'Architecture évolutive', 'Sécurité par conception']

function Profile() {
  return (
    <section className="profile section" id="profil">
      <div className="section-kicker" data-reveal><span>01</span><span>Le profil</span></div>
      <h2 className="section-title profile__title" data-reveal>Design, <em>technique & intelligence.</em></h2>
      <div className="profile__layout">
        <div className="profile__copy" data-reveal>
          <p className="profile__lead">Je conçois et développe des expériences numériques où design, technologie, intelligence artificielle et sécurité avancent ensemble. Mon travail ne se limite pas à créer des interfaces web : je construis des produits numériques complets, de leur identité visuelle jusqu’à leur architecture technique.</p>
          <p>J’interviens sur la direction artistique, le design d’interfaces et le développement front-end, avec une attention particulière portée à l’expérience utilisateur et au mouvement. Je conçois des interfaces interactives, des expériences immersives ainsi que des animations 2D et 3D, en combinant développement, motion design et technologies web modernes.</p>
          <p>Côté ingénierie, je travaille également sur la conception d’architectures logicielles et applicatives, la structuration des données, les API, les systèmes d’authentification, la gestion des rôles et des permissions ainsi que la conception de solutions pensées pour évoluer.</p>
          <p>L’intelligence artificielle constitue également l’un de mes principaux terrains d’exploration. Je peux concevoir et intégrer des systèmes capables d’apprendre à partir de données, d’automatiser des processus, d’analyser des informations ou encore d’interagir avec une application et ses utilisateurs.</p>
          <p>La cybersécurité occupe une place importante dans ma manière de concevoir ces systèmes. Je travaille particulièrement sur la sécurité applicative et la protection des données : authentification multifacteur, gestion des identités et des accès, contrôle des autorisations, sécurisation des échanges, protection des API, gestion des sessions et des tokens ainsi que conception d’architectures intégrant la sécurité dès leur création.</p>
          <p>Je travaille également avec la cryptographie appliquée : chiffrement et protection des données sensibles, fonctions de hachage, signatures numériques, gestion et vérification de l’intégrité des données, ainsi que mécanismes cryptographiques utilisés pour sécuriser les communications et les systèmes d’authentification.</p>
          <p>Je possède également des connaissances en sécurité des systèmes, même si mon approche est davantage orientée vers la sécurité des applications, des architectures et surtout des données.</p>
          <p>La data complète naturellement cet ensemble : structuration, traitement, exploitation et sécurisation des données, notamment lorsqu’elles servent de fondation à des applications intelligentes ou à des systèmes d’IA.</p>
          <p>Mon profil se situe ainsi à l’intersection de plusieurs disciplines :</p>
          <p className="profile__domains">Software Engineering & Architecture · Web Development · UI/UX & Creative Development · Artificial Intelligence · Data · Cybersecurity · Cryptography · 2D/3D & Interactive Experiences</p>
          <div className="principles">
            {principles.map((principle, index) => <span key={principle}><small>0{index + 1}</small>{principle}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
