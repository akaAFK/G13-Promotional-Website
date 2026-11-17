import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Hand, Shield, Flame, Activity, Send } from 'lucide-react';

const mechanics = [
  { id:'finishing', label:'FINISHING MOVES', key:'F', Icon:Crosshair,
    title:<>MAKE IT<br/><em>PERSONAL.</em></>, copy:'Grab a weakened enemy and choose where the next strike lands. The target zone changes the outcome.',
    options:[['head','Head strike'],['chest','Chest strike'],['abdomen','Abdomen strike']] },
  { id:'limbs', label:'LIMB DAMAGE', key:'', Icon:Activity,
    title:<>EVERY LIMB<br/><em>HAS A PURPOSE.</em></>, copy:'Target a specific limb to change the fight. Disable an attack, reduce mobility, or force an enemy to drop a weapon.',
    options:[['arm','Damage arm'],['leg','Damage leg'],['eye','Blind enemy']] },
  { id:'environment', label:'ENVIRONMENT', key:'', Icon:Flame,
    title:<>THE ROOM<br/><em>IS YOUR ARSENAL.</em></>, copy:'Pick up an object and turn the environment into an improvised weapon. Your surroundings are part of the combat system.',
    options:[['bottle','Broken bottle'],['brick','Loose brick'],['trap','Environmental trap']] }
];

export default function CombatConfigurator() {
  const [tab,setTab] = useState('finishing');
  const [target,setTarget] = useState('head');
  const [intensity,setIntensity] = useState(2);
  const [weapon,setWeapon] = useState('fists');
  const [status,setStatus] = useState('Configure a move and send a combat event to the API.');
  const [sending,setSending] = useState(false);
  const active = useMemo(()=>mechanics.find(m=>m.id===tab),[tab]);
  const choices = active.options;

  const chooseTab = (id) => {
    setTab(id);
    const next = mechanics.find(m=>m.id===id);
    setTarget(next.options[0][0]);
  };

  async function sendEvent() {
    const payload = {
      event_type: 'combat_configured',
      mechanic: tab,
      target_zone: target,
      intensity,
      weapon,
      timestamp: new Date().toISOString()
    };
    setSending(true);
    setStatus('Sending event to /events…');
    try {
      const response = await fetch('/events', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`API responded with ${response.status}`);
      const data = await response.json();
      setStatus(data.message || 'Combat event accepted by the server.');
    } catch (error) {
      setStatus(`Could not reach /events. Start the API server. (${error.message})`);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="combat-section" id="combat">
      <div className="section combat-inner">
        <div className="section-heading combat-heading">
          <div><div className="eyebrow"><span className="eyebrow-line"/> LEARN THEIR WEAK POINTS</div>
            <h2>VIOLENCE IS<br/><em>A LANGUAGE.</em></h2></div>
          <p className="section-intro">Build a combat action. Choose a mechanic, target and intensity — then send the event to the G13 API.</p>
        </div>
        <div className="mechanics-panel">
          <div className="mechanics-tabs" role="tablist" aria-label="Combat mechanics">
            {mechanics.map(({id,label,key,Icon},i)=>(
              <button key={id} role="tab" aria-selected={tab===id} className={`mechanic-tab ${tab===id?'active':''}`}
                onClick={()=>chooseTab(id)}><span>0{i+1}</span><Icon size={16}/>{label}{key&&<kbd>{key}</kbd>}</button>
            ))}
          </div>
          <div className="mechanic-content">
            <div className="mechanic-visual">
              <div className="target-figure"><span className={`target-point point-${target}`}/><span className="target-cross">+</span></div>
              <span className="visual-label">TARGET / {target.toUpperCase()}</span>
            </div>
            <div className="mechanic-description">
              <div className="eyebrow">CONFIGURE YOUR MOVE</div>
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}>
                  <h3>{active.title}</h3><p>{active.copy}</p>
                </motion.div>
              </AnimatePresence>
              <div className="config-controls">
                <label className="control-label">TARGET</label>
                <div className="choice-row">{choices.map(([id,label])=><button key={id} className={`choice-chip ${target===id?'selected':''}`} onClick={()=>setTarget(id)}>{label}</button>)}</div>
                <label className="control-label" htmlFor="intensity">INTENSITY <b>{intensity}/3</b></label>
                <input id="intensity" type="range" min="1" max="3" value={intensity} onChange={e=>setIntensity(Number(e.target.value))}/>
                <label className="control-label" htmlFor="weapon">IMPLEMENT</label>
                <select id="weapon" value={weapon} onChange={e=>setWeapon(e.target.value)}>
                  <option value="fists">Bare hands</option><option value="bottle">Broken bottle</option><option value="blade">Improvised blade</option><option value="environment">Environment</option>
                </select>
                <button className="button button-primary send-event" onClick={sendEvent} disabled={sending}><Send size={15}/>{sending?'SENDING…':'SEND COMBAT EVENT'}</button>
                <p className="event-status" role="status" aria-live="polite">{status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
