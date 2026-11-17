import { ArrowUpRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-backdrop" />
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> FIRST-PERSON ACTION / DARK FANTASY</div>
          <h1>G<span>13</span></h1>
          <div className="hero-subtitle">NO SAINTS. <i>NO MERCY.</i> NO WAY BACK.</div>
          <p className="hero-lede">Visceral First-Person Action &amp; Adaptive Combat in a Brutal World.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#combat"><Play size={15} fill="currentColor"/> Explore combat</a>
            <a className="button button-outline" href="#squad">Meet the crew <ArrowUpRight size={16}/></a>
          </div>
          <div className="hero-footnote"><span className="pulse-dot"/> IN DEVELOPMENT <b>/</b> PC · STEAM · EPIC GAMES STORE</div>
        </div>
        <div className="hero-art-wrap">
          <div className="hero-art-frame">
            <img src={import.meta.env.BASE_URL + "assets/characters/captain.svg"} alt="The Captain — G13 protagonist" />
          </div>
          <div className="hero-art-stamp">THE<br/>CAPTAIN</div>
          <div className="hero-coordinates">13° / BELOW THE SURFACE</div>
        </div>
      </div>
      <div className="hero-bottom-rule"><span>SCROLL TO DESCEND</span><span>↓</span><span>EST. IN BLOOD</span></div>
    </section>
  );
}
