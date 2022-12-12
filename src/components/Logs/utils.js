import moment from "moment-timezone";

export const times = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const tz = user && user.companyInfo && user.companyInfo.timeZoneId? user.companyInfo.timeZoneId: "America/Los_Angeles";
  // const tz = user && user.company && user.company.tz? user.company.tz.value: "America/Los_Angeles";
  const queryString = window.location.pathname.split("/");
  const logDate = queryString[queryString.length - 1];
  if (logDate) {
    const startDate = moment.tz(logDate, "DD-MM-YYYY", tz);
    return {
      startDate,
      tz,
    };
  }
  return {
    startDate: moment.tz(tz),
    tz,
  };
};

export const serverTime = (timestamp) => {
  // const user = JSON.parse(localStorage.getItem("user"));
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const tz = user && user.companyInfo && user.companyInfo.timeZoneId? user.companyInfo.timeZoneId: "America/Los_Angeles";
  // const tz = user && user.company && user.company.tz ? user.company.tz.value : "America/Los_Angeles";
  if (timestamp) {
    return moment.tz(timestamp, tz);
  } else {
    return moment.tz(tz);
  }
};

export const isDst = () => {
  const { startDate } = times();
  return !startDate.isDST() && startDate.add(1, "days").isDST();
};

export const isNotDst = () => {
  const { startDate } = times();
  return startDate.isDST() && !startDate.add(1, "days").isDST();
};

export const isDrStatus = (st) =>
  st === "DS_D" ||
  st === "DR_IND_PC" ||
  st === "DR_IND_YM" ||
  st === "INTER_NORMAL_PRECISION";

export const isOffStatus = (st) => st === "DS_OFF" || st === "DS_SB";

export const isInfoNotDrStatus = (st) =>
  st === "DR_LOGIN" || st === "DR_LOGOUT" || st === "ENG_UP_NORMAL" || st === "ENG_DOWN_NORMAL";

// export const checkStatus = (st) =>
//   st === "DS_ON" || st === "DR_IND_YM" ||
//   st === "DS_D" || st === "DS_SB" ||
//   st === "DS_OFF" || st === "DR_IND_PC" ||
//   st === "INTER_NORMAL_PRECISION" ||
//   // st === 'malfunction' ||
//   st === "DR_LOGIN" || st === "DR_LOGOUT" ||
//   st === "ENG_UP_NORMAL" || st === "ENG_DOWN_NORMAL" ||
//   st === "DR_CERT_1";
export const checkStatus = (st) => (
  st === 'DS_ON' || st === 'DR_IND_YM' ||
  st === 'DS_D' || st === 'DS_SB' ||
  st === 'DS_OFF' || st === 'DR_IND_PC' ||
  st === 'INTER_NORMAL_PRECISION' ||
  // st === 'malfunction' ||
  st === 'DR_LOGIN' || st === 'DR_LOGOUT' ||
  st === 'ENG_UP_NORMAL' || st === 'ENG_DOWN_NORMAL' ||
  st === 'DR_CERT_1' || st === 'DR_CERT_2' || st === 'DR_CERT_3' ||
  st === 'DR_CERT_4' || st === 'DR_CERT_5' || st === 'DR_CERT_6' ||
  st === 'DR_CERT_7' || st === 'DR_CERT_8' || st === 'DR_CERT_9'
);
export const checkStatusChart = (st) =>
  st === "DS_ON" ||
  st === "DR_IND_YM" ||
  st === "DS_D" ||
  st === "DS_SB" ||
  st === "DS_OFF" ||
  // st === "INTER_NORMAL_PRECISION" ||
  st === "DR_IND_PC";

//========== GET NUMBERS FOM DATE ==========
export const getLogSec = (date) => {
  const { startDate, tz } = times();
  let lDate = moment.tz(date, tz);
  let secs;
  if (startDate.isSameOrBefore(lDate)) {
    secs = moment.duration(lDate.diff(startDate)).asSeconds();
  } else {
    secs = 0;
  }
  if (isDst() && secs >= 120 * 60) {
    secs += 60 * 60;
  }
  if (isNotDst() && secs >= 120 * 60) {
    secs -= 60 * 60;
  }

  return secs;
};

//========== GET DATE FROM NUMBERS ==========
export const convertStart = (log) => {
  const { startDate } = times();
  let time = startDate.startOf("day");
  time.add(log.start || 0, "second");
  if (isDst() && log.start >= 7200) {
    time.add(-1, "hour");
  }
  if (isNotDst() && log.start >= 7200) {
    time.add(+1, "hour");
  }
  return time.toISOString();
};

export const convertEnd = (log, isLast = false) => {
  const { startDate, tz } = times();
  let time = moment.tz(startDate, tz).startOf("day");
  time.add(log.end, "second");
  if (isDst() && log.end >= 120) {
    time.add(-1, "hour");
  }
  if (isNotDst() && log.end >= 120) {
    time.add(+1, "hour");
  }

  if (isLast) {
    time = moment.tz(startDate, tz).endOf("day");
    if (isDst() && log.end >= 120 * 60) {
      time.add(-1, "hour");
    }
    if (isNotDst() && log.end >= 120 * 60) {
      time.add(+1, "hour");
    }
  }

  return time.toISOString();
};

export const getEventType = (status) => {
  switch (status) {
    case "DS_OFF": {
      return 1;
    }
    case "DS_SB": {
      return 1;
    }
    case "DS_D": {
      return 1;
    }
    case "DS_ON": {
      return 1;
    }
    case "DR_IND_YM": {
      return 3;
    }
    case "DR_IND_PC": {
      return 3;
    }
    case "INTER_REDUCED_PERCISION": {
      return 2;
    }
    case "INTER_NORMAL_PRECISION": {
      return 2;
    }
    case "DR_CERT_1": {
      return 4;
    }
    case "DR_LOGIN": {
      return 5;
    }
    case "DR_LOGOUT": {
      return 5;
    }
    case "ENG_UP_NORMAL": {
      return 6;
    }
    case "ENG_UP_REDUCED": {
      return 6;
    }
    case "ENG_DOWN_NORMAL": {
      return 6;
    }
    case "ENG_DOWN_REDUCED": {
      return 6;
    }
    default:
      return 1;
  }
};

export const getEventCode = (status, certifyCount) => {
  switch (status) {
    case "DS_OFF": {
      return 1;
    }
    case "DS_SB": {
      return 2;
    }
    case "DS_D": {
      return 3;
    }
    case "DS_ON": {
      return 4;
    }
    case "DR_IND_YM": {
      return 2;
    }
    case "DR_IND_PC": {
      return 1;
    }
    case "INTER_NORMAL_PRECISION": {
      return 2;
    }
    case "INTER_REDUCED_PERCISION": {
      return 2;
    }
    case "DR_CERT_1": {
      return certifyCount + 1;
    }
    case "DR_LOGIN": {
      return 1;
    }
    case "DR_LOGOUT": {
      return 2;
    }
    case "ENG_UP_NORMAL": {
      return 1;
    }
    case "ENG_UP_REDUCED": {
      return 2;
    }
    case "ENG_DOWN_NORMAL": {
      return 3;
    }
    case "ENG_DOWN_REDUCED": {
      return 4;
    }
    default:
      return 1;
  }
};

const getSecs = (date) => {
  const { startDate, tz } = times();
  const lDate = moment.tz(date, tz).set("millisecond", 0);
  return moment.duration(lDate.diff(startDate)).asSeconds();
};

// GET RECORD_STATUS 3 OVER 1
const dateRangeOverlaps = (startA, endA, startR, endR) => {
  let bool = false;
  if (startA <= startR && startR < endA) bool = true; // r starts in a
  else if (startA < endR && endR <= endA) bool = true; // r ends in a
  else if (startR <= startA && endA <= endR) bool = true; // a in r
  return bool;
};

export const injectRequestedLogs = (logs, timestmp) => {
  const activeLogs = [];
  const requestedLogs = [];

  logs.forEach((log) => {
    if (log.record_status === 'ACTIVE') {
      activeLogs.push({
        ...log,
      });
    } else if (log.record_status === 3) {
      requestedLogs.push({
        ...log,
      });
    }
  });

  let unchangedActiveLogs = activeLogs.filter((alog) => {
    const found = requestedLogs.find((rlog) => {
      return dateRangeOverlaps(
        getSecs(alog.start_date),
        getSecs(alog.end_date || timestmp.toISOString()),
        getSecs(rlog.start_date),
        getSecs(rlog.end_date || timestmp.toISOString())
      );
    });
    return !found;
  });
  const result = [...unchangedActiveLogs, ...requestedLogs];
  return result;
};

