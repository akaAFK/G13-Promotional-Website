import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { characters } from '../data/characters';

export default function CharacterSlider() {
  const [index, setIndex] = useState(0);
  const dragX = useMotionValue(0);
  const constraintsRef = useRef(null);
  const active = characters[index];
  const rotate = useTransform(dragX, [-180, 180], [-3, 3]);

  const go = (next) => setIndex((next + characters.length) % characters.length);
  const onDragEnd = (_, info) => {
    if (info.offset.x < -55 || info.velocity.x < -450) go(index + 1);
    else if (info.offset.x > 55 || info.velocity.x > 450) go(index - 1);
  };

  return (
    <section className="section squad-section" id="squad">
      <div className="section-heading squad-heading">
        <div><div className="eyebrow"><span className="eyebrow-line"/> SIX SOULS / ONE BAD IDEA</div>
          <h2>MEET THE<br/><em>UNFORTUNATE.</em></h2></div>
        <p className="section-intro">Not heroes. Not chosen ones. Just a ragtag family with sharp tools, strange talents, and absolutely no business being alive.</p>
      </div>
      <div className="slider-toolbar">
        <div className="slider-count"><span>{String(index + 1).padStart(2,'0')}</span><i/> <span>06</span><small>THE CREW</small></div>
        <div className="slider-controls">
          <button className="slider-arrow" onClick={() => go(index - 1)} aria-label="Previous character"><ArrowLeft/></button>
          <button className="slider-arrow" onClick={() => go(index + 1)} aria-label="Next character"><ArrowRight/></button>
        </div>
      </div>
      <div className="character-stage" ref={constraintsRef}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.article key={active.id} className="character-card"
            initial={{opacity:0, x:70, filter:'blur(8px)'}}
            animate={{opacity:1, x:0, filter:'blur(0px)', rotate:0}}
            exit={{opacity:0, x:-70, filter:'blur(8px)'}}
            transition={{duration:.35, ease:'easeOut'}}
            drag="x" dragConstraints={constraintsRef} dragElastic={0.18}
            style={{x:dragX, rotate}} onDragEnd={onDragEnd}>
            <div className="character-image">
              <img src={active.image} alt={active.name} draggable="false"/>
              <span className="character-index">{String(index + 1).padStart(2,'0')}</span>
              <span className="character-stamp">{active.subtitle.split(' ').map((w,i)=><span key={i}>{w}<br/></span>)}</span>
            </div>
            <div className="character-details">
              <div className="character-role">{active.role}</div>
              <h3>{active.name}</h3>
              <p className="character-style">{active.style}</p>
              <p className="character-bio">{active.bio}</p>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
      <div className="slider-bottom">
        <div className="slider-dots" aria-label="Choose a character">
          {characters.map((c,i)=><button key={c.id} className={`slider-dot ${i===index?'active':''}`}
            aria-label={`Show ${c.name}`} aria-current={i===index?'true':undefined} onClick={()=>go(i)}/>)}
        </div>
        <span className="drag-hint">← DRAG OR SWIPE TO EXPLORE →</span>
      </div>
    </section>
  );
}
