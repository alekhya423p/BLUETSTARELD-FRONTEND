import React, { Fragment } from 'react';
// import './Violations.scss';
import { logWidth } from '../utils';

export const Violations = ({violations}) => {
   const getTop = (st) => {
      switch(st) {
         case 'DS_OFF': return { top: 'calc(12% - 1px)' };
         case 'DS_SB': return { top: 'calc(37% - 1px)' };
         case 'DS_D': return { top: 'calc(62% - 1px)' };
         case 'DS_ON': return { top: 'calc(87% - 1px)' };
         case 'DR_IND_YM' : return { top: 'calc(87% - 1px)'}
         default: return { top: '0', display: 'none'}
      }
   }

   return (
      violations.map((el, i) => (
         <Fragment key={i}>
            <span 
               className="logViolation"
               style={{
                  ...logWidth(el.start, el.end),
                  ...getTop(el.status)
               }}>   
            </span>
         </Fragment>
      ))
   )
}
