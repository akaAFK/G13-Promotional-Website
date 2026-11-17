import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const links = [
  ['The World', '#world'],
  ['The Squad', '#squad'],
  ['Combat', '#combat'],
  ['The Pilgrimage', '#story']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="#top" onClick={() => setOpen(false)}>
        <span className="brand-mark">G<span>13</span></span>
        <span className="brand-caption">A BRUTAL PILGRIMAGE</span>
      </a>
      <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X size={22}/> : <Menu size={22}/>}
      </button>
      <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a className="nav-cta" href="#signup" onClick={() => setOpen(false)}>Join Playtest <ArrowUpRight size={15}/></a>
      </nav>
    </header>
  );
}
