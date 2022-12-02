import React from 'react';
import moment from 'moment-timezone';
import { times } from '../../utils';

export const Start = ({editLog}) => {
   const { startDate, tz } = times();

   const getStart = () => {
      let start = moment.tz(startDate, tz).add(editLog.start, 'second');
      return start.format("hh:mm:ss");
   }
   return (
      <span className="start">
         <svg
            width="45" height="35" 
            viewBox="0 0 54 35" fill="none">
               <path className={editLog.status} d="M0 5C0 2.23858 2.23858 0 5 0H49C51.7614 0 54 2.23858 54 5V35L49.8011 29.6898C49.0425 28.7303 47.8866 28.1707 46.6635 28.1707H5C2.23858 28.1707 0 25.9322 0 23.1707V5Z"/>
         </svg>
         <span className="timer">{getStart()}</span>
      </span>

   )
}

export const End = ({editLog}) => {
   const { startDate, tz } = times();

   const getEnd = () => {
      let end = moment.tz(startDate, tz).add(editLog.end, 'second');
      return end.format("hh:mm:ss");
   }
   
   return (
      <span className="end">
         <svg
            width="45" height="35" 
            viewBox="0 0 54 35" fill="none">
               <path className={editLog.status} d="M54 5C54 2.23858 51.7614 0 49 0H5C2.23857 0 0 2.23858 0 5V35L4.19888 29.6898C4.95751 28.7303 6.11341 28.1707 7.33652 28.1707H49C51.7614 28.1707 54 25.9322 54 23.1707V5Z"/>
         </svg>
         <span className="timer">{getEnd()}</span>
      </span>

   )
}



// SET START ////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
export const SetStart = ({editLog, setEditLog}) => {
   let pageX;

   const mouse = (e, type) => {
      const erWrapper = document.querySelector('.DriverLogsWrapper');
      if(erWrapper) {
         if(type === 'down') {
            pageX = e.pageX;
            erWrapper.addEventListener('mouseup', mouseupEvent);
            erWrapper.addEventListener('mousemove', moveEvent);
            erWrapper.addEventListener('mouseleave', leaveEvent);
         } 
         if(type === 'up') {
            erWrapper.removeEventListener('mouseup', mouseupEvent);
            erWrapper.removeEventListener('mousemove', moveEvent);
            erWrapper.removeEventListener('mouseleave', leaveEvent);
         }
      }
   }

   const mouseupEvent = () => {
      const erWrapper = document.querySelector('.DriverLogsWrapper');
      if(erWrapper) {
         erWrapper.removeEventListener('mousemove', moveEvent);
      }
   }

   const moveEvent = (e) => {
      const innerWidth = window.innerWidth;
      let speed = 60;
      if(innerWidth <= 1600) { speed = 70 }
      if(innerWidth <= 1500) { speed = 80 }
      if(innerWidth <= 1400) { speed = 90 }
      if(innerWidth <= 1300) { speed = 100 }
      if(innerWidth <= 1200) { speed = 110 }
      
      const moved = (e.pageX - pageX) * speed;
      const start = editLog.start + moved;
      const end = editLog.end;

      if(start >= editLog.end) setEditLog({ ...editLog, start: end - 1 });
      else if(start >= 0) setEditLog({ ...editLog, start });
      else setEditLog({ ...editLog, start: 0 });
   };

   const leaveEvent = () => {
      const erWrapper = document.querySelector('.DriverLogsWrapper');
      erWrapper && erWrapper.removeEventListener('mousemove', moveEvent);
   }

   return (
      <svg className="setStart"
         onMouseDown={e => mouse(e, 'down')}
         onMouseUp={e => mouse(e, 'up')}
         onClick={e => mouse(e, 'up')}
         width="41" height="24" 
         viewBox="0 0 41 24" fill="none">
            <path className={editLog.status} d="M10 24H41V0H36.9H10L0 12L10 24Z"/>
      </svg>
   )
}



// SET END ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
export const SetEnd = ({editLog, setEditLog}) => {
   const {startDate, tz} = times();
   const endDate = moment.tz(startDate, tz).endOf('day');
   let pageX;

   const mouse = (e, type) => {
      const erWrapper = document.querySelector('.DriverLogsWrapper');
      if(erWrapper) {
         if(type === 'down') {
            pageX = e.pageX;
            erWrapper.addEventListener('mouseup', mouseupEvent);
            erWrapper.addEventListener('mousemove', moveEvent);
            erWrapper.addEventListener('mouseleave', leaveEvent);
         } 
         if(type === 'up') {
            erWrapper.removeEventListener('mouseup', mouseupEvent);
            erWrapper.removeEventListener('mousemove', moveEvent);
            erWrapper.removeEventListener('mouseleave', leaveEvent);
         }
      }
   }

   const mouseupEvent = () => {
      const erWrapper = document.querySelector('.DriverLogsWrapper')
      if(erWrapper) {
         erWrapper.removeEventListener('mousemove', moveEvent);
      }
   };

   const moveEvent = (e) => {
      const innerWidth = window.innerWidth;
      let speed = 60;
      if(innerWidth <= 1600) { speed = 70 }
      if(innerWidth <= 1500) { speed = 80 }
      if(innerWidth <= 1400) { speed = 90 }
      if(innerWidth <= 1300) { speed = 100 }
      if(innerWidth <= 1200) { speed = 110 }
      const moved = (e.pageX - pageX) * speed;
      const start = editLog.start;
      const end = editLog.end + moved;
      const endSecs = moment.duration(endDate.diff(startDate)).asSeconds();
      if(end <= editLog.start) setEditLog({ ...editLog, end: start+1 })
      else if(end <= endSecs) setEditLog({ ...editLog, end });
      else setEditLog({ ...editLog, end: endSecs });
   };

   const leaveEvent = () => {
      const erWrapper = document.querySelector('.DriverLogsWrapper');
      erWrapper && erWrapper.removeEventListener('mousemove', moveEvent);
   }

   return (
      <svg className="setEnd" 
         onMouseDown={e => mouse(e, 'down')}
         onMouseUp={e => mouse(e, 'up')}
         onClick={e => mouse(e, 'up')}
         width="41" height="24" 
         viewBox="0 0 41 24" fill="none">
            <path className={editLog.status} d="M31 24H0V0H4.1H31L41 12L31 24Z"/>
      </svg>

   )
}