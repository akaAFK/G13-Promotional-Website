import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import FeatureGrid from './components/FeatureGrid.jsx';
import CharacterSlider from './components/CharacterSlider.jsx';
import CombatConfigurator from './components/CombatConfigurator.jsx';

export default function App() {
  const [email,setEmail] = useState('');
  const [joined,setJoined] = useState(false);
  return (
    <div className="app-shell">
      <div className="site-noise" aria-hidden="true"/>
      <Navbar/>
      <main>
        <Hero/>
        <div className="intro-strip">
          <div className="intro-stat"><strong>01</strong><span>ONE BRUTAL<br/>WORLD</span></div>
          <div className="intro-stat"><strong>06</strong><span>UNLIKELY<br/>ALLIES</span></div>
          <div className="intro-stat"><strong>∞</strong><span>WAYS TO<br/>SURVIVE</span></div>
          <div className="intro-statement">A WORLD THAT <em>LEARNS</em> HOW YOU KILL.</div>
        </div>
        <FeatureGrid/>
        <CharacterSlider/>
        <CombatConfigurator/>
        <section className="story-section" id="story">
          <div className="story-image"><div className="story-arch arch-one"/><div className="story-arch arch-two"/><div className="story-lamp"/></div>
          <div className="story-copy">
            <div className="eyebrow"><span className="eyebrow-line"/> THERE IS NO WAY HOME</div>
            <div className="story-kicker">A PILGRIMAGE THROUGH HELL.</div>
            <h2>THE SURFACE<br/>WON'T <em>WELCOME</em><br/>YOU.</h2>
            <p>Raised in an underground cavern sanctuary, a group of unlikely allies embarks on a brutal pilgrimage across the surface.</p>
            <p className="story-emphasis">No moral lectures. No grand heroic illusions. Just blood, self-made justice, and survival.</p>
          </div>
          <div className="story-side-mark">G13 <span>—</span> THE DESCENT</div>
        </section>
        <section className="signup-section" id="signup">
          <div className="signup-content">
            <div className="eyebrow"><span className="eyebrow-line"/> THE GATES ARE NOT OPEN YET</div>
            <h2>WHEN THE<br/><em>WORLD BURNS,</em><br/>BE THERE.</h2>
            <p>Get news from below and be first in line when the playtest calls.</p>
            <form className="signup-form" onSubmit={e=>{e.preventDefault();if(email.trim()){setJoined(true);setEmail('');}}}>
              <input type="email" required placeholder="YOUR EMAIL ADDRESS" value={email} onChange={e=>setEmail(e.target.value)}/>
              <button type="submit">SIGN ME UP <ArrowUpRight size={15}/></button>
            </form>
            <div className="form-message" role="status">{joined?'YOU ARE ON THE LIST. WATCH THE DARK FOR A SIGNAL.':'NO SPAM. NO PROPHECIES. JUST G13 NEWS.'}</div>
          </div>
          <div className="signup-meta"><div className="platforms"><span>IN DEVELOPMENT FOR</span><strong>PC</strong><i/><strong>STEAM</strong></div><div className="rating"><strong>18<span>+</span></strong><span>EXTREME VIOLENCE<br/>GORE / BLOOD</span></div></div>
        </section>
      </main>
      <footer className="site-footer">
        <a className="brand" href="#top"><span className="brand-mark">G<span>13</span></span><span className="brand-caption">A BRUTAL PILGRIMAGE</span></a>
        <div className="footer-middle"><span>© 2026 G13 PROJECT. ALL RIGHTS RESERVED.</span><span>BUILT IN THE DARK. SHAPED BY FIRE.</span></div>
        <div className="social-links"><a href="https://store.steampowered.com/" target="_blank" rel="noreferrer">STEAM ↗</a><a href="https://discord.com/" target="_blank" rel="noreferrer">DISCORD ↗</a></div>
      </footer>
    </div>
  );
}
