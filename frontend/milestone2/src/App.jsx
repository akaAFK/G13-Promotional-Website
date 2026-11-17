import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const characters = [
  { name: 'THE CAPTAIN', role: 'THE LAST COMMAND', number: '01', quote: 'A leader is only as good as the orders he survives.', color: '#a63b2c', bio: 'A veteran who carries the weight of a broken company. Every decision costs him something.' },
  { name: 'TIM', role: 'THE RUNNER', number: '02', quote: 'If it can be outrun, it can be outlived.', color: '#b8793c', bio: 'Fast, sharp, and always one step ahead of the thing hunting him.' },
  { name: 'PISTACHIO', role: 'THE WILDCARD', number: '03', quote: 'Never trust a quiet machine.', color: '#6f8153', bio: 'An unpredictable survivor with a talent for turning scrap into trouble.' },
  { name: 'KEVIN', role: 'THE FIXER', number: '04', quote: 'Everything has a weak point. Everything.', color: '#6f7788', bio: 'A practical mind in an impractical world. He knows where to strike.' },
  { name: 'PETE', role: 'THE HEAVY', number: '05', quote: 'Some doors are not meant to stay closed.', color: '#8a5140', bio: 'A wall of muscle who makes sure the rest of the crew gets through.' },
  { name: 'GRANDMA DUSYA', role: 'THE MATRIARCH', number: '06', quote: 'Behave. Or I will make you.', color: '#a18b68', bio: 'The oldest voice in the shelter — and possibly the most dangerous.' },
];

const mechanics = [
  { id: 'impact', label: 'IMPACT', title: 'BREAK THEIR RHYTHM', text: 'Heavy strikes interrupt enemy attacks and create a short opening for a counter.', move: 'Crushing blow', effect: 'Enemy staggered', stat: 'HIGH IMPACT' },
  { id: 'precision', label: 'PRECISION', title: 'FIND THE WEAK POINT', text: 'Target exposed body parts to reduce enemy accuracy, mobility, or stamina.', move: 'Targeted strike', effect: 'Enemy accuracy reduced', stat: 'HIGH CONTROL' },
  { id: 'dirty', label: 'DIRTY TRICKS', title: 'SURVIVE BY ANY MEANS', text: 'Use the environment, feints, and improvised tools. There are no clean fights underground.', move: 'Environmental trap', effect: 'Enemy guard broken', stat: 'HIGH RISK' },
];

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><a className="brand" href="#top">G<span>13</span><i>®</i></a>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? '✕' : '☰'}</button>
    <nav className={open ? 'nav open' : 'nav'}>{[['WORLD','world'],['CREW','crew'],['COMBAT','combat']].map(([label,id]) => <a key={id} href={'#'+id} onClick={()=>setOpen(false)}>{label}</a>)}<a className="nav-cta" href="#combat" onClick={()=>setOpen(false)}>ENTER THE HOLLOW ↗</a></nav>
  </header>;
}

function CharacterSlider() {
  const [index, setIndex] = useState(0);
  const current = characters[index];
  const move = (dir) => setIndex((index + dir + characters.length) % characters.length);
  return <section id="crew" className="section crew-section">
    <div className="section-kicker">02 / THE SURVIVORS</div><div className="section-heading"><h2>MEET THE <em>CREW.</em></h2><p>Six souls. One shelter. No guarantees.</p></div>
    <div className="character-slider">
      <button className="arrow prev" onClick={()=>move(-1)} aria-label="Previous character">←</button>
      <div className="character-stage">
        <AnimatePresence mode="wait">
          <motion.div key={current.number} className="character-card" initial={{opacity:0,x:45}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-45}} transition={{duration:.28}} drag="x" dragConstraints={{left:0,right:0}} onDragEnd={(_,info)=>{if(info.offset.x < -55)move(1);if(info.offset.x > 55)move(-1);}}>
            <div className="character-art" style={{'--character':current.color}}><span className="character-number">{current.number} / 06</span><div className="sigil">G13</div><div className="art-caption">FIELD RECORD // CLASSIFIED</div></div>
            <div className="character-info"><span className="eyebrow">{current.role}</span><h3>{current.name}</h3><blockquote>“{current.quote}”</blockquote><p>{current.bio}</p></div>
          </motion.div>
        </AnimatePresence>
      </div>
      <button className="arrow next" onClick={()=>move(1)} aria-label="Next character">→</button>
    </div>
    <div className="slider-footer"><span>PERSONNEL FILES</span><div className="dots">{characters.map((c,i)=><button key={c.number} className={i===index?'active':''} onClick={()=>setIndex(i)} aria-label={'Show '+c.name}/>)}</div><span>{String(index+1).padStart(2,'0')} — 06</span></div>
  </section>;
}

function CombatConfigurator() {
  const [active, setActive] = useState('impact');
  const [intensity, setIntensity] = useState(55);
  const [weapon, setWeapon] = useState('Bare hands');
  const [status, setStatus] = useState('');
  const selected = mechanics.find(m=>m.id===active);
  async function runSimulation() {
    const event = { type:'combat_simulation', mechanic:active, intensity, weapon, createdAt:new Date().toISOString() };
    try {
      const response = await fetch('/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event)});
      if(!response.ok) throw new Error('API unavailable');
      setStatus('EVENT SENT TO /events — SIMULATION RECORDED');
    } catch {
      const queue = JSON.parse(localStorage.getItem('g13-events') || '[]');
      queue.push(event); localStorage.setItem('g13-events',JSON.stringify(queue));
      setStatus('DEMO MODE — EVENT SAVED LOCALLY. CONNECT BACKEND TO ENABLE /events.');
    }
  }
  return <section id="combat" className="section combat-section">
    <div className="section-kicker">03 / THE ART OF SURVIVAL</div><div className="section-heading"><h2>NO FAIR <em>FIGHTS.</em></h2><p>Choose your method. See what survives.</p></div>
    <div className="combat-layout"><div className="mechanic-tabs">{mechanics.map(m=><button key={m.id} className={active===m.id?'selected':''} onClick={()=>setActive(m.id)}><span>{m.id==='impact'?'01':m.id==='precision'?'02':'03'}</span>{m.label}<b>↗</b></button>)}</div>
      <motion.div key={active} className="combat-panel" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><div className="panel-top"><span>COMBAT PROTOCOL / {selected.id.toUpperCase()}</span><span className="live-dot">● SIMULATION READY</span></div><h3>{selected.title}</h3><p>{selected.text}</p><div className="simulation-result"><div><small>SELECTED MOVE</small><strong>{selected.move}</strong></div><div><small>EXPECTED RESULT</small><strong>{selected.effect}</strong></div><div><small>PROFILE</small><strong>{selected.stat}</strong></div></div>
        <label className="control-label" htmlFor="weapon">LOADOUT</label><select id="weapon" value={weapon} onChange={e=>setWeapon(e.target.value)}><option>Bare hands</option><option>Scrap gauntlet</option><option>Industrial hammer</option><option>Improvised tool</option></select>
        <label className="control-label" htmlFor="intensity">COMBAT INTENSITY <b>{intensity}%</b></label><input id="intensity" type="range" min="10" max="100" value={intensity} onChange={e=>setIntensity(Number(e.target.value))}/><div className="range-labels"><span>CONTROLLED</span><span>BRUTAL</span></div>
        <button className="primary-button" onClick={runSimulation}>RUN COMBAT SIMULATION ↗</button>{status&&<p className="event-status" role="status">{status}</p>}
      </motion.div></div>
  </section>;
}

function App() {
  return <><Header/><main id="top"><section className="hero"><div className="hero-grid"></div><div className="hero-content"><div className="hero-kicker"><span></span> AN ORIGINAL DARK FANTASY EXPERIENCE</div><h1>NO SAINTS.<br/><em>NO MERCY.</em><br/>NO WAY BACK.</h1><p className="hero-copy">Beneath a dead world, survival is not a virtue.<br/>It is the only rule that still matters.</p><div className="hero-actions"><a className="primary-button" href="#world">DISCOVER THE WORLD ↗</a><a className="text-link" href="#crew">MEET THE CREW <span>↓</span></a></div><div className="hero-meta"><span>PC / ACTION / FIRST-PERSON</span><span>PROJECT G13 — CLASSIFIED</span></div></div><div className="hero-stamp">13<br/><small>NO WAY<br/>BACK</small></div></section>
    <section id="world" className="section world-section"><div className="section-kicker">01 / THE WORLD BELOW</div><div className="world-grid"><h2>THE SURFACE<br/>IS <em>LOST.</em></h2><div><p className="world-lead">The last refuge is buried deep inside a colossal cavern. Beyond its gates lies a world that forgot humanity.</p><p className="muted">Steel, smoke, and unstable magic shape what remains. Your crew must venture upward, face what waits in the ruins, and bring back whatever keeps the shelter alive.</p></div></div><div className="feature-grid"><article><span>01 — COMBAT</span><h3>BRUTAL BY DESIGN</h3><p>Close-quarters encounters built around timing, impact, and improvisation.</p></article><article><span>02 — ENEMIES</span><h3>THEY ADAPT</h3><p>Enemy reactions shift as you disrupt their movement and attack patterns.</p></article><article><span>03 — CONSEQUENCE</span><h3>EVERY HIT MATTERS</h3><p>Damage changes the flow of a fight. Openings are earned, never given.</p></article></div></section>
    <CharacterSlider/><CombatConfigurator/>
    <footer className="footer"><a className="brand" href="#top">G<span>13</span><i>®</i></a><p>NO SAINTS. NO MERCY. NO WAY BACK.</p><span>© 2026 PROJECT G13 — CONCEPT DEMO</span></footer>
  </main></>;
}
export default App;
