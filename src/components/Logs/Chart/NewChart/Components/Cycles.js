import React from 'react';
// import './Cycles.scss';
import { getShiftCycle } from '../utils';

export const Cycles = ({cycles=[120]}) => {
   return (
      cycles.map((mins, i) => 
         <div 
            key={mins+i}
            style={getShiftCycle(mins)}
            className="Cycle">
         </div>
      )
   )
}
