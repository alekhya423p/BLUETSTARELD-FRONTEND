import { useEffect, useState } from 'react'
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import { getDriverLog } from '../../actions/logAction';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
// import * as actionTypes from '../../constants/actionTypes';
// import Loading from "../layout/Loading";
// import DataTableGraphDetail from "./DataTables/DataTableGraphDetail";
// import { useQuery, useMutation, queryCache } from "react-query";

// import { getVehicleMaster } from "../../actions/vehicleAction"
// import { getUsers } from '../../actions/userAction'
// import { loadCompanyUsers } from '../../actions/companyAction'
import EventFormModal from './EventFormModal';
import MainChart from './Chart/MainChart'
import data from './data.json'
import moment from "moment-timezone";
import {
    clStatus, clStart,
    clEnd
} from "./utilsClipboard";
import {
    checkStatus,
    times,
    // convertStart,
    // convertEnd,
    // getEventType,
    // getEventCode,
    mergeStatus,
    // getSequenceId,
    getFilteredLogs,
    // isDrStatus,
    checkStatusChart,
    isOffStatus,
} from "./utils";
import DriverLogRow from './DriverLogRow'
const DriverGraphDetails = ({ history }) => {

    const dispatch = useDispatch();
    const { event, events } = useSelector(state => state.logs)
    const driverData = data;
    const totalRecords = events ? events.length : 0
    const [logDate, setLogDate] = useState();
    const params = useParams();
    const [showAddAdminModal, setAddAdminModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(false);

    const handleAddAdminClose = () => {
        setAddAdminModal(false);
        setSelectedRowData(false);

    };
    const handleAddAdminShow = () => {
        setAddAdminModal(true);
        setSelectedRowData(false);

    };
    // const selectedData = (data) => {
    //     setSelectedRowData(data);
    //     setAddAdminModal(true);
    // };
    const pageHead = `Log Details(${totalRecords})`
    const shouldIShow = JSON.parse(localStorage.getItem("shouldIShow"));
    const user = JSON.parse(localStorage.getItem("user"));
    const tz = user && user.company && user.company.tz ? user.company.tz.value : "America/Los_Angeles";
    // const nMode = JSON.parse(localStorage.getItem("nMode"));
    const queryString = window.location.pathname.split("/");
    const hash = queryString[queryString.length - 1];
    const id = queryString[queryString.length - 2];
    const date = moment.tz(hash, "DD-MM-YYYY", tz);
    // const safe_pro_features = user && user.config && user.config.safe_pro_features;
    // const pro_features = user && user.config && user.config.pro_features;
    // const pro_features_info = user && user.config && user.config.pro_features_info;
    // const allow_normalize = user && user.config && user.config.allow_normalize;
    const allow_correction = user && user.config && user.config.allow_correction;
    const [startDate, setStartDate] = useState(date);
    const [loader, setLoader] = useState(false);
    const [success, setSuccess] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);
    const [editGraph, setEditGraph] = useState(false);
    const [shifts, setShifts] = useState([]);
    const [cycles, setCycles] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [inters, setInters] = useState([]);
    const [missInters, setMissInters] = useState([]);
    const [certifies, setCertifies] = useState([]);
    const [spinData, setSpinData] = useState(null);
    const [driver, setDriver] = useState({});
    const [formViolations, setFormViolations] = useState([]);
    const [drViolations, setDrViolations] = useState([]);
    const [statusViolations, setStatusViolations] = useState([]);
    const [statusWarnings, setStatusWarnings] = useState([]);
    const [isDriverOnline, setIsDriverOnline] = useState(false);
    const [originalLogs, setOriginalLogs] = useState([]);
    const [logs, setLogs] = useState([]);
    const [offlineLogs, setOfflineLogs] = useState(null);
    // const [offlineModal, setOfflineModal] = useState(false);
    const [prevLog, setPrevLog] = useState(false);
    const [log, setLog] = useState({start: 0,end: 0});
    const [infoLog, setInfoLog] = useState(null);
    const [hasRS3, setHasRS3] = useState(false);
    const [logsTab, setLogsTab] = useState(null);
    const [logChanged, setLogChanged] = useState(false);
    const [noteError, setNoteError] = useState(null);
    // const [transferModal, setTransferModal] = useState(false);
    // const [transferType, setTransferType] = useState(1);
    const [transferWarning, setTransferWarning] = useState(false);
    const [infoLogModal, setInfoLogModal] = useState(false);
    // const [bulkModal, setBulkModal] = useState(false);
    const [today, setToday] = useState(false);
   
    // console.log(infoLog,offlineLogs,hasRS3,logChanged,transferWarning,setLoader,setStartDate,success,isDriverOnline,statusWarnings, statusViolations, formViolations, driver, spinData, setNoteError);

    useEffect(() => {
        // dispatch(getDriverLog(params.logId, hash))
    },[params,dispatch,hash])
    // useEffect(() => {
    //     if (driverData) {
    //         const driverData = driverData
    //     }
    // }, [driverData])
    useEffect(() => {
        let cancel = false;
        let asyncFunc = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (driverData && driverData.driver && user) {
                const driver = driverData.driver;
                document.title = `TT ELD - ${driver.driverName + " " 
                    } - ${user.firstName + " " + user.lastName}`;
            }

            if (driverData) {
                const { startDate, tz } = times();
                let timestamp = moment.tz(driverData.timestamp, tz).toISOString();
                let today = moment.tz(timestamp, tz).dayOfYear() === moment(startDate).dayOfYear();

                if (driverData.shifts) {
                    const { startDate, tz } = times();
                    let tempShifts = [];
                    driverData.shifts.forEach((shift) => {
                        const time = moment.tz(shift, tz);
                        const endDate = moment.tz(startDate, tz).endOf("day");
                        if (
                            moment(time).isSameOrAfter(startDate) &&
                            moment(time).isSameOrBefore(endDate)
                        ) {
                            let secs = moment.duration(time.diff(startDate)).asSeconds();
                            tempShifts.push(secs);
                        }
                    });
                    setShifts(tempShifts);
                } else {
                    setShifts([]);
                }

                if (driverData.cycles) {
                    const { startDate, tz } = times();
                    let tempCycles = [];
                    driverData.cycles.forEach((item) => {
                        let time = moment.tz(item, tz);
                        let flag = time.dayOfYear() === moment(startDate).dayOfYear();
                        if (flag) {
                            tempCycles.push(
                                moment.duration(time.diff(startDate)).asSeconds()
                            );
                        }
                    });
                    setCycles(tempCycles);
                } else {
                    setCycles([]);
                }
                if (driverData.driver) {
                    let dr = driverData.driver;
                    setDriver(dr);
                    let isOnline = true;
                    const tracking = dr && dr.tracking;
                    const date = tracking ? moment.tz(tracking.date, tz) : null;
                    const currTime = moment.tz(tz);
                    if (date) {
                        let difference = moment.duration(currTime.diff(date)).asMinutes();
                        isOnline = difference < 10;
                    } else {
                        isOnline = false;
                    }
                    setIsDriverOnline(isOnline);
                } else {
                    setDriver({});
                    setIsDriverOnline(false);
                }

                if (driverData.worked_hours_today >= 0 && driverData.timers) {
                    setSpinData({
                        wh: driverData.worked_hours_today,
                        timers: driverData.timers,
                    });
                } else {
                    setSpinData(null);
                }

                if (driverData.violations && driverData.violations.length > 0) {
                    let stViols = [];
                    let formViols = [];
                    driverData.violations.forEach((el) => {
                        if (el.key.includes("document") || el.key.includes("sign")) {
                            formViols.push(el);
                        } else {
                            stViols.push(el);
                        }
                    });
                    setStatusViolations(stViols);
                    setFormViolations(formViols);
                } else {
                    setStatusViolations([]);
                    setFormViolations([]);
                }

                if (driverData.warnings && driverData.warnings.length > 0) {
                    let stWarns = [];
                    let warnings = [];
                    const timers = { ...driverData.timers };
                    let chartLogs = driverData.logs.filter((el) =>
                        checkStatusChart(el.status)
                    );
                    let lastLog = chartLogs && chartLogs.length > 0 ? chartLogs[chartLogs.length - 1] : null;
                    const timestamp = driverData.timestamp;
                    driverData.warnings.forEach((el) => {
                        if ( el.key === "break" || el.key === "driving" || el.key === "shift" || el.key === "cycle") {
                            stWarns.push(el);
                            if ( timers && today && shouldIShow && lastLog && !isOffStatus(lastLog.status)) {
                                if (el.key === "driving") {
                                    let time = moment.tz(timestamp, tz).add(Math.round(+timers.driving), "minutes");
                                    let start = moment.tz(startDate, tz).startOf("day");
                                    time = moment.duration(time.diff(start)).asSeconds();
                                    warnings.push({type: "driving",time});
                                } else if (el.key === "shift") {
                                    let time = moment.tz(timestamp, tz).add(Math.round(+timers.shift), "minutes");
                                    let start = moment.tz(startDate, tz).startOf("day");
                                    time = moment.duration(time.diff(start)).asSeconds();
                                    warnings.push({type: "shift",time});
                                } else if (el.key === "cycle") {
                                    let time = moment.tz(timestamp, tz).add(Math.round(+timers.cycle), "minutes");
                                    let start = moment.tz(startDate, tz).startOf("day");
                                    time = moment.duration(time.diff(start)).asSeconds();
                                    warnings.push({type: "cycle",time});
                                }
                            }
                        }
                    });
                    setStatusWarnings(stWarns);
                    setWarnings(warnings);
                } else {
                    setStatusWarnings([]);
                    setWarnings([]);
                }

                if (!editGraph) {
                    let data = driverData;
                    if (data && data.logs) {
                        let { logs, originalLogs } = getFilteredLogs(driverData, true);
                        console.log(logs, 'details');
                        let vehIds = [];
                        if (originalLogs[0] && (originalLogs[0].vehicleId || data.vehicleId)) {
                            vehIds.push(originalLogs[0].vehicleId || data.vehicleId);
                        }
                        const rs3 = driverData.logs.findIndex((log) => log.record_status === 3) !== -1;
                        if (rs3) {
                            setLogsTab("edited");
                        } else {
                            setLogsTab(null);
                        }
                        const certs = [];
                        const interPoints = [];
                        const missInterPoints = [];
                        let lastChartLog;
                        let lastInterPoint;
                        let lastDr;
                        originalLogs.forEach((el, i) => {
                            let vehIndex = vehIds.findIndex((v) => v === el.vehicleId);
                            if (vehIndex === -1 && el.vehicleId) {
                                vehIds.push(el.vehicleId);
                            }
                            if (!rs3 && shouldIShow) {
                                if (el.status === "driving" || el.status === "yard" || el.status === "personal") {
                                    lastDr = { ...el };
                                }
                                // Intermediate logs
                                if (el.status === "intermediate" && lastDr) {
                                    const chartLog = logs.find(
                                        (l) => l.start < el.start && l.end > el.start
                                    );
                                    if (chartLog &&(chartLog.status === "driving" ||chartLog.status === "yard" ||chartLog.status === "personal")) {
                                        interPoints.push({point: el.start,status: lastDr.status});
                                        lastInterPoint = el.start;
                                    } else {
                                        console.log(chartLog);
                                        missInterPoints.push({point: el.start,status: chartLog ? chartLog.status : lastDr.status});
                                    }
                                }
                                if (checkStatusChart(el.status) &&(el.status === "on" ||el.status === "off" ||el.status === "sleep") && lastDr) {
                                    let start = lastInterPoint > lastDr.start ? lastInterPoint : lastDr.start;
                                    let end = lastDr.end;
                                    if (end - start > 3600) {
                                        let endHour = Math.round((end - start) / 3600);
                                        let hours = Math.floor((end - start) / 3600);
                                        hours = hours < endHour ? hours : endHour - 1;
                                        for (let i = 1; i <= hours; i++) {
                                            missInterPoints.push({
                                                point: start + i * 3600,
                                                status: lastDr.status,
                                            });
                                        }
                                    }
                                }

                                // Certify Logs
                                if (el.status === "certify") {
                                    certs.push({
                                        point: el.start,
                                        driver_signature: el.driver_signature,
                                        status: el.status,
                                    });
                                }
                            }
                            if (checkStatusChart(el.status)) {
                                lastChartLog = { ...el };
                            }
                            if (
                                el.status === "certify" &&
                                (lastChartLog.status === "driving" ||
                                    lastChartLog.status === "personal" ||
                                    lastChartLog.status === "yard")
                            ) {
                                el.certifyErr = true;
                            }
                        });

                        if (vehIds && vehIds.length > 0) {
                            const vehicles = [];

                            originalLogs &&
                                originalLogs.forEach((orLog) => {
                                    let veh =
                                        vehicles &&
                                        (orLog.vehicleId
                                            ? vehicles.find((v) => v.id === orLog.vehicleId)
                                            : vehicles.find((v) => v.id === data.vehicleId));
                                    if (veh) {
                                        orLog.logVehicle = { ...veh };
                                    }
                                });
                            logs.forEach((log) => {
                                let veh =
                                    vehicles &&
                                    (log.vehicleId
                                        ? vehicles.find((v) => v.id === log.vehicleId)
                                        : vehicles.find((v) => v.id === data.vehicleId));
                                if (veh) {
                                    log.logVehicle = { ...veh };
                                    log.vehicleId = {
                                        label: veh.truck_number,
                                        value: veh.id,
                                    };
                                }
                            });
                        }

                        if (
                            driverData.violationRanges &&
                            driverData.violationRanges.length > 0
                        ) {
                            const endDate = moment.tz(startDate, tz).endOf("day");
                            const viols = [];
                            driverData.violationRanges.forEach((viol) => {
                                let start = startDate.isAfter(moment.tz(viol.start, tz))
                                    ? moment.tz(startDate, tz)
                                    : moment.tz(viol.start, tz);
                                let end;
                                if (viol.end) {
                                    end = endDate.isBefore(moment.tz(viol.end, tz))
                                        ? moment.tz(endDate, tz)
                                        : moment.tz(viol.end, tz);
                                } else {
                                    end = moment.tz(today ? timestamp : endDate, tz);
                                }

                                logs.forEach((log, i) => {
                                    let lStart = moment.tz(log.start_date, tz);
                                    let lEnd = moment.tz(
                                        log.end_date || (today ? timestamp : endDate),
                                        tz
                                    );
                                    if (
                                        lEnd.isAfter(start) &&
                                        lStart.isSameOrBefore(end) &&
                                        log.status === "driving"
                                    ) {
                                        let violStart = moment.tz(start, tz);
                                        let violEnd = moment.tz(end, tz);
                                        if (lStart.isAfter(start)) {
                                            violStart = moment.tz(lStart, tz);
                                        }
                                        if (lEnd.isBefore(end)) {
                                            violEnd = moment.tz(lEnd, tz);
                                        }
                                        viols.push({
                                            start: moment
                                                .duration(violStart.diff(startDate))
                                                .asSeconds(),
                                            end: moment.duration(violEnd.diff(startDate)).asSeconds(),
                                            status: "driving",
                                        });
                                    }
                                });
                            });
                            setDrViolations(viols);
                        } else {
                            setDrViolations([]);
                        }

                        setOfflineLogs(driverData.offlineLogs);
                        setToday(today);
                        setLogs(logs);
                        setOriginalLogs(originalLogs);
                        setHasRS3(rs3);
                        setInters(interPoints);
                        setMissInters(missInterPoints);
                        setCertifies(certs);
                    }
                }
            }
        };
        !cancel && asyncFunc();

        return () => (cancel = true);
    }, [driverData, tz, editGraph, shouldIShow]);

    useEffect(
        (e) => {
            let cancel = false;
            if (!cancel) {
                let changed = false;
                const checkChanged = () => {
                    if (!prevLog) {
                        return true;
                    }
                    let preVeh = prevLog && prevLog.vehicleId && prevLog.vehicleId.value;
                    let veh = log && log.vehicleId && log.vehicleId.value;
                    return (
                        preVeh !== veh ||
                        log.status !== prevLog.status ||
                        log.note !== prevLog.note ||
                        log.odometr !== prevLog.odometr ||
                        log.engine_hours !== prevLog.engine_hours ||
                        log.record_status !== prevLog.record_status ||
                        log.creator !== prevLog.creator ||
                        log.address !== prevLog.address
                    );
                };
                if (log) {
                    changed = checkChanged();
                    setNoteError(
                        !log.note || log.note === "" || log.note.length < 4
                            ? "Please enter at least 4 symbols"
                            : null
                    );
                    if (changed) {
                        setLogChanged(changed);
                        setPrevLog(log);
                    }
                }
                setTransferWarning(false);
            }
            return () => (cancel = true);
        },
        [log, prevLog]
    );

    useEffect(() => {
        let cancel = false;
        if (!cancel) {
            // const hash = window.location.hash.split(`driver/${id}/`);

            let tz = times().tz;
            let startDate = moment.tz(hash[1], "DD-MM-YYYY", tz);
            let currDate = moment.tz(tz);
            if (startDate.isAfter(currDate)) {
                //   window.location.hash =
                //     hash[0] + `driver/${id}/${currDate.format("DD-MM-YYYY")}`;
                setStartDate(currDate);
            } else {
                setStartDate(startDate);
            }
            setLog(null);
            setEditGraph(false);
            setInters([]);
            setMissInters([]);
            setShifts([]);
            setCycles([]);
            setCertifies([]);
        }
        return () => (cancel = true);
    }, [id,hash]);

    useEffect(() => {
        const { startDate, tz } = times();
        const endDate = moment.tz(startDate, tz).endOf("day");

        let ctrl,
            m = false;
        let keydown = (e) => {
            if (editGraph) {
                if (e.key === "Control") {
                    ctrl = true;
                }
                if (e.key === "m") {
                    m = true;
                }
            }
        };

        let keyup = async (e) => {
            if (editGraph) {
                let { startDate, tz } = times();
                let today = moment.tz(tz);
                let isToday = startDate.isSame(today, "date");

                if (ctrl && m) {
                    let newLogs = [];
                    let text = await navigator.clipboard.readText();
                    text = text.split(/\r?\n/);
                    text = text.filter((el) => clStatus(el.split("\t")[1]));

                    const dayEnd = moment.duration(endDate.diff(startDate)).asSeconds();

                    text.forEach((el, i) => {
                        let isLast = i === text.length - 1;
                        let txtArr = el.split("\t");
                        let nextTxtArr =
                            i < text.length - 1 ? text[i + 1].split("\t") : null;
                        if (i === 0) {
                            console.log(nextTxtArr);
                        }
                        if (txtArr.length >= 8) {
                            const status = clStatus(txtArr[1]);
                            let start = clStart(txtArr[2]);
                            let end =
                                isLast && !isToday
                                    ? dayEnd
                                    : nextTxtArr
                                        ? clStart(nextTxtArr[2])
                                        : clEnd(start, txtArr[3]);
                            let document = txtArr[9] && txtArr[9] !== "" ? txtArr[9] : null;

                            let logObj = {
                                record_status: 3,
                                creator: "Auto",
                                status,
                                start,
                                end,
                                address: txtArr[4],
                                odometr: txtArr[6],
                                engine_hours: txtArr[7],
                                note:
                                    txtArr[8] && txtArr[8] !== ""
                                        ? txtArr[8]
                                        : `${status} inserted!!!`,
                            };
                            if (document) {
                                logObj.document = document;
                            }
                            newLogs.push(logObj);
                        }
                    });

                    if (newLogs.length > 1) {
                        newLogs = newLogs.filter((el) => el.start < el.end);
                        newLogs = mergeStatus(newLogs);
                        let lastLog = newLogs[newLogs.length - 1];
                        lastLog = lastLog.end ? lastLog : null;
                        if (lastLog && lastLog.end < dayEnd && !isToday) {
                            newLogs.push({
                                ...lastLog,
                                status:
                                    newLogs[newLogs.length - 1].status !== "off"
                                        ? "off"
                                        : "sleep",
                                start: lastLog.end,
                                end: dayEnd,
                            });
                        }
                        setLogs(newLogs);
                        setLog(newLogs[newLogs.length - 2]);
                        setCurrentEdit(newLogs.length - 2);
                    }
                }
                if (e.key === "Control") {
                    ctrl = false;
                }
                if (e.key === "m") {
                    m = false;
                }
            }
        };

        if (editGraph) {
            document.addEventListener("keydown", keydown);
            document.addEventListener("keyup", keyup);
        } else {
            document.removeEventListener("keydown", keydown);
            document.removeEventListener("keyup", keyup);
        }

        return () => {
            document.removeEventListener("keydown", keydown);
            document.removeEventListener("keyup", keyup);
        };
    }, [editGraph]);

    useEffect(() => {
        if (!infoLogModal) {
            setInfoLog(null);
        }
    }, [infoLogModal]);

    // const toInitial = async () => {
    //     handleEditRect(-1);
    //     setLog(null);
    // };

    // const refresh = async () => {
    //     handleEditRect(-1);
    //     setLog(null);
    //     setLoader(true);
    //     await driverData.refetch({
    //         date: startDate,
    //         id: id,
    //     });
    //     setLoader(false);
    // };

    const handleEditRect = (index) => {
        if (index === -1) {
            setCurrentEdit(null);
            setEditGraph(false);
            setLog({
                start: null,
                end: null,
            });
        } else if (index === -2) {
            setCurrentEdit(-2);
            setEditGraph(true);
            const { startDate, tz } = times();
            const endDate = moment.tz(startDate, tz).endOf("day");
            const curDate = moment.tz(driverData.timestamp, tz);

            let available = today
                ? moment.duration(curDate.diff(startDate)).asSeconds()
                : moment.duration(endDate.diff(startDate)).asSeconds();
            let startLog =
                available >= 3600
                    ? available / 2 - 1800
                    : available / 2 - available / 3;
            let endLog =
                available >= 3600
                    ? available / 2 + 1800
                    : available / 2 + available / 3;
            setLog({
                start: startLog + 1,
                end: endLog + 1,
                status: "on",
                note: "",
                creator: "Auto",
            });
        } else {
            const newLogs = logs.filter((el) => checkStatus(el.status));
            let tempLog = { ...newLogs[index] };
            if (index === logs.length - 1) {
                tempLog.isLast = true;
            }
            setEditGraph(true);
            setCurrentEdit(index);
            setLog({ ...log, ...tempLog, note: tempLog.note || "" });
        }
    };

    // const handleUpload = async () => {
    //     const invalidLogIndex = logs.findIndex((log) => {
    //         return log.record_status === 3 && (!log.note || log.note.length < 4);
    //     });
    //     if (invalidLogIndex !== -1) {
    //         setLog(logs[invalidLogIndex]);
    //         setCurrentEdit(invalidLogIndex);
    //         const noteLabel = document.querySelector(".NoteLabel");
    //         noteLabel &&
    //             noteLabel.scrollIntoView({
    //                 block: "start",
    //                 behavior: "smooth",
    //             });
    //     } else {
    //         let newLogs = [];
    //         logs.forEach((log, i) => {
    //             if (log.record_status === 3) {
    //                 const prev1 =
    //                     logs[i - 1] && logs[i - 1].record_status !== 3
    //                         ? { ...logs[i - 1] }
    //                         : null;
    //                 const next1 =
    //                     logs[i + 1] && logs[i + 1].record_status !== 3
    //                         ? { ...logs[i + 1] }
    //                         : null;

    //                 let newLog = {
    //                     note: log.note,
    //                     record_status: 3,
    //                     coordinates: log.coordinates,
    //                     sequenceId: getSequenceId(driverData.id),
    //                     address: log.address,
    //                     odometr: log.odometr ? +log.odometr : -1,
    //                     engine_hours: +log.engine_hours > 0 ? +log.engine_hours : -1,
    //                     document: log.document,
    //                     trailer: log.trailer,
    //                     client_id: '31232132',
    //                     status: log.status,
    //                     event_type: getEventType(log.status),
    //                     event_code: getEventCode(log.status),

    //                     start_date: prev1 ? prev1.end_date : convertStart(log),
    //                     //   end_date: next1
    //                     //     ? next1.start_date
    //                     //     : today && i === logs.length - 1
    //                     //     ? null
    //                     //     : i === logs.length - 1
    //                     //     ? convertEnd(log, true)
    //                     //     : convertEnd(log),
    //                 };
    //                 if (log.vehicleId && log.vehicleId.value) {
    //                     newLog.vehicleId = log.vehicleId.value;
    //                 }
    //                 newLogs.push(newLog);
    //             }
    //         });

    //         // const { startDate } = times();

    //         console.log(
    //             newLogs
    //                 .filter((el) => !!el.start_date)
    //                 .map((el) => ({
    //                     start_date: el.start_date,
    //                     end_date: el.end_date,
    //                     status: el.status,
    //                     vehicleId: el.vehicleId,
    //                 }))
    //         );

    //         // await logMut({
    //         //   id: driverData.driverId,
    //         //   logs: newLogs.filter((el) => !!el.start_date),
    //         //   date: startDate.format("DD-MM-YYYY"),
    //         // });
    //         await refresh();
    //         // sendEvent("Daily Log Send", "click");
    //     }
    // };

    // const onSubmit = async () => {
    //     let tempLogs = logs.map((el) => ({ ...el }));

    //     const sameLogIndex = tempLogs.findIndex(
    //         (el) => el.start === log.start && el.end === log.end
    //     );

    //     if (sameLogIndex >= 0) {
    //         console.log("sameLogIndex >= 0");
    //         let mainLog = {
    //             ...log,
    //             record_status: getRecordStatus(tempLogs[sameLogIndex]),
    //         };
    //         tempLogs[sameLogIndex] = { ...mainLog };
    //         tempLogs = mergeStatus(tempLogs, mainLog);

    //         let currIndex = tempLogs.findIndex(
    //             (el) =>
    //                 log.start >= el.start &&
    //                 log.start < el.end &&
    //                 log.end > el.start &&
    //                 log.end <= el.end
    //         );
    //         if (currIndex >= 0) {
    //             handleEditRect(currIndex);
    //             setLog({
    //                 ...tempLogs[currIndex],
    //             });
    //         }
    //         setLogs(tempLogs);
    //         await sleep(10);
    //         setLogChanged(false);
    //     } else {
    //         let newLogs = [];

    //         const startIn = logs.findIndex(
    //             (el) => el.start <= log.start && el.end > log.start
    //         );
    //         const endIn = logs.findIndex(
    //             (el) => el.start < log.end && el.end >= log.end
    //         );

    //         console.log(startIn, endIn);

    //         if (currentEdit >= 0) {
    //             console.log("currentEdit >= 0");
    //             if (startIn < currentEdit) {
    //                 console.log("startIn < currentEdit");
    //                 for (let i = 0; i < startIn; i++) {
    //                     newLogs.push(tempLogs[i]);
    //                 }
    //                 if (tempLogs[startIn] && tempLogs[startIn].end !== log.start) {
    //                     newLogs.push({
    //                         ...tempLogs[startIn],
    //                         end: log.start,
    //                         note: tempLogs[startIn]
    //                             ? tempLogs[startIn].note
    //                             : `${tempLogs[startIn].status} log`,
    //                         record_status: 3,
    //                         creator: "Admin",
    //                     });
    //                 }

    //                 newLogs.push({ ...log, record_status: 3, creator: "Admin" });
    //             }

    //             if (startIn > currentEdit) {
    //                 console.log("startIn > currentEdit");
    //                 for (let i = 0; i < currentEdit; i++) {
    //                     newLogs.push(tempLogs[i]);
    //                 }
    //                 if (currentEdit - 1 >= 0) {
    //                     newLogs.push({
    //                         ...tempLogs[currentEdit - 1],
    //                         end: log.start,
    //                         note:
    //                             tempLogs[currentEdit - 1].note ||
    //                             `${tempLogs[currentEdit - 1].status} log`,
    //                         record_status: 3,
    //                         creator: "Admin",
    //                     });
    //                 }
    //                 newLogs.push({ ...log, record_status: 3, creator: "Admin" });
    //                 newLogs.push({
    //                     ...tempLogs[endIn],
    //                     start: log.end,
    //                     note: tempLogs[endIn].note || `${tempLogs[endIn].status} log`,
    //                     record_status: 3,
    //                     creator: "Admin",
    //                 });
    //             }

    //             if (endIn < currentEdit) {
    //                 console.log("endIn < currentEdit");
    //                 if (tempLogs[currentEdit + 1]) {
    //                     newLogs.push({
    //                         ...tempLogs[currentEdit + 1],
    //                         start: log.end,
    //                         record_status: 3,
    //                         note:
    //                             tempLogs[currentEdit + 1].note &&
    //                                 tempLogs[currentEdit + 1].note !== ""
    //                                 ? tempLogs[currentEdit + 1].note
    //                                 : `${tempLogs[currentEdit + 1].status} log`,
    //                     });
    //                 }
    //                 for (let i = tempLogs.length - 1; i > currentEdit + 1; i--) {
    //                     newLogs.push(tempLogs[i]);
    //                 }
    //             }

    //             if (endIn > currentEdit) {
    //                 console.log("endIn > currentEdit");
    //                 newLogs.push({
    //                     ...tempLogs[endIn],
    //                     start: log.end,
    //                     record_status: 3,
    //                     note:
    //                         tempLogs[endIn].note && tempLogs[endIn].note !== ""
    //                             ? tempLogs[endIn].note
    //                             : `${tempLogs[endIn].status} log`,
    //                 });
    //                 for (let i = tempLogs.length - 1; i > endIn; i--) {
    //                     newLogs.push(tempLogs[i]);
    //                 }
    //             }

    //             if (startIn === currentEdit) {
    //                 console.log("startIn === currentEdit");
    //                 for (let i = 0; i < startIn; i++) {
    //                     newLogs.push(tempLogs[i]);
    //                 }
    //                 if (
    //                     tempLogs[startIn - 1] &&
    //                     log.start !== tempLogs[startIn - 1].end
    //                 ) {
    //                     newLogs.push({
    //                         ...tempLogs[startIn - 1],
    //                         end: log.start,
    //                         record_status: 3,
    //                         note: tempLogs[startIn - 1]
    //                             ? tempLogs[startIn - 1].note
    //                             : `${tempLogs[startIn - 1].status} log`,
    //                         creator: "Admin",
    //                     });
    //                 }
    //                 newLogs.push({ ...log, record_status: 3, creator: "Admin" });
    //             }

    //             if (endIn === currentEdit) {
    //                 console.log("endIn === currentEdit");
    //                 if (tempLogs[endIn + 1] && log.end !== tempLogs[endIn + 1].start) {
    //                     newLogs.push({
    //                         ...tempLogs[endIn + 1],
    //                         start: log.end,
    //                         record_status: 3,
    //                         note: tempLogs[endIn + 1]
    //                             ? tempLogs[endIn + 1].note
    //                             : `${tempLogs[endIn + 1].status} log`,
    //                         creator: "Admin",
    //                     });
    //                 }
    //                 newLogs.push({ ...log, record_status: 3, creator: "Admin" });
    //                 for (let i = tempLogs.length - 1; i >= endIn + 1; i--) {
    //                     newLogs.push(tempLogs[i]);
    //                 }
    //             }
    //         } else {
    //             console.log("currentEdit === -1");
    //             for (let i = 0; i < startIn; i++) {
    //                 newLogs.push({ ...tempLogs[i] });
    //             }

    //             newLogs.push({
    //                 ...tempLogs[startIn],
    //                 end: log.start,
    //                 record_status: 3,
    //                 note: tempLogs[startIn]
    //                     ? tempLogs[startIn].note
    //                     : `${tempLogs[startIn].status} log`,
    //                 creator: "Admin",
    //             });
    //             newLogs.push({ ...log, record_status: 3, creator: "Admin" });
    //             newLogs.push({
    //                 ...tempLogs[endIn],
    //                 start: log.end,
    //                 record_status: 3,
    //                 note: tempLogs[endIn]
    //                     ? tempLogs[endIn].note
    //                     : `${tempLogs[endIn].status} log`,
    //                 creator: "Admin",
    //             });
    //             for (let i = tempLogs.length - 1; i >= endIn + 1; i--) {
    //                 newLogs.push({ ...tempLogs[i] });
    //             }
    //         }

    //         newLogs = newLogs
    //             .sort((a, b) => a.start - b.start)
    //             .filter((el) => el.start < el.end);

    //         newLogs = mergeStatus(newLogs);

    //         let currIndex = newLogs.findIndex(
    //             (el) =>
    //                 log.start >= el.start &&
    //                 log.start < el.end &&
    //                 log.end > el.start &&
    //                 log.end <= el.end
    //         );
    //         if (currIndex >= 0) {
    //             handleEditRect(currIndex);
    //             setLog({ ...newLogs[currIndex] });
    //         }
    //         setLogs(newLogs);
    //         await sleep(10);
    //         setLogChanged(false);
    //     }
    // };
    // const getRecordStatus = (oldLog) => {
    //     let oldVeh = oldLog && oldLog.vehicleId && oldLog.vehicleId.value;
    //     let veh = log && log.vehicleId && log.vehicleId.value;
    //     if (
    //         oldLog.status !== log.status ||
    //         oldLog.note !== log.note ||
    //         oldLog.engine_hours !== log.engine_hours ||
    //         oldLog.odometr !== log.odometr ||
    //         oldLog.trailer !== log.trailer ||
    //         oldLog.document !== log.document ||
    //         oldLog.address !== log.address ||
    //         // !deepEqual(oldLog.coordinates, log.coordinates) ||
    //         oldVeh !== veh
    //     ) {
    //         return 3;
    //     } else {
    //         return log.record_status;
    //     }
    // };

    // const onCorrectLog = () => handleEditRect(0);

    // const changeLogsTab = (type) => {
    //     if (type === "current") {
    //         const { logs, originalLogs } = getFilteredLogs(driverData, false);
    //         setLogs(logs);
    //         setOriginalLogs(originalLogs);
    //     }
    //     if (type === "edited") {
    //         const { logs, originalLogs } = getFilteredLogs(driverData, true);
    //         setLogs(logs);
    //         setOriginalLogs(originalLogs);
    //     }
    //     setLogsTab(type);
    // };

    // const sleep = (time) => new Promise((res) => setTimeout(res, time));

    // const getCurrentStatus = () => {
    //     const curStatus = driver.status ? driver.status.status : "";
    //     if (curStatus) {
    //         return curStatus;
    //     }
    //     return null;
    // };

    // const showTransfer1 = () => {
    //     const curSt = getCurrentStatus();
    //     const logSt = log.status;

    //     return (
    //         curSt !== "driving" && logSt !== "driving" && !hasRS3 && pro_features
    //     );
    // };

    // const showTransfer2 = () => {
    //     const curSt = getCurrentStatus();
    //     const logSt = log.status;

    //     return (
    //         curSt !== "driving" && logSt !== "driving" && !hasRS3 && safe_pro_features
    //     );
    // };

    // const showNormalize = () =>
    //     log &&
    //     (log.status === "driving" ||
    //         log.status === "personal" ||
    //         log.status === "yard") &&
    //     allow_normalize &&
    //     !hasRS3;

    // const timerLoading = () => {
    //     return driverData.status === "loading" || loader;
    // };

    // const getEngineWarning = () => {
    //     const logIndex = logs.findIndex(
    //         (el) => el.start === log.start && el.end === log.end
    //     );
    //     const nxtLog = logs[logIndex + 1];
    //     if (nxtLog && nxtLog.engine_hours - log.engine_hours > 0) {
    //         const diff = Math.round((nxtLog.engine_hours - log.engine_hours) * 60);
    //         let hours = Math.floor(diff / 60);
    //         let mins = diff - hours * 60;

    //         hours = hours > 0 ? `${hours}h${mins > 0 ? ":" : ""}` : "";
    //         mins = mins > 0 ? `${mins}m` : "";
    //         return hours + mins;
    //     } else {
    //         return null;
    //     }
    // };

    // const getCodriverLink = (coDriver) => {
    //     return `/admin/logs/driver/${coDriver.id}/${date.format("DD-MM-YYYY")}`;
    // };
    console.log(logs, 'test log');
    return (
        <>
            <div id="logout-wrapper">
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <form className="search-data">
                                            <div className="row">
                                                <div className="col-12 col-md-4">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group p-0 tp-info">
                                                                <ul className="p-0 list-unstyled">
                                                                    <li><small>Driver:</small> <b>{driverData?.driver?.driverName}</b></li>
                                                                    <li><small>Co-Driver:</small> <b>{driverData?.driver?.coDriverName ? driverData?.driver?.coDriverName : 'NA'}</b></li>
                                                                    <li><small>Vehicle:</small> <b>{driverData?.info?.vehicleNumber}</b><i className="ti ti-send font-size-18 text-success"></i></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 p-0">
                                                            <div className="form-group p-0 tp-info">
                                                                <ul className="p-0 list-unstyled sm2">
                                                                    <li><small>Trailers:</small> <b>{driverData?.info?.trailers ? driverData?.info?.trailers : 'NA'}</b></li>
                                                                    <li><small>Shipping Docs:</small> <b className="text-danger">{driverData?.info?.shippingDocument}</b></li>
                                                                    <li><small>Signature:</small> <b className="text-danger">{driverData?.info?.signature}</b></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-auto col-12 col-md-4 d-flex ">
                                                    <div className="crcl">
                                                        <b className="d-block">{driverData?.timers?.break}</b>
                                                        <small>Break</small>
                                                    </div>
                                                    <div className="crcl">
                                                        <b className="d-block">{driverData?.timers?.driving ? driverData?.timers?.driving : '00:00'}</b>
                                                        <small>Drive</small>
                                                    </div>
                                                    <div className="crcl">
                                                        <b className="d-block">{driverData?.timers?.shift ? driverData?.timers?.shift : '00:00'}</b>
                                                        <small>Shift</small>
                                                    </div>
                                                    <div className="crcl">
                                                        <b className="d-block">{driverData?.timers?.cycle ? driverData?.timers?.cycle : '00:00'}</b>
                                                        <small>Cycle</small>
                                                    </div>
                                                </div>
                                                <div className="col-auto col-md-3 col-12 ml-auto">
                                                    <div className="">
                                                        <div className="input-group date" id="datepicker">
                                                            <button className="btn btn border border-color d-block "><i className="ti ti-chevron-left"></i></button>
                                                            <input type="date" onChange={(e) => setLogDate(e.target.value)} defaultValue={logDate} className="form-control" id="date" />
                                                            <button className="btn btn border border-color d-block "><i className="ti ti-chevron-right"></i></button>
                                                        </div>

                                                        <div className="mt-2">
                                                            <label>
                                                                <button type="button" onClick={() => handleAddAdminShow()} className="btn btn-sm btn-outline-secondary mx-2" ><i className="ti ti-plus"></i> Add Event</button>
                                                            </label>
                                                            <label>
                                                                <button type="button" className="btn btn-sm btn-outline-secondary mx-2"><i className="ti ti-file-download"></i>Download</button>
                                                            </label>
                                                            <label>
                                                                <button className="btn btn border border-color d-block"><i className="ti ti-refresh"></i></button>
                                                            </label>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="my-4">
                                    <MainChart
                      data={!loader ? logs : []}
                      log={log}
                      setLog={setLog}
                      logsLoading={driverData.status === "loading"}
                      drViolations={!loader ? drViolations : []}
                      handleEditRect={
                        allow_correction ? handleEditRect : () => {}
                      }
                      startDate={startDate}
                      editing={{
                        editing: editGraph,
                        index: currentEdit,
                      }}
                      canEdit={logsTab === "edited" || !logsTab}
                      id={id}
                      today={today}
                      shifts={shifts}
                      cycles={cycles}
                      warnings={warnings}
                      tz={tz}
                      noteError={noteError}
                      inters={inters}
                      missInters={missInters}
                      certifies={certifies}
                      setSuccess={setSuccess}
                    />{" "}
                                        {/* <img src="/assets/images/grph2.jpg" className="img-fluid" alt="graph" /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="mnt-brk">
                                        <span className="text-danger">30 Minutes Break Required</span>
                                        <p className="m-0">30 Minutes Break Required</p>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mnt-brk">
                                        <span className="text-danger">30 Minutes Break Required</span>
                                        <p className="m-0">30 Minutes Break Required</p>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="mnt-brk">
                                        <span className="text-danger">30 Minutes Break Required</span>
                                        <p className="m-0">30 Minutes Break Required</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <div className="mb-0">
                                        {/* {loading ?
                                            <Loading /> :
                                            // <DataTableGraphDetail ref={childRef} openModal={selectedData} data={events} mode='edit' countRows={setSelectedRowsCount} />
                                        } */}
                                        {!editGraph && logs && logs.length > 0 ? (
                                            <DriverLogRow
                                            logs={logs || []}
                                            shouldIShow={shouldIShow}
                                            driver={driver}
                                            originalLogs={originalLogs}
                                            setOriginalLogs={setOriginalLogs}
                                            canEdit={logsTab === "edited" || !logsTab}
                                            handleEditRect={handleEditRect}
                                            setInfoLog={setInfoLog}
                                            setInfoLogModal={setInfoLogModal}
                                            allow_correction={allow_correction}
                                            />
                                        ) : null}{" "}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--Add Event Modal --> */}
            <EventFormModal
                open={showAddAdminModal}
                close={handleAddAdminClose}
                data={selectedRowData}
                logDate={logDate}
                onLoad={event}
            />
        </>
    )
}
export default DriverGraphDetails 