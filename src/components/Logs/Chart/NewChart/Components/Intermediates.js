import React from 'react';
import './Intermediates.css';
import { interPoint } from '../utils';
import { times } from '../../../utils';

export const Intermediates = ({ inters=[], missInters=false, setSuccess }) => {
   const getTime = (secs) => {
      const { startDate } = times();
      const time = startDate.add(secs, 'seconds');
      return time.format("hh:mm:ss A");
   }

   const onMouseHover = (index, hover=true) => {
      if(!missInters && index >= 0) {
         let domInters = document.querySelectorAll('.DriverLogRow .body .item');
         let intIndex = 0;
         domInters =  [...domInters];
         
         domInters.forEach((el, i) => { 
            const st = el.querySelector('.status-indicator');
            if(st && st.textContent.includes('INTER_NORMAL_PRECISION')) {
               if(index === intIndex) {
                  hover ? el.classList.add('hovered') : el.classList.remove('hovered'); 
               }
               intIndex += 1;
            }
         });
      }
   }

   const onCopyTime = (time) => {
      let text = time
      let textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
         let successful = document.execCommand('copy');
         let msg = successful ? 'successfull' : 'unsuccessfull';
         if(successful) {
            console.log('Copying is ' + msg);
            setSuccess(`Time copied to clipboard`);
         }
      } catch (err) {
         console.error('Fallback: Oops, unable to copy', err);
      }

      document.body.removeChild(textArea)
   }

   return (
      inters.map((el, i) => {
         const time = getTime(el.point);
         const point = interPoint(el.point, el.status);
         missInters && (point.backgroundColor = '#EB5757');
         return (
            <div 
               className="INTER_NORMAL_PRECISION" key={el.point}
               style={{ ...point }}
               onMouseOver={() => onMouseHover(i) }
               onMouseLeave={() => onMouseHover(i, false) }
               onClick={() => onCopyTime(time)}
            >
               <span 
                  className="Inter_time" 
                  style={{
                     color: missInters ? 
                        '#EB5757' : 
                        (el.status === 'DS_D' ? '#2cbd68' : '#858e9e')}} >
                  {time}
               </span>
            </div>
         )
      })
   )
}
