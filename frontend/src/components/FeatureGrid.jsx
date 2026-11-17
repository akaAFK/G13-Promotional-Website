import { Brain, Swords, Scale, Flame } from 'lucide-react';

const features = [
  { n:'01 / IMPACT', title:<>Dynamic<br/><em>Brutal Combat</em></>, text:'Break bones. Disable limbs. Turn a broken bottle, a loose brick, or the room itself into your next dirty trick.', Icon:Swords, size:'feature-large' },
  { n:'02 / RESPONSE', title:<>Adaptive<br/><em>Enemy AI</em></>, text:'Your habits become their survival guide. Keep aiming for the eyes and the next patrol may arrive wearing helmets.', Icon:Brain },
  { n:'03 / CONSEQUENCE', title:<>Unforgiving<br/><em>Morality</em></>, text:'Beat, execute, or knock them out. Every decision leaves a mark on the people around you.', Icon:Scale },
  { n:'04 / DESCENT', title:<>Magepunk &amp;<br/><em>Steampunk Depths</em></>, text:'A cavernous sanctuary of refugees, steam machinery, ancient magic, and people who call the dark home.', Icon:Flame, size:'feature-wide' }
];

export default function FeatureGrid() {
  return (
    <section className="section world-section" id="world">
      <div className="section-heading">
        <div><div className="eyebrow"><span className="eyebrow-line"/> THE RULES ARE WRITTEN IN BLOOD</div>
          <h2>THE WORLD<br/><em>BITES BACK.</em></h2></div>
        <p className="section-intro">There are no clean fights beneath the surface. Every room is a weapon, every enemy a lesson, and every choice leaves a mark.</p>
      </div>
      <div className="feature-grid">
        {features.map(({n,title,text,Icon,size=''}) => (
          <article className={`feature-card ${size}`} key={n}>
            <div className="feature-top"><span className="feature-number">{n}</span><Icon className="feature-symbol" size={22}/></div>
            <div className="feature-art"><span className="feature-orbit"/><Icon size={66} strokeWidth={1} /></div>
            <div className="feature-copy"><h3>{title}</h3><p>{text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
