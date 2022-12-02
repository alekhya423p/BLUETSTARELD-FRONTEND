import React from 'react';
// import './Warnings.scss';
import { getShiftCycle } from '../utils';
import { times } from '../../../utils';

export const Warnings = ({warnings=[]}) => {
   const getTime = (secs) => {
      const { startDate } = times();
      const time = startDate.add(secs, 'seconds');
      return time.format("hh:mm:ss A");
   }

   const getTxt = (type) => {
      switch(type) {
         case 'DS_D': { return 'D' }
         case 'shift': { return 'SH' }
         case 'cycle': { return 'C' }
         default: return ''
      }
   }
   return (
      warnings.map((el, i) => 
         <div 
            key={el.time+i}
            style={getShiftCycle(el.time)}
            className={"Warnings War_" + el.type}>
               <span className="Warning_txt">
                  {getTxt(el.type)}
                  <span className="Warning_txt-time">
                     {getTime(el.time)}
                  </span>
               </span>
         </div>
      )
   )
}
