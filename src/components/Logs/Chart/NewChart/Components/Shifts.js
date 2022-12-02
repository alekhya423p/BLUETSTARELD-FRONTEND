import React from 'react';
// import './Shifts.scss';
import { getShiftCycle } from '../utils';

export const Shifts = ({shifts}) => {
   return (
      shifts.map((mins, i) => 
         <div 
            key={mins+i}
            style={getShiftCycle(mins)}
            className="Shift">
         </div>
      )
   )
}
