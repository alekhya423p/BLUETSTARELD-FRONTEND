import React, { useState, useEffect, useRef } from 'react';
// import './style.scss';
import moment from 'moment-timezone';
import { times } from '../utils';

export const TimePicker = (
   { initialValue = "12:00:00 AM", disabled = false, onChange }
) => {
   const { startDate, tz } = times();
   const endDate = moment.tz(startDate, tz).endOf('day');

   const timePickerRef = useRef(null);
   const [hour, setHour] = useState('00');
   const [min, setMin] = useState('00');
   const [sec, setSec] = useState('00');
   const [type, setType] = useState("AM");
   const [value, setValue] = useState("00:00:00 AM");

   const [show, setShow] = useState(false);

   useEffect(() => {
      let h, m, s, t;
      if (initialValue.toUpperCase().includes('AM')) { t = 'AM' }
      if (initialValue.toUpperCase().includes('PM')) { t = 'PM' }

      [h, m, s] = initialValue.split(':').map(el => {
         let time = el.match(/\d/g);
         return time = time.join("");
      });
      setHour(h); setMin(m); setSec(s); setType(t);
      setValue(`${initialValue}`);
   }, [initialValue]);

   useEffect(() => {
      const event = e => {
         const el = e.target;
         const curTimePicker = timePickerRef.current;
         if (show &&
            !el.classList.contains('TimePicker') &&
            !el.classList.contains('TimePicker_tableWrapper') &&
            !el.classList.contains('TimePicker_value') &&
            !el.classList.contains('TimePicker_table') &&
            !el.classList.contains('inp') &&
            !el.classList.contains('arrow') &&
            !el.classList.contains('sep') &&
            !el.classList.contains('fa-chevron-up') &&
            !el.classList.contains('fa-chevron-down') &&
            !el.classList.contains('TimePicker_body') &&
            !el.classList.contains('TimePicker_tr') &&
            !el.classList.contains('TimePicker_td')
         ) {
            setShow(false);
         } else if (
            show && el.classList.contains('TimePicker_value')
         ) {
            const timePicker = el.parentNode;
            if (!curTimePicker.isSameNode(timePicker)) {
               setShow(false);
            }
         }
      }
      window.addEventListener('click', event);
      const editLogModal = document.querySelector('.modal-content');

      if (editLogModal) { editLogModal.addEventListener('click', event) }

      return () => window.removeEventListener('click', event)
   }, [show]);

   const setTime = (h = hour, m = min, s = sec, t = type) => {
      let timeTxt = moment.tz(startDate, tz).format('DD-MM-YYYY');
      timeTxt = `${timeTxt} ${h}:${m}:${s} ${t}`
      let curTime = moment.tz(timeTxt, 'DD-MM-YYYY hh:mm:ss A', tz);

      let newVal = moment.tz(curTime, tz);
      if (moment(newVal).isBetween(startDate, endDate)) {
         onChange(moment.duration(newVal.diff(startDate)).asSeconds());
      }
   }

   const onEveryChange = async (t) => {
      let v = { val: 0, type: '' };
      let newType = type;

      switch (t) {
         case 'hourUp': {
            v.val = 1;
            v.type = 'hour'
            break;
         }
         case 'hourDown': {
            v.val = -1;
            v.type = 'hour'
            break;
         }
         case 'minUp': {
            v.val = 1;
            v.type = 'minute'
            break;
         }
         case 'minDown': {
            v.val = -1;
            v.type = 'minute'
            break;
         }
         case 'secUp': {
            v.val = 1;
            v.type = 'second'
            break;
         }
         case 'secDown': {
            v.val = -1;
            v.type = 'second'
            break;
         }
         case 'typeUp': {
            newType = type === 'AM' ? 'PM' : 'AM';
            break;
         }
         case 'typeDown': {
            newType = type === 'AM' ? 'PM' : 'AM'
            break;
         }
         default: break;
      }

      let timeTxt = moment.tz(startDate, tz).format('DD-MM-YYYY');
      timeTxt = `${timeTxt} ${hour}:${min}:${sec} ${newType}`
      let curTime = moment.tz(timeTxt, 'DD-MM-YYYY hh:mm:ss A', tz);

      let newVal = moment.tz(curTime, tz).add(v.val, v.type);
      if (moment(newVal).isBetween(startDate, endDate)) {
         onChange(moment.duration(newVal.diff(startDate)).asSeconds());
      }
   }

   // HOUR
   const onHourChange = e => {
      const re = /^-?\d+\.?\d*$/;
      let h = e.target.value;
      if (re.test(h)) {
         h = +h;
         if (h <= 12 && h > 0) { setHour(h); }
      }
   }
   const onHourBlur = () => { setTime() }

   // MIN
   const onMinChange = e => {
      // console.log('onMinChange');
      const re = /^-?\d+\.?\d*$/;
      let m = e.target.value;
      if (re.test(e.target.value)) {
         m = +e.target.value;
         if (m <= 59 && m >= 0) { setMin(m) }
      }
   }
   const onMinBlur = e => { setTime() }

   // SEC
   const onSecChange = e => {
      // console.log('onSecChange');
      const re = /^-?\d+\.?\d*$/;
      let s = e.target.value;
      if (re.test(e.target.value)) {
         s = +e.target.value;
         if (s <= 59 && s >= 0) { setSec(s) }
      }
   }
   const onSecBlur = e => { setTime() }

   // TYPE
   const onTypeChange = e => {
      // console.log('onTypeChange');
      const val = e.target.value;
      let t = "AM";
      if (val.toLowerCase() === "a" || val.toLowerCase() === 'p') {
         t = val.toUpperCase() + 'M';
      } else if (val === '') {
         t = '';
      }
      setType(t);
      setValue(`${hour}:${min} ${t}`);
   }

   const onTypeBlur = (e) => { setTime() }

   const onInputFocus = e => {
      if (!disabled) {
         e.target.select();
         setShow(true);
      }
   }

   const onInputChange = e => {
      // console.log('onInputChange');
      let val = e.target.value.toUpperCase();
      let h, m, s, t;
      if (val.includes('AM')) { t = 'AM' }
      if (val.includes('PM')) { t = 'PM' }
      [h, m, s] = val.split(':').map(el => {
         let time = el.match(/\d/g);
         if (time) { time = time.join("") }
         return time;
      });
      if ((+h > 0 || +h <= 12) && (+m >= 0 && +m <= 59)) {
         setTime(h, m, s, t);
      }
   }

   return (
      <div className="TimePicker" ref={timePickerRef}>
         <input
            disabled={disabled}
            onFocus={onInputFocus}
            className={'TimePicker_value ' + (disabled ? 'disabled' : '')}
            onChange={onInputChange}
            value={value} />
         <div className={"TimePicker_tableWrapper " + (show ? 'showPicker' : '')}>
            <table className="TimePicker_table">
               <tbody className="TimePicker_body">
                  <tr className="TimePicker_tr">
                     <td className="TimePicker_td">
                        <span className="arrow" onClick={() => onEveryChange('hourUp')}>
                           <i className="fa fa-chevron-up"></i>
                        </span>
                     </td>
                     <td className="sep">&nbsp;</td>
                     <td className="TimePicker_td">
                        <span className="arrow" onClick={() => onEveryChange('minUp')}>
                           <i className="fa fa-chevron-up"></i>
                        </span>
                     </td>
                     <td className="sep">&nbsp;</td>
                     <td className="TimePicker_td">
                        <span className="arrow" onClick={() => onEveryChange('secUp')}>
                           <i className="fa fa-chevron-up"></i>
                        </span>
                     </td>
                     <td className="sep">&nbsp;</td>
                     <td className="sep">&nbsp;</td>
                     <td className="TimePicker_td">
                        <span className="arrow" onClick={() => onEveryChange('typeUp')}>
                           <i className="fa fa-chevron-up"></i>
                        </span>
                     </td>
                  </tr>
                  <tr className="TimePicker_tr">
                     <td className="TimePicker_td">
                        <input
                           value={hour}
                           onFocus={e => e.target.select()}
                           onBlur={onHourBlur}
                           onChange={onHourChange}
                           maxLength="2"
                           className="inp" />
                     </td>
                     <td className="sep">:</td>
                     <td className="TimePicker_td">
                        <input
                           value={min}
                           onFocus={e => e.target.select()}
                           onBlur={onMinBlur}
                           onChange={onMinChange}
                           maxLength="2"
                           className="inp" />
                     </td>
                     <td className="sep">:</td>
                     <td className="TimePicker_td">
                        <input
                           value={sec}
                           onFocus={e => e.target.select()}
                           onBlur={onSecBlur}
                           onChange={onSecChange}
                           maxLength="2"
                           className="inp" />
                     </td>
                     <td className="sep">:</td>
                     <td className="sep">&nbsp;</td>
                     <td className="TimePicker_td">
                        <input
                           value={type}
                           onFocus={e => e.target.select()}
                           onBlur={onTypeBlur}
                           onChange={onTypeChange}
                           maxLength="2"
                           className="inp" />
                     </td>
                  </tr>
                  <tr className="TimePicker_tr">
                     <td className="TimePicker_td">
                        <span className="arrow" onClick={() => onEveryChange('hourDown')}>
                           <i className="fa fa-chevron-down"></i>
                        </span>
                     </td>
                     <td className="sep"></td>
                     <td className="TimePicker_td">
                        <span className="arrow" onClick={() => onEveryChange('minDown')}>
                           <i className="fa fa-chevron-down"></i>
                        </span>
                     </td>
                     <td className="sep"></td>
                     <td className="TimePicker_td">
                        <span className="arrow" onClick={() => onEveryChange('secDown')}>
                           <i className="fa fa-chevron-down"></i>
                        </span>
                     </td>
                     <td className="sep">&nbsp;</td>
                     <td className="sep">&nbsp;</td>
                     <td className="TimePicker_td">
                        <span className="arrow" onClick={() => onEveryChange('typeDown')}>
                           <i className="fa fa-chevron-down"></i>
                        </span>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   )
}