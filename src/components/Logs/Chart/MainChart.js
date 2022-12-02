import React, { useEffect, Fragment } from 'react';
import '../style.css';
import NewChart from './NewChart';
import moment from 'moment';
import { checkStatusChart, times  } from '../utils';
// import { OffBtn, PCBtn, SbBtn, DrBtn, OnBtn, YMBtn } from './StatusBtn';

const MainChart = ({ data, drViolations, shifts, cycles, warnings, canEdit, editing, log, setLog, handleEditRect, today, logsLoading, id,inters, missInters, certifies, setSuccess, dayLightSavings}) => {
  useEffect(() => {
    if(log) {
      const { startDate, tz } = times();
      let start = moment.tz(startDate, tz).add(log.start, 'second');
      if(moment.tz(start, tz).isBefore(startDate)) { start = moment.tz(startDate, tz) }
    
    }
  }, [log]);
  // const setStatus = (status) => {
  //   let tempLog = { ...log }
  //   tempLog.status = status
  //   setLog(tempLog)
  // }
  return (
    <Fragment>
     <NewChart
        logs={
          logsLoading ? [] : data.filter((el) => checkStatusChart(el.status))
        }
        today={today}
        log={log}
        setLog={setLog}
        violations={editing.editing ? [] : drViolations}
        handleEditRect={canEdit ? handleEditRect : () => {}}
        editing={editing}
        shifts={shifts}
        cycles={cycles}
        warnings={warnings}
        inters={inters}
        missInters={missInters}
        certifies={certifies}
        setSuccess={setSuccess}
        dayLightSavings={dayLightSavings}
      />

      {/* {editing.editing && log && <>
        <div className="control-status mt-4 mb-4">
          <OffBtn status={log.status === 'off'} onClick={() => setStatus('off') } />
          <SbBtn status={log.status === 'sleep'} onClick={() => setStatus('sleep') } />
          <DrBtn status={log.status === 'driving'} onClick={() => setStatus('driving') } />
          <YMBtn status={log.status === 'yard'} onClick={() => setStatus('yard') } />
          <PCBtn status={log.status === 'personal'} onClick={() => setStatus('personal') } />
          <OnBtn status={log.status === 'on'} onClick={() => setStatus('on') } />
        </div>
      </>} */}
    </Fragment>
  );
}


export default MainChart