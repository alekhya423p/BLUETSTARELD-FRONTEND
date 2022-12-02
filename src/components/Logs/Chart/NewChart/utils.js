// import dot from './images/dot.svg';

export const verticalLine = (from, to, mins=0) => {
    const style = { left: mins === 0 ? 0 : `calc( (100% / 86400) * ${mins})` };
 
    if((from === 'DS_OFF' && to === 'DS_SB') || (from === 'DS_SB' && to === 'DS_OFF')) {
       style.top = 'calc(100% / 8)';
       style.height = '25%';
    }
    if((from === 'DR_IND_PC' && to === 'DS_SB') || (from === 'DS_SB' && to === 'DR_IND_PC')) {
       style.top = 'calc(100% / 8)';
       style.height = '25%';
    }
    if((from === 'DS_OFF' && to === 'DS_D') || (from === 'DS_D' && to === 'DS_OFF')) {
       style.top = 'calc(100% / 8)';
       style.height = '50%';
    }
    if((from === 'DR_IND_PC' && to === 'DS_D') || (from === 'DS_D' && to === 'DR_IND_PC')) {
       style.top = 'calc(100% / 8)';
       style.height = '50%';
    }
    if((from === 'DS_OFF' && to === 'DS_ON') || (from === 'DS_ON' && to === 'DS_OFF')) {
       style.top = 'calc(100% / 8)';
       style.height = '75%';
    }
    if((from === 'DR_IND_PC' && to === 'DS_ON') || (from === 'DS_ON' && to === 'DR_IND_PC')) {
       style.top = 'calc(100% / 8)';
       style.height = '75%';
    }
    if((from === 'DS_OFF' && to === 'DR_IND_YM') || (from === 'DR_IND_YM' && to === 'DS_OFF')) {
       style.top = 'calc(100% / 8)';
       style.height = '75%';
    }
    if((from === 'DR_IND_PC' && to === 'DR_IND_YM') || (from === 'DR_IND_YM' && to === 'DR_IND_PC')) {
       style.top = 'calc(100% / 8)';
       style.height = '75%';
    }
    if((from === 'DS_SB' && to === 'DS_D') || (from === 'DS_D' && to === 'DS_SB')) {
       style.top = 'calc(100% / (8/3))';
       style.height = '25%';
    }
    if((from === 'DS_SB' && to === 'DS_ON') || (from === 'DS_ON' && to === 'DS_SB')) {
       style.top = 'calc(100% / (8/3))';
       style.height = '50%';
    }
    if((from === 'DS_SB' && to === 'DR_IND_YM') || (from === 'DR_IND_YM' && to === 'DS_SB')) {
       style.top = 'calc(100% / (8/3))';
       style.height = '50%';
    }
    if((from === 'DS_D' && to === 'DS_ON') || (from === 'DS_ON' && to === 'DS_D')) {
       style.top = 'calc(100% / (8/5))';
       style.height = '25%';
    }
    if((from === 'DS_D' && to === 'DR_IND_YM') || (from === 'DR_IND_YM' && to === 'DS_D')) {
       style.top = 'calc(100% / (8/5))';
       style.height = '25%';
    }
    return style
 };
 
 export const logWidth = (start=0, end=0) => ({
    left: start === 0 ? 0 : `calc( (100% / 86400) * ${start})`,
    width: end === 0 ? 0 : `calc( (100% / 86400) * ${(end - start)} )`
    // left: start === 0 ? 0 : `calc( (100% / 86400) * ${0})`,
    // width: end === 0 ? 0 : `calc( (100% / 86400) * ${(9000 - 10)} )`
 });
 
 export const interPoint = (point, st='DS_D') => {
    let top = '61%';
    switch(st) {
       case 'DS_OFF' : { top = '10.7%'; break }
       case 'DR_IND_PC' : { top = '10.7%'; break }
       case 'DS_SB' : { top = '36%'; break }
       case 'DS_D' : { top = '61%'; break }
       case 'DS_ON' : { top = '86%'; break }
       case 'DR_IND_YM' : { top = '86%'; break }
       default: break
    }
    return {
       backgroundColor: st === 'DS_D' ? '#2cbd68' : '#858e9e',
       left: point === 0 ? 0 : `calc( (100% / 86400) * ${point})`,
       top,
    }
 }
 
 export const certPoint = (point) => {
    return {
       left: point === 0 ? 0 : `calc( (100% / 86400) * ${point})`,
    }
 }
 
 export const background = (log) => (
    log.status === 'DR_IND_PC' || log.status === 'DR_IND_YM' ? {
       // backgroundImage: `url(${dot})`,
       backgroundRepeat: 'repeat-x',
       backgroundSize: 'contain',
    } : {}
 )
 
 export const getShiftCycle = (point) => ({
    left: point === 0 ? 0 : `calc( (100% / 86400) * ${point} )`
 })