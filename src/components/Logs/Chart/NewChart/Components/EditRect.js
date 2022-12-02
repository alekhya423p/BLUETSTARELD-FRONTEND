import React, { useState, useEffect } from 'react';
// import './EditRect.scss';

import moment from 'moment-timezone';

import { times } from '../../../utils';
import { logWidth } from '../utils';
import { Start, End, SetStart, SetEnd } from '../icons';

export const EditRect = ({log, setLog, isFirst, isLast, today, logDuration}) => {
   const [editLog, setEditLog] = useState(log);
   const [start, setStart] = useState(0);
   const [end, setEnd] = useState(0);

   useEffect(() => {
      setEditLog(log)
   }, [log])

   useEffect(() => {
      let ctrl = false;
      let alt = false;
      let keydownEvent = e => {
         if(e.key === 'Control') { ctrl = true; alt = false; }
         if(e.key === 'Alt') { alt = true; ctrl = false; }

         if(ctrl) {
            if(e.code === 'ArrowRight' && !isFirst) {
               e.preventDefault();
               setStart(1) 
            }
            if(e.code === 'ArrowLeft' && !isFirst) {
               e.preventDefault();
               setStart(-1) 
            }
         }

         if(alt) {
            if(e.code === 'ArrowRight' && !isLast) {
               e.preventDefault();
               setEnd(1) 
            }
            if(e.code === 'ArrowLeft' && !isLast) {
               e.preventDefault();
               setEnd(-1)
            }
         }
      }

      let keyupEvent = e => {
         if(e.key === 'Control') { ctrl = false; }
         if(e.key === 'Alt') { alt = false; }
      }

      document.body.addEventListener('keydown', keydownEvent);
      document.body.addEventListener('keyup', keyupEvent);
      return () => {
         document.body.removeEventListener('keydown', keydownEvent);
         document.body.removeEventListener('keydown', keyupEvent);
      }
   }, [isFirst, isLast]);

   useEffect(() => {
      const {startDate, tz} = times();
      const endDate = moment.tz(startDate, tz).endOf('day');
      const endDay = moment.duration(endDate.diff(startDate)).asSeconds();
      const currDay = moment.duration(moment.tz(tz).diff(startDate)).asSeconds();
      if(start !== 0) {
         let startPoint = editLog.start >= 0 ? (editLog.start + start) : 0;
         startPoint = startPoint < 0 ? 0 : startPoint;
         startPoint = startPoint < editLog.end ? startPoint : editLog.end - 1;
         setEditLog({...editLog, start: startPoint * 60});
         setLog({...editLog, start: startPoint * 60});
         setStart(0);
      }
      if(end !== 0) {
         let endPoint = editLog.end <= endDay ? editLog.end + end : endDay;
         endPoint = endPoint > endDay ? endDay : endPoint;
         
         endPoint = endPoint > editLog.start ? endPoint : editLog.start + 1;
         setEditLog({...editLog, end: endPoint});
         setLog({...editLog, end: endPoint});
         setEnd(0);
      }

      const mouseEvent = () => {
         let start = editLog.start;
         let end = editLog.end;
         setLog({
            ...editLog,
            start, 
            end: today && end > currDay ? currDay - 300 : end
         });
      }
      const graph = document.querySelector('.ChartWrapper');
      if(graph) {
         graph.parentNode.addEventListener('mouseup', mouseEvent);
         graph.parentNode.addEventListener('mouseleave', mouseEvent);
      }
      return () => {
         if(graph) {
            graph.parentNode.removeEventListener('mouseup', mouseEvent);
            graph.parentNode.removeEventListener('mouseleave', mouseEvent);
         }
      }
   }, [start, end, editLog, setLog, today]);

   return (
      editLog &&
      <>
      <span
         className={`EditRect ER-${editLog.status}`}
         style={logWidth(editLog.start, editLog.end)}>
            <Start editLog={editLog} /> 
            <End editLog={editLog} />
            <SetStart 
               editLog={editLog} 
               setEditLog={isFirst ? () => {} : setEditLog}/>
            <SetEnd 
               editLog={editLog} 
               setEditLog={isLast ? () => {} : setEditLog} />
            <span className={`logDuration dur_${log.status}`}>{logDuration}</span>
      </span>
      </>
   )
}
