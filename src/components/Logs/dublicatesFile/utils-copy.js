import moment from 'moment-timezone';

export const times = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const tz = user && user.company && user.company.tz ? user.company.tz.value : "America/Los_Angeles";
    const queryString = window.location.pathname.split("/");
    const logDate = queryString[queryString.length - 1];
    if (logDate) {
        const startDate = moment.tz(logDate, 'DD-MM-YYYY', tz);
        return {
            startDate,
            tz
        }
    }
    return {
        startDate: moment.tz(tz),
        tz
    }
}

export const serverTime = (timestamp) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const tz = user && user.company && user.company.tz ? user.company.tz.value : "America/Los_Angeles";
    if (timestamp) {
        return moment.tz(timestamp, tz);
    } else {
        return moment.tz(tz);
    }
}

export const isDst = () => {
    const {
        startDate
    } = times();
    return !startDate.isDST() && startDate.add(1, "days").isDST()
};
export const isNotDst = () => {
    const {
        startDate
    } = times();
    return startDate.isDST() && !startDate.add(1, "days").isDST()
};

export const isDrStatus = (st) => (
    st === 'driving' || st === 'personal' || st === 'yard' || st === 'intermediate'
)

export const isOffStatus = (st) => (
    st === 'off' || st === 'sleep'
)

export const isInfoNotDrStatus = (st) => (
    st === 'login' || st === 'logout' ||
    st === 'poweron' || st === 'poweroff'
)

export const checkStatus = (st) => (
    st === 'on' || st === 'yard' ||
    st === 'driving' || st === 'sleep' ||
    st === 'off' || st === 'personal' ||
    st === 'intermediate' ||
    // st === 'malfunction' ||
    st === 'login' || st === 'logout' ||
    st === 'poweron' || st === 'poweroff' ||
    st === 'certify'
);

export const checkStatusChart = (st) => (
    st === 'on' || st === 'yard' ||
    st === 'driving' || st === 'sleep' ||
    st === 'off' || st === 'personal'
);

//========== GET NUMBERS FOM DATE ==========
export const getLogSec = (date) => {
    const {
        startDate,
        tz
    } = times();
    let lDate = moment.tz(date, tz);
    let secs;
    if (startDate.isSameOrBefore(lDate)) {
        secs = moment.duration(lDate.diff(startDate)).asSeconds();
    } else {
        secs = 0
    }

    if (isDst() && secs >= 120 * 60) {
        secs += 60 * 60;
    }
    if (isNotDst() && secs >= 120 * 60) {
        secs -= 60 * 60;
    }

    return secs;
}

//========== GET DATE FROM NUMBERS ==========
export const convertStart = (log) => {
    const {
        startDate
    } = times();
    let time = startDate.startOf("day");

    time.add(log.start || 0, 'second');

    if (isDst() && log.start >= 7200) {
        time.add(-1, 'hour')
    }
    if (isNotDst() && log.start >= 7200) {
        time.add(+1, 'hour')
    }

    return time.toISOString();
}

export const convertEnd = (log, isLast = false) => {
    const {
        startDate,
        tz
    } = times();
    let time = moment.tz(startDate, tz).startOf("day");

    time.add(log.end, 'second');

    if (isDst() && log.end >= 120) {
        time.add(-1, 'hour')
    }
    if (isNotDst() && log.end >= 120) {
        time.add(+1, 'hour')
    }

    if (isLast) {
        time = moment.tz(startDate, tz).endOf('day');
        if (isDst() && log.end >= 120 * 60) {
            time.add(-1, 'hour')
        }
        if (isNotDst() && log.end >= 120 * 60) {
            time.add(+1, 'hour')
        }
    }

    return time.toISOString();
}

export const getEventType = (status) => {
    switch (status) {
        case 'off':
            {
                return 1
            }
        case 'sleep':
            {
                return 1
            }
        case 'driving':
            {
                return 1
            }
        case 'on':
            {
                return 1
            }
        case 'yard':
            {
                return 3
            }
        case 'personal':
            {
                return 3
            }

        case 'intermediate_dr':
            {
                return 2
            }
        case 'intermediate_yard_personal':
            {
                return 2
            }
        case 'certify':
            {
                return 4
            }
        case 'login':
            {
                return 5
            }
        case 'logout':
            {
                return 5
            }
        case 'poweron_dr':
            {
                return 6
            }
        case 'poweron_yard_personal':
            {
                return 6
            }
        case 'poweroff_dr':
            {
                return 6
            }
        case 'poweroff_yard_personal':
            {
                return 6
            }
        default:
            return 1;
    }
}

export const getEventCode = (status, certifyCount) => {
    switch (status) {
        case 'off':
            {
                return 1
            }
        case 'sleep':
            {
                return 2
            }
        case 'driving':
            {
                return 3
            }
        case 'on':
            {
                return 4
            }
        case 'yard':
            {
                return 2
            }
        case 'personal':
            {
                return 1
            }

        case 'intermediate_dr':
            {
                return 1
            }
        case 'intermediate_yard_personal':
            {
                return 2
            }
        case 'certify':
            {
                return certifyCount + 1
            }
        case 'login':
            {
                return 1
            }
        case 'logout':
            {
                return 2
            }
        case 'poweron_dr':
            {
                return 1
            }
        case 'poweron_yard_personal':
            {
                return 2
            }
        case 'poweroff_dr':
            {
                return 3
            }
        case 'poweroff_yard_personal':
            {
                return 4
            }
        default:
            return 1;
    }
}


const getSecs = (date) => {
    const {
        startDate,
        tz
    } = times();
    const lDate = moment.tz(date, tz).set('millisecond', 0);
    return moment.duration(lDate.diff(startDate)).asSeconds();
};
// GET RECORD_STATUS 3 OVER 1
const dateRangeOverlaps = (startA, endA, startR, endR) => {
    let bool = false;
    if (startA <= startR && startR < endA) bool = true; // r starts in a
    else if (startA < endR && endR <= endA) bool = true; // r ends in a
    else if (startR <= startA && endA <= endR) bool = true; // a in r
    return bool
}

export const injectRequestedLogs = (logs, timestmp) => {
    const activeLogs = [];
    const requestedLogs = [];

    logs.forEach(log => {
        if (log.record_status === 1) {
            activeLogs.push({ ...log
            })
        } else if (log.record_status === 3) {
            requestedLogs.push({ ...log
            })
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
        const {
            event_code,
            event_type
        } = log;
        if (+event_type === 1 && +event_code === 1) {
            log.status = 'off';
            return log;
        }
        if (+event_type === 1 && +event_code === 2) {
            log.status = 'sleep';
            return log;
        }
        if (+event_type === 1 && +event_code === 3) {
            log.status = 'driving';
            return log;
        }
        if (+event_type === 1 && +event_code === 4) {
            log.status = 'on';
            return log;
        }

        if (+event_type === 2 && +event_code === 1) {
            log.status = 'intermediate';
            return log;
        }
        if (+event_type === 2 && +event_code === 2) {
            log.status = 'intermediate';
            return log;
        }

        if (+event_type === 3 && +event_code === 1) {
            log.status = 'personal';
            return log;
        }
        if (+event_type === 3 && +event_code === 2) {
            log.status = 'yard';
            return log;
        }

        if (+event_type === 5 && +event_code === 1) {
            log.status = 'login';
            return log;
        }
        if (+event_type === 5 && +event_code === 2) {
            log.status = 'logout';
            return log;
        }

        if (+event_type === 6 && +event_code === 1) {
            log.status = 'poweron';
            return log;
        }
        if (+event_type === 6 && +event_code === 2) {
            log.status = 'poweron';
            return log;
        }
        if (+event_type === 6 && +event_code === 3) {
            log.status = 'poweroff';
            return log;
        }
        if (+event_type === 6 && +event_code === 4) {
            log.status = 'poweroff';
            return log;
        }

        if (+event_type === 7 && +event_code === 1) {
            log.status = 'malfunction';
            return log;
        }
        if (+event_type === 7 && +event_code === 2) {
            log.status = 'malfunction';
            return log;
        }
    }
    return log;
}

export const insertStatusToLogs = (logs) => {
    const newLogs = logs.map(log => {
        return getLogStatus(log);
    });
    return newLogs
}

export const mergeStatus = (data, mainLog) => {
    const logs = data.map(el => ({ ...el
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
                    record_status: log.record_status ? 3 : null
                }
                logs[i - 1] = {
                    ...prev,
                    status: 'delete'
                }
            }
        }
    });

    return logs.filter(el => el.status !== 'delete');
}

export const getSequenceId = (driverId) => {
    let id = 0;
    let sequenceIds = JSON.parse(localStorage.getItem('sequenceIds')) || [];
    if (sequenceIds.length > 0) {
        const index = sequenceIds.findIndex(el => el.driverId === driverId);
        if (index !== -1) {
            const sequenceId = { ...sequenceIds[index]
            };
            id = sequenceId.id + 1;
            sequenceIds[index] = { ...sequenceId,
                id
            };
            localStorage.setItem('sequenceIds', JSON.stringify(sequenceIds));
        } else {
            sequenceIds.push({
                driverId,
                id
            })
            localStorage.setItem('sequenceIds', JSON.stringify(sequenceIds));
        }
    } else {
        sequenceIds.push({
            driverId,
            id
        });
        localStorage.setItem('sequenceIds', JSON.stringify(sequenceIds))
    }
    return id;
}


export const getFilteredLogs = (data, inject = true) => {
    let LOGS = data.logs && data.logs.length > 0 ? data.logs : []
    let vehicle = data.vehicle;
    let timestmp = serverTime(data.timestamp);
    const {startDate,tz} = times();
    
    const endDate = moment.tz(startDate, tz).endOf('day');
    const today = moment.tz(tz);
    const isToday = startDate.isSame(today, 'date');
    // console.log(startDate,isToday, 'utility');

    let chartLogs = [];
    let originalLogs = [];

    if (!inject) {
        LOGS = LOGS.filter(el => el.record_status === 1);
    }

    LOGS.forEach((el, i, logs) => {
        let log = getLogStatus(el);
        log.start_date = log.start_date && moment.tz(log.start_date, tz).isSameOrAfter(startDate) ?
        moment(log.start_date).toISOString() :
        moment(startDate).toISOString();
        log.end_date = log.end_date && moment.tz(log.end_date, tz).isSameOrBefore(endDate) ?
            moment(log.end_date).toISOString() :
            (isToday ?
                moment(data.timestamp).toISOString() :
                endDate.toISOString()
            );
        log.start = getLogSec(log.start_date);
        log.end = getLogSec(log.end_date);

        if (checkStatus(log.status)) {
            log.truck_number = vehicle && vehicle.truck_number;

            if (checkStatusChart(log.status)) {
                if (log.record_status === 1) {
                    const nextLogs = logs.slice(i + 1);
                    const nextLog = nextLogs.find(el => checkStatusChart(el.status) && el.record_status === 1);
                    log.end_date = nextLog ?
                        moment(nextLog.start_date).toISOString() :
                        (isToday ? moment(data.timestamp).toISOString() : endDate.toISOString());
                }

                log.end = getLogSec(log.end_date || timestmp.toISOString());

                chartLogs.push(log)
            }

            originalLogs.push(log);
        }
    });

    if (inject) {
        chartLogs = injectRequestedLogs(chartLogs, timestmp);
        originalLogs = injectRequestedLogs(originalLogs, timestmp);
    }

    chartLogs.sort((a, b) => a.start - b.start)
    originalLogs.sort((a, b) => a.start - b.start)
    
    let intermediateErr = false;
    return {
        logs: chartLogs,
        originalLogs: originalLogs.map(ol => {
            if (checkStatusChart(ol.status)) {
                intermediateErr = (ol.status !== 'driving' && ol.status !== 'personal' && ol.status !== 'yard');
            }
            if (ol.status === 'intermediate') {
                ol.intermediateErr = intermediateErr
            }
            return {
                ...ol,
                isChecked: false
            }
        })
    }

    // return false;
}