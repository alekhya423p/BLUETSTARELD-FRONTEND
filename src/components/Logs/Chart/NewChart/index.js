import React, { Fragment, useEffect, useState } from 'react';
// import chartNight from 'https://s3.amazonaws.com/company.resources/ChartNight.png';
// import chartDay from 'https://s3.amazonaws.com/company.resources/ChartDay.png';
import './style.css';
import { verticalLine, logWidth, background } from './utils';
import { times } from '../../utils';
// import { EditRect } from './Components/EditRect'
import { Duration } from './Components/Duration'
import { Shifts } from './Components/Shifts'
import { Cycles } from './Components/Cycles'
import { Warnings } from './Components/Warnings'
import { Dst } from './Components/Dst'
import { Violations } from './Components/Violations'
import { Intermediates } from './Components/Intermediates'
import { Certifies } from './Components/Certifies'
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import { base64 } from './base64images';
// import { Base64 } from 'js-base64';
// import axios from 'axios';
// import {Buffer} from 'buffer';

const NewChart = ({ logs = [], log, setLog, shifts, cycles, warnings, today, editing, handleEditRect, violations = [], inters, missInters, certifies, setSuccess, dayLightSavings }) => { 
  const { isMode } = useSelector(state => state.dashboard);
  const [chart, setChart] = useState((dayLightSavings && dayLightSavings === true) ? base64.dayLight : (isMode === 'onMode') ? base64.chartNight : base64.chartDay);
  const { tz } = times();

  // useEffect(() => {
  //   axios
  //     .get('https://s3.amazonaws.com/company.resources/DaylightGraph.png', {
  //       responseType: 'arraybuffer'
  //     }).then(response => {
  //       let result = Buffer.from(response.data, 'binary').toString('base64')
  //       console.log('data:image/gif;base64,'+ result, 'result')
  //       // setChartDay('data:image/gif;base64,'+result);
  //     }
  //   );
    
  //   axios
  //     .get('https://s3.amazonaws.com/company.resources/ChartDay.png', {
  //       responseType: 'arraybuffer'
  //     }).then(response => {
  //       let result = Buffer.from(response.data, 'binary').toString('base64')
  //       setChartNight('data:image/gif;base64,'+result);
  //     }
  //   );        
  // },[]);

   useEffect(() => {    
      let clickEvent = () => {
        setTimeout(() => {
          setChart((dayLightSavings && dayLightSavings === true) ? base64.dayLight : (isMode === 'onMode') ? base64.chartNight :  base64.chartDay);
        }, 150);
     };
     const modeChanger = document.querySelector(".switch");
     modeChanger && modeChanger.addEventListener("click", clickEvent);

     return () => {
        modeChanger && modeChanger.removeEventListener("click", clickEvent);
     };
    
   }, [isMode, dayLightSavings]);

   const onMouseOver = (index) => {
      let trs = document.querySelectorAll(".DriverLogRow tbody.body tr.item");
      if (trs) {
         trs = Array.from(trs).filter((tr) => {
            const status = tr.querySelector(".status-indicator");
            if (status) {
               return !status.classList.contains("notInfo");
            }
            return false;
         });
         trs.forEach((tr, i) => {
           if (i === index) {
               tr.classList.add("hovered");
            } else {
               tr.classList.remove("hovered");
            }
         });
      }
   };
   
    const getTotal = (log) => {
      let totalSecs = log.end - log.start;
      let h = Math.floor(totalSecs / 3600);
      let m = Math.floor((totalSecs - h * 3600) / 60);
      let s = Math.round(totalSecs - (h * 3600 + m * 60));
      h = h > 0 ? `${h}h${m > 0 || s > 0 ? ":" : ""}` : "";
      m = m > 0 ? `${m}m${s > 0 ? ":" : ""}` : "";
      s = s > 0 ? `${s}s` : "";
      return h + m + s;
    };
   const convertStart = (log) => {
      let secs = moment.tz(log.start_date, tz).format('HH:mm:ss');
      return secs
   };
   const convertEnd = (log) => {
      let secs = moment.tz(log.end_date, tz).format('HH:mm:ss');
      return secs
   };

   return (
      <div className="ChartWrapper">
        <div className="NewChart">
          <img src={chart} alt="img" type="image/png" className="NewChart_img" />
          <div className="statusWrapper">
            {/* {editing.editing && (
              <EditRect
                log={log}
                today={today}
                setLog={setLog}
                isFirst={editing.index === 0}
                isLast={editing.index === logs.length - 1}
                logDuration={getTotal(log)}
              />
            )} */}
            {shifts && <Shifts shifts={shifts} />}
            {cycles && <Cycles cycles={cycles} />}
            {warnings && <Warnings warnings={warnings} />}
            {violations && <Violations violations={violations} />}
            {/* {missInters && missInters.length > 0 && <Intermediates inters={missInters} missInters/>} */}{" "}
            {inters && inters.length > 0 && (
              <Intermediates inters={inters} setSuccess={setSuccess} />
            )}
            {certifies && certifies.length > 0 && (
              <Certifies certifies={certifies} setSuccess={setSuccess} />
            )}
            <Dst />
            {logs.map((log, i) => {

              console.log(logs, 'logs');
              const nextLog = {
                ...logs[i + 1],
              };
              const vertLine = verticalLine(nextLog.status, log.status, log.end);
              const lWidth = logWidth(log.start, log.end);
              const logDuration = getTotal(log);
              const logStart = convertStart(log);
              const logEndDate = convertEnd(log);
              return (
                <Fragment key={i}>
                  <span
                    // onClick={() => onClickLog(i, log)}
                    className={log.status}
                    style={{
                      ...lWidth,
                      ...background(log),
                    }}
                  ></span>
  
                  <span
                    className="rect"
                    onMouseOver={() => onMouseOver(i, log)}
                    onMouseOut={() => onMouseOver(-1, log)}
                    // onClick={() => onClickLog(i, log)}
                    style={lWidth}
                  >
                    {" "}
                    {!editing.editing && (
                     <>
                     <span className="logStart"> {logStart} </span>
                     <span className="logEnd"> {logEndDate} </span>
                     <span className="logDuration"> {logDuration} </span>
                     </>
                    )}{" "}
                  </span>
  
                  {nextLog && vertLine && vertLine.height && (
                    <span className="vertical" style={vertLine}></span>
                  )}
                </Fragment>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
        <Duration logs={logs} />{" "}
      </div>
    );
  };

export default NewChart;
