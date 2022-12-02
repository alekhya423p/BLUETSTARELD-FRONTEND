import React from 'react';
// import './Duration.scss';

export const Duration = ({logs=[]}) => {
   const getTime = (status) => {
      let sum = 0;
      logs.forEach(log => {
         if( 
            status === 'all'  || log.status === status || 
            (log.status === 'DR_IND_PC' && status === 'DS_OFF') ||
            (log.status === 'DR_IND_YM' && status === 'DS_ON')
         ) { sum += Math.round(log.end - log.start) }
      });
      sum = Math.round(sum / 60);
      let hours = Math.floor(sum / 60);
      let mins = sum - Math.floor(hours * 60);
      if(hours <= 9) { hours = `0${hours}` }
      if(mins <= 9) { mins = `0${mins}` }
      if(hours === 24) { mins = '00' }
      return `${hours}:${mins}`
   }

   return (
      <div className="DurationWrapper">
         <div className="Duration">
            <span className="D_item">{getTime('DS_OFF')}</span>
            <span className="D_item">{getTime('DS_SB')}</span>
            <span className="D_item">{getTime('DS_D')}</span>
            <span className="D_item">{getTime('DS_ON')}</span>
            <span className="D_total">Total: {getTime('all')}</span>
         </div>
      </div>
   )
}
