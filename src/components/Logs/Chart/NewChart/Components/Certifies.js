import React from 'react';
import './Certifies.css';
import { certPoint } from '../utils';
import { times } from '../../../utils';
import signImg from '../images/signature.png';
import signImg_light from '../images/signature_light.png';
import { useSelector } from 'react-redux';
export const Certifies = ({certifies=[], setSuccess}) => {
   const { isMode } = useSelector(state => state.dashboard)

   const getTime = (secs) => {
      const { startDate } = times();
      const time = startDate.add(secs, 'seconds');
      return time.format("hh:mm:ss A");
   }

   const onMouseHover = (index, hover=true) => {
      if(index >= 0) {
         let domInters = document.querySelectorAll('.DriverLogRow .body .item');
         let intIndex = 0;
         let domArray = [...domInters];
         domArray.forEach((el) => {
            const st = el.querySelector('.status-indicator');
            if(st && st.textContent.includes('Certify')) {
               if(index === intIndex) {
                  hover ? el.classList.add('hovered') : el.classList.remove('hovered');
               }
               intIndex += 1;
            }
         });
      }
   }

   const onCopySignature = (signature) => {
      let text = signature
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
         // let msg = successful ? 'successfull' : 'unsuccessfull';
         if(successful) {
            // console.log('Copying is ' + msg);
            setSuccess(`Driver signature copied to clipboard`);
         }
      } catch (err) {
         console.error('Fallback: Oops, unable to copy', err);
      }

      document.body.removeChild(textArea)
   }

   return (
      certifies.map((el, i) => {
         const point = certPoint(el.point);
         const time = getTime(el.point);
         return (
            <div 
               className="Certify" key={el.point + i}
               style={{ ...point, zIndex: 11-i }}
               onMouseOver={() => onMouseHover(i) }
               onMouseLeave={() => onMouseHover(i, false) }
               onClick={() => el.driver_signature ? onCopySignature(el.driver_signature) : {}}
            >
               <img 
                  className="cert_img" 
                  alt="cert" src={ isMode ? signImg : signImg_light } 
               />
               <span 
                  className="cert_time" 
                  style={{ color: '#2cbd68' }} >
                     {time}
                     {el.driver_signature && typeof el.driver_signature === 'string' && 
                        <img 
                           className="cert_signature" 
                           src={(el.driver_signature.replace('/signatures', 'signatures'))} alt="sign" 
                        />
                     }
               </span>
            </div>
         )
      })
   )
}