// CONVERT "event_type" and "event_code" TO STATUS STRING
export const getLogStatus = (log) => {
  if (log && log.event_code && log.event_type) {
    const { event_code, event_type } = log;
    if (+event_type === 1 && +event_code === 1) {
      log.status = "DS_OFF";
      return log;
    }
    if (+event_type === 1 && +event_code === 2) {
      log.status = "DS_SB";
      return log;
    }
    if (+event_type === 1 && +event_code === 3) {
      log.status = "DS_D";
      return log;
    }
    if (+event_type === 1 && +event_code === 4) {
      log.status = "DS_ON";
      return log;
    }

    if (+event_type === 2 && +event_code === 1) {
      log.status = "INTER_NORMAL_PRECISION";
      return log;
    }
    if (+event_type === 2 && +event_code === 2) {
      log.status = "INTER_REDUCED_PERCISION";
      return log;
    }

    if (+event_type === 3 && +event_code === 1) {
      log.status = "DR_IND_PC";
      return log;
    }
    if (+event_type === 3 && +event_code === 2) {
      log.status = "DR_IND_YM";
      return log;
    }
    if (+event_type === 5 && +event_code === 1) {
      log.status = "DR_LOGIN";
      return log;
    }
    if (+event_type === 5 && +event_code === 2) {
      log.status = "DR_LOGOUT";
      return log;
    }
    if (+event_type === 6 && +event_code === 1) {
      log.status = "ENG_UP_NORMAL";
      return log;
    }
    if (+event_type === 6 && +event_code === 2) {
      log.status = "ENG_UP_REDUCED";
      return log;
    }
    if (+event_type === 6 && +event_code === 3) {
      log.status = "ENG_DOWN_NORMAL";
      return log;
    }
    if (+event_type === 6 && +event_code === 4) {
      log.status = "ENG_DOWN_REDUCED";
      return log;
    }

    if (+event_type === 7 && +event_code === 1) {
      log.status = "ELD_MALF";
      return log;
    }
    if (+event_type === 7 && +event_code === 2) {
      log.status = "ELD_MALF_CLEARED";
      return log;
    }
    if (+event_type === 7 && +event_code === 3) {
      log.status = "ELD_DIAG";
      return log;
    }
    if (+event_type === 7 && +event_code === 4) {
      log.status = "ELD_DIAG_CLEARED";
      return log;
    }
  }
  return log;
};

// CONVERT "event_code" TO event code STRING
export const getLogEventCodeType = (log) => {
  if (log && log.eventCode) {
    const { eventCode } = log;
    switch (eventCode) {
      case "DS_OFF": {
        log.event_type = 1;
        log.event_code = 1;
        return log;
      }
      case "DS_SB": {
        log.event_type = 1;
        log.event_code = 2;
        return log;
      }
      case "DS_D": {
        log.event_type = 1;
        log.event_code = 3;
        return log;
      }
      case "DS_ON": {
        log.event_type = 1;
        log.event_code = 4;
        return log;
      }
      case "DR_IND_YM": {
        log.event_type = 3;
        log.event_code = 2;
        return log;
      }
      case "DR_IND_PC": {
        log.event_type = 3;
        log.event_code = 1;
        return log;
      }
      case "INTER_NORMAL_PRECISION": {
        log.event_type = 2;
        log.event_code = 1;
        return log;
      }
      case "INTER_REDUCED_PERCISION": {
        log.event_type = 2;
        log.event_code = 2;
        return log;
      }
      case "DR_CERT_1": {
        log.event_type = 4;
        log.event_code = 1;
        return log;
      }
      case "DR_CERT_2": {
        log.event_type = 4;
        log.event_code = 3;
        return log;
      }
      case "DR_CERT_3": {
        log.event_type = 4;
        log.event_code = 3;
        return log;
      }
      case "DR_CERT_4": {
        log.event_type = 4;
        log.event_code = 4;
        return log;
      }
      case "DR_CERT_5": {
        log.event_type = 4;
        log.event_code = 5;
        return log;
      }
      case "DR_CERT_6": {
        log.event_type = 4;
        log.event_code = 6;
        return log;
      }
      case "DR_CERT_7": {
        log.event_type = 4;
        log.event_code = 7;
        return log;
      }
      case "DR_CERT_8": {
        log.event_type = 4;
        log.event_code = 8;
        return log;
      }
      case "DR_CERT_9": {
        log.event_type = 4;
        log.event_code = 9;
        return log;
      }
      case "DR_LOGIN": {
        log.event_type = 5;
        log.event_code = 1;
        return log;
      }
      case "DR_LOGOUT": {
        log.event_type = 5;
        log.event_code = 2;
        return log;
      }
      case "ENG_UP_NORMAL": {
        log.event_type = 6;
        log.event_code = 1;
        return log;
      }
      case "ENG_UP_REDUCED": {
        log.event_type = 6;
        log.event_code = 2;
        return log;
      }
      case "ENG_DOWN_NORMAL": {
        log.event_type = 6;
        log.event_code = 3;
        return log;
      }
      case "ENG_DOWN_REDUCED": {
        log.event_type = 6;
        log.event_code = 4;
        return log;
      }
      case "ELD_MALF": {
        log.event_type = 7;
        log.event_code = 1;
        return log;
      }
      case "ELD_MALF_CLEARED": {
        log.event_type = 7;
        log.event_code = 2;
        return log;
      }
      case "ELD_DIAG": {
        log.event_type = 7;
        log.event_code = 3;
        return log;
      }
      case "ELD_DIAG_CLEARED": {
        log.event_type = 7;
        log.event_code = 4;
        return log;
      }
      default:
        return log;
    }
  };
}

export const insertStatusToLogs = (logs) => {
  const newLogs = logs.map((log) => {
    return getLogStatus(log);
  });
  return newLogs;
};

export const mergeStatus = (data, mainLog) => {
  const logs = data.map((el) => ({
    ...el,
  }));

  logs.forEach((log, i) => {
    if (i > 0 && checkStatusChart(log.status)) {
      const prev = logs[i - 1];
      if (prev.status === log.status) {
        // let mLog = mainLog || log
        logs[i] = {
          ...prev,
          start: prev.start,
          end: log.end,
          record_status: log.record_status ? 3 : null,
        };
        logs[i - 1] = {
          ...prev,
          status: "delete",
        };
      }
    }
  });

  return logs.filter((el) => el.status !== "delete");
};

export const getSequenceId = (driverId) => {
  let id = 0;
  let sequenceIds = JSON.parse(localStorage.getItem("sequenceIds")) || [];
  if (sequenceIds.length > 0) {
    const index = sequenceIds.findIndex((el) => el.driverId === driverId);
    if (index !== -1) {
      const sequenceId = {
        ...sequenceIds[index],
      };
      id = sequenceId.id + 1;
      sequenceIds[index] = {
        ...sequenceId,
        id,
      };
      localStorage.setItem("sequenceIds", JSON.stringify(sequenceIds));
    } else {
      sequenceIds.push({
        driverId,
        id,
      });
      localStorage.setItem("sequenceIds", JSON.stringify(sequenceIds));
    }
  } else {
    sequenceIds.push({
      driverId,
      id,
    });
    localStorage.setItem("sequenceIds", JSON.stringify(sequenceIds));
  }
  return id;
};

export const getFilteredLogs = (data, inject = true) => {
let LOGS = data.logs && data.logs.length > 0 ? data.logs : [];
  let timestmp = serverTime(data.timestamp);
  const { startDate, tz } = times();
  const endDate = moment.tz(startDate, tz).endOf("day");
  const today = moment.tz(tz);
  const isToday = startDate.isSame(today, "date");
  let chartLogs = [];
  let originalLogs = [];
  // if (!inject) {
  //   LOGS = LOGS.filter((el) => el.record_status === 1);
  // }
  LOGS.forEach((el, i, logs) => {
    el = getLogEventCodeType(el);
    let log = getLogStatus(el);
    log.eventDate = log.start_date
    log.start_date = log.start_date && moment.tz(log.start_date, tz).isSameOrAfter(startDate) ? moment(log.start_date).toISOString() : moment(startDate).toISOString();
    log.end_date = log.end_date && moment.tz(log.end_date, tz).isSameOrBefore(endDate) ? moment(log.end_date).toISOString() : isToday ? moment(data.timestamp).toISOString() : endDate.toISOString();
    log.start = getLogSec(log.start_date);
    log.end = getLogSec(log.end_date);
    if (checkStatus(log.status)) {
      log.truck_number = el && el.vehicleNumber;
      if (checkStatusChart(log.status)) {
        if (log.record_status === 'ACTIVE') {
          const nextLogs = logs.slice(i + 1);
          const nextLog = nextLogs.find((el) => checkStatusChart(el.status) && el.record_status === 'ACTIVE');
          log.end_date = nextLog ? moment(nextLog.start_date).toISOString() : isToday ? moment(data.timestamp).toISOString() : endDate.toISOString();
          log.end = getLogSec(log.end_date || timestmp.toISOString());
          chartLogs.push(log);
        }
      }
      originalLogs.push(log);
    }
  });

  // if (inject) {
  //   chartLogs = injectRequestedLogs(chartLogs, timestmp);
  //   originalLogs = injectRequestedLogs(originalLogs, timestmp);
  // }

  chartLogs.sort((a, b) => a.start - b.start);
  originalLogs.sort((a, b) => a.start - b.start);
  let intermediateErr = false;
  return {
    logs: chartLogs,
    originalLogs: originalLogs.map((ol) => {
      if (checkStatusChart(ol.status)) {
        intermediateErr = ol.status !== "DS_D" && ol.status !== "DR_IND_PC" && ol.status !== "DR_IND_YM";
      }
      if (ol.status === "INTER_NORMAL_PRECISION") {
        ol.intermediateErr = intermediateErr;
      }
      return {
        ...ol,
        isChecked: false,
      };
    }),
  };
};

export const checkCertifyStatus = (st) => {
  switch (st) {
    case "DR_CERT_1": {
      return 'DR_CERT_1';
    }
    case "DR_CERT_2": {
      return 'DR_CERT_2';
    }
    case "DR_CERT_3": {
      return 'DR_CERT_3';
    }
    case "DR_CERT_4": {
      return 'DR_CERT_4';
    }
    case "DR_CERT_5": {
      return 'DR_CERT_5';
    }
    case "DR_CERT_6": {
      return 'DR_CERT_6';
    }
    case "DR_CERT_7": {
      return 'DR_CERT_7';
    }
    case "DR_CERT_8": {
      return 'DR_CERT_8';
    }
    case "DR_CERT_9": {
      return 'DR_CERT_9';
    }
    default:
      return null;
  }
};

export const getHOSViolation = (events) => {
    let errorLog = [];
    for (let i = 0; i < events.length; i++) {
      if (events[i].regulation.includes("30M_REST_BREAK")) {
        errorLog.push(`30 Mint Rest Break Required`);
      }
      if (events[i].regulation.includes("14H_SHIFT_LIMIT")) {
        errorLog.push(`14 Shift Limit Required`);
      }
      if (events[i].regulation.includes("70H_CYCLE_LIMIT")) {
        errorLog.push(`70 Cycle Limit Required`);
      }
      if (events[i].regulation.includes("11H_DRIVE_LIMIT")) {
        errorLog.push(`11 Drive Limit`);
      }
    }
    return errorLog
};

export const getHOSViolationCalculation = (events) => {
  // const { tz } = times();
  let errorLog = [];
  // let drivingLimitCounter = 2;
  // let workLimitCounter = 0;
  // let drivingBreakCounter = 0;
  // let sleeperResetCounter = 0;
  // let cycleCounter = 0;
  for (let i = 0; i < events.length; i++) {
    // let unixTime = moment(events[i].startTime).valueOf()
    if (events[i].regulation.includes("30M_REST_BREAK")) {
      errorLog.push(`30 Minutes Break Required`);
    }
    // if (events[i].regulation.includes("30M_REST_BREAK")) {
    //   errorLog.push(`30 Min Break Required`);
    // }
    if (events[i].regulation.includes("14H_SHIFT_LIMIT")) {
      errorLog.push(`14 Shift Limit Required `);
    }
    if (events[i].regulation.includes("70H_CYCLE_LIMIT")) {
      errorLog.push(`70 Cycle Limit Required`);
    }
    if (events[i].regulation.includes("11H_DRIVE_LIMIT")) {
      errorLog.push(`11 Drive Limit`);
    }
  }
  return errorLog
};

export const getHOSViolationCalculate = (eventlog) => {
  // let unixTime = moment(events[i].startTime).valueOf()
  if (eventlog === "30M_REST_BREAK") {
    return `30 Minutes Break Required`;
  }
  if (eventlog === "14H_SHIFT_LIMIT") {
    return `14 Shift Limit Required `;
  }
  if (eventlog === "70H_CYCLE_LIMIT") {
    return `70 Cycle Limit Required`;
  }
  if (eventlog === "11H_DRIVE_LIMIT") {
    return `11 Drive Limit`;
  }
};