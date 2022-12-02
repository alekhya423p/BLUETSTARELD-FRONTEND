import { useEffect, useState, useRef, useImperativeHandle } from 'react'
import { deselectAllCheckboxes, handleCheckChange } from "../../utility/helper";
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import { getDriverLog, getEventCode, getPdfLogs } from '../../actions/logAction';
import { getDriverMaster } from "../../actions/driverAction"
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getVehicleMaster } from "../../actions/vehicleAction"
import { loadCompanyUsers } from '../../actions/companyAction'
import { getELDDevices } from "../../actions/eldDevicesAction"
import EventFormModal from './EventFormModal';
import MainChart from './Chart/MainChart';
import Loading from "../layout/Loading";
import html2canvas from 'html2canvas';
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
// import data from './data.json'
import moment from "moment-timezone";
import { clStatus, clStart, clEnd } from "./utilsClipboard";
import ReassignEvent from './components/ReassignEvent';
import TransferModal from './components/TransferModal';
import {
    checkStatus,
    times,
    // convertStart,
    // convertEnd,
    mergeStatus,
    // getSequenceId,
    getFilteredLogs,
    // isDrStatus,
    checkStatusChart,
    checkCertifyStatus,
    // isOffStatus,
} from "./utils";
import DriverLogRow from './DriverLogRow'
import { TimeNav } from './components/TimeNav'
import LogForm from './components/LogForm';
import {LOAD_GRAPH_LOG_RESET} from '../../constants/actionTypes'
import DriverSpin from './DriverSpin';
import EventFormTechModal from './components/EventFormTechModal';
import EventFormEdithModal from "./components/EditFormModal";
import EventProcessDataModal from "./components/ProcessDataModel";
import BulkEventUpdate from './components/BulkEventUpdate';
import { Violations } from './Violations';
import CompareLog from './components/CompareLog';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

const DriverGraphDetails = ({ history }) => {

    const dispatch = useDispatch();
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const {driverData, event, loading, pdfLogs } = useSelector(state => state.logs)
    
    // const driverData = data;
    const childRef = useRef();
    const params = useParams();
    const [inputActionIds, setActionIds] = useState(null);
    const [inputEventIds, setEventIds] = useState(null);
    const [showAddAdminModal, setAddAdminModal] = useState(false);
    const [inputMenus, setOpenMenus] = useState(false);
    const [showAddEventTechnicianModal, setAddEventTechnicianModal] = useState(false);
    const [eventModalTitle, setEventModalTitle] = useState('');
    const [showEditFormModal, setEditFormModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(false);
    const [processDataModal, setProcessDataModal] = useState(false);
    const [reassignEventModal, setReassignEventModal] = useState(false);
    const [transferModal, setTransferModal] = useState(false);
    const [bulkUpdateEventModal, setBulkUpdateEventModal] = useState(false);
    const [compareLogModal, setCompareLogModal] = useState(false);
    let finalCheck = {}, count = 0;
    const [inputCheckedCount, setinputCheckedCount] = useState(0);
    const [inputCheckedIds, setinputCheckedIds] = useState([]);
    // const shouldIShow = true;
    const shouldIShow = JSON.parse(localStorage.getItem("shouldIShow"));
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const tz = user && user.companyInfo && user.companyInfo.timeZoneId? user.companyInfo.timeZoneId: "America/Los_Angeles";
    const queryString = window.location.pathname.split("/");
    const hash = queryString[queryString.length - 1];
    const id = queryString[queryString.length - 2];
    let convertDate = moment.tz(hash, 'DD/MM/YYYY', tz).format('YYYY-MM-DD')
    const [logDate, setLogDate] = useState(convertDate);
    const date = moment.tz(hash, "DD-MM-YYYY", tz);
    // const allow_system_user = false;
    const allow_system_user = user && user.user && user.user.userType ? (user.user.userType === 'system-technician' || user.user.userType === 'system-administrator') : false;
    const allow_correction = user && user.user && user.user.userType ? (user.user.userType === 'company-administrator' || user.user.userType === 'company-portal-user') : false;
    const [startDate, setStartDate] = useState(date);
    const [success, setSuccess] = useState(false);
    const [logId, setLogId] = useState('');
    const [currentEdit, setCurrentEdit] = useState(null);
    const [editGraph, setEditGraph] = useState(false);
    const [shifts, setShifts] = useState([]);
    const [cycles, setCycles] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [inters, setInters] = useState([]);
    const [missInters, setMissInters] = useState([]);
    const [certifies, setCertifies] = useState([]);
    const [driver, setDriver] = useState({});
    const [formViolations, setFormViolations] = useState([]);
    const [drViolations, setDrViolations] = useState([]);
    const [statusViolations, setStatusViolations] = useState([]);
    const [isDriverOnline, setIsDriverOnline] = useState(false);
    const [originalLogs, setOriginalLogs] = useState([]);
    const [logs, setLogs] = useState([]);
    const [spinData, setSpinData] = useState(null);
    // const [offlineLogs, setOfflineLogs] = useState(null);
    const [prevLog, setPrevLog] = useState(false);
    const [log, setLog] = useState({start: 0,end: 0});
    const [infoLog, setInfoLog] = useState(null);
    // const [hasRS3, setHasRS3] = useState(false);
    const [logsTab, setLogsTab] = useState(null);
    // const [logChanged, setLogChanged] = useState(false);
    const [noteError, setNoteError] = useState(null);
    // const [transferWarning, setTransferWarning] = useState(false);
    const [today, setToday] = useState(false);
    useEffect(() => {
        dispatch({type: LOAD_GRAPH_LOG_RESET})
        dispatch(getVehicleMaster())
        dispatch(getEventCode())
        dispatch(getELDDevices());
        dispatch(getDriverMaster());
        let covertDate = moment.tz(hash, 'DD/MM/YYYY', tz).format('YYYY-MM-DD')
        setLogDate(covertDate);
        dispatch(loadCompanyUsers())
        dispatch(getDriverLog(params.id, covertDate))
    },[params,dispatch,hash,tz])
       
    useEffect(() => {
        if (driverData.logId) setLogId(driverData.logId)
    },[driverData])

    useEffect(() => {
        let cancel = false;
        let asyncFunc = async () => {
            const user = JSON.parse(localStorage.getItem("userInfo"));
            if (driverData && driverData.driver && user) {
                const driver = driverData.driver;
                document.title = `Lucid ELD - ${driver.driverName + " " } - ${user?.user?.firstName + " " + user?.user?.lastName}`;
            }

            if (driverData) {
                const { startDate, tz } = times();
                let timestamp = moment.tz(driverData.timestamp, tz).toISOString();
                let today = moment.tz(timestamp, tz).dayOfYear() === moment(startDate).dayOfYear();
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
                if (driverData.shifts) {
                    const { startDate, tz } = times();
                    let tempShifts = [];
                    driverData.shifts.forEach((shift) => {
                        const time = moment.tz(shift, tz);
                        const endDate = moment.tz(startDate, tz).endOf("day");
                        if (moment(time).isSameOrAfter(startDate) && moment(time).isSameOrBefore(endDate)) {
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
                          tempCycles.push(moment.duration(time.diff(startDate)).asSeconds());
                        }
                    });
                    
                    setCycles(tempCycles);
                  } else {
                    setCycles([]);
                  }
                if (driverData.violations && driverData.violations.length > 0) {
                    let stViols = [];
                    let formViols = [];
                    driverData.violations.forEach((el) => {
                        if (el?.key?.includes("document") || el?.key?.includes("sign")) {
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
                if (driverData.timers) {
                    setSpinData({ timers: driverData.timers});
                } else {
                    setSpinData(null);
                }

                if (!editGraph) {
                    let data = driverData;
                    if (data && data.logs) {
                        let { logs, originalLogs } = getFilteredLogs(driverData, true);
                        let vehIds = [];
                        if (originalLogs[0] && (originalLogs[0].vehicleId || data.vehicleId)) {
                            vehIds.push(originalLogs[0].vehicleId || data.vehicleId);
                        }
                        const rs3 = driverData.logs.findIndex((log) => log.record_status === 'INACTIVE_CHANGED') !== -1;
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
                                if (el.status === "DS_D" || el.status === "DR_IND_YM" || el.status === "DR_IND_PC") {
                                    lastDr = { ...el };
                                }
                                // INTER_NORMAL_PRECISION logs
                                if (el.status === "INTER_NORMAL_PRECISION" && lastDr) {

                                    const chartLog = logs.find(
                                        (l) => l.start < el.start && l.end > el.start
                                    );

                                    if (chartLog &&(chartLog.status === "DS_D" ||chartLog.status === "DR_IND_YM" ||chartLog.status === "DR_IND_PC")) {
                                        interPoints.push({point: el.start,status: lastDr.status});
                                        lastInterPoint = el.start;
                                    } else {
                                        missInterPoints.push({point: el.start,status: chartLog ? chartLog.status : lastDr.status});
                                    }
                                }
                                if (checkStatusChart(el.status) &&(el.status === "DS_ON" ||el.status === "DS_OFF" ||el.status === "DS_SB") && lastDr) {
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
                                // DR_CERT_1 Logs
                                if (el.status === checkCertifyStatus(el.status)) {
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
                            if (el.status === checkCertifyStatus(el.status) && (lastChartLog.status === "DS_D" || lastChartLog.status === "DR_IND_PC" || lastChartLog.status === "DR_IND_YM")) {
                                el.certifyErr = true;
                            }
                        });

                        if (vehIds && vehIds.length > 0) {
                            const vehicles = [];
                            originalLogs &&
                                originalLogs.forEach((orLog) => {
                                    let veh = vehicles &&
                                        (orLog.vehicleId
                                            ? vehicles.find((v) => v.id === orLog.vehicleId)
                                            : vehicles.find((v) => v.id === data.vehicleId));
                                    if (veh) {
                                        orLog.logVehicle = { ...veh };
                                    }
                                });
                            logs.forEach((log) => {
                                let veh = vehicles &&
                                
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

                        if (driverData.violationRanges &&driverData.violationRanges.length > 0) {
                            const endDate = moment.tz(startDate, tz).endOf("day");
                            const viols = [];
                            driverData.violationRanges.forEach((viol) => {
                                let start = startDate.isAfter(moment.tz(viol.startTime, tz)) ? moment.tz(startDate, tz) : moment.tz(viol.startTime, tz);
                                let end;
                                if (viol.endTime) {
                                    end = endDate.isBefore(moment.tz(viol.endTime, tz)) ? moment.tz(endDate, tz) : moment.tz(viol.endTime, tz);
                                } else {
                                    end = moment.tz(today ? timestamp : endDate, tz);
                                }
                                logs.forEach((log, i) => {
                                    let lStart = moment.tz(log.start_date, tz);
                                    let lEnd = moment.tz( log.end_date || (today ? timestamp : endDate), tz);
                                    if (lEnd.isAfter(start) && lStart.isSameOrBefore(end) && checkStatusChart(log.status)) {
                                        let violStart = moment.tz(start, tz);
                                        let violEnd = moment.tz(end, tz);
                                        if (lStart.isAfter(start)) {
                                            violStart = moment.tz(lStart, tz);
                                        }
                                        if (lEnd.isBefore(end)) {
                                            violEnd = moment.tz(lEnd, tz);
                                        }
                                        viols.push({
                                            start: moment.duration(violStart.diff(startDate)).asSeconds(),
                                            end: moment.duration(violEnd.diff(startDate)).asSeconds(),
                                            status: log.status,
                                        });
                                    }
                                });
                            });

                            setDrViolations(viols);
                        } else {
                            setDrViolations([]);
                        }
                        // setOfflineLogs(driverData.offlineLogs);
                        setToday(today);
                        setLogs(logs);
                        setOriginalLogs(originalLogs);
                        setInters(interPoints);
                        setMissInters(missInterPoints);
                        setCertifies(certs);
                    }
                }
            }
        };
        !cancel && asyncFunc();

        return () => (cancel = true);
    }, [driverData, tz, editGraph, shouldIShow,hash]);

    useEffect(() => {
        if(params?.id){
            dispatch(getPdfLogs(params?.id, logDate));
        }        
    },[dispatch, params, logDate]);

    useEffect((e) => {
            let cancel = false;
            if (!cancel) {
                let changed = false;
                const checkChanged = () => {
                    if (!prevLog) return true;
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
                    setNoteError(!log.note || log.note === "" || log.note.length < 4 ? "Please enter at least 4 symbols" : null );
                    if (changed) {
                        // setLogChanged(changed);
                        setPrevLog(log);
                    }
                }
                // setTransferWarning(false);
            }
            return () => (cancel = true);
    },[log, prevLog]);

    useEffect(() => {
        let cancel = false;
        if (!cancel) {
            let tz = times().tz;
            let startDate = moment.tz(hash, "DD-MM-YYYY", tz);
            let currDate = moment.tz(tz);
            if (startDate.isAfter(currDate)) {
                setStartDate(currDate);
            } else {
                setStartDate(startDate);
            }
            setLog(null);
            setOriginalLogs([]);
            setEditGraph(false);
            setInters([]);
            setMissInters([]);
            setShifts([]);
            setCycles([]);
            setCertifies([]);
            setWarnings([])
        }
        return () => (cancel = true);
    }, [id,hash]);

    useEffect(() => {
        const { startDate, tz } = times();
        const endDate = moment.tz(startDate, tz).endOf("day");
        let ctrl, m = false;
        let keydown = (e) => {
            if (editGraph) {
                if (e.key === "Control")  ctrl = true;
                if (e.key === "m")  m = true;
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
                         
                        }
                        if (txtArr.length >= 8) {
                            const status = clStatus(txtArr[1]);
                            let start = clStart(txtArr[2]);
                            let end = isLast && !isToday ? dayEnd : nextTxtArr ? clStart(nextTxtArr[2]) : clEnd(start, txtArr[3]);
                            let document = txtArr[9] && txtArr[9] !== "" ? txtArr[9] : null;
                            let logObj = {
                                record_status: 'INACTIVE_CHANGED',
                                creator: "Auto",
                                status,
                                start,
                                end,
                                address: txtArr[4],
                                odometr: txtArr[6],
                                engine_hours: txtArr[7],
                                note: txtArr[8] && txtArr[8] !== "" ? txtArr[8] : `${status} inserted!!!`,
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
                                status: newLogs[newLogs.length - 1].status !== "DS_OFF" ? "DS_OFF" : "DS_SB",
                                start: lastLog.end,
                                end: dayEnd,
                            });
                        }
                        setLogs(newLogs);
                        setLog(newLogs[newLogs.length - 2]);
                        setCurrentEdit(newLogs.length - 2);
                    }
                }
                if (e.key === "Control") ctrl = false;
                if (e.key === "m") m = false;
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
            let available = today ? moment.duration(curDate.diff(startDate)).asSeconds() : moment.duration(endDate.diff(startDate)).asSeconds();
            let startLog = available >= 3600 ? available / 2 - 1800 : available / 2 - available / 3;
            let endLog = available >= 3600 ? available / 2 + 1800 : available / 2 + available / 3;
            setLog({
                start: startLog + 1,
                end: endLog + 1,
                status: "DS_ON",
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
    const handleAddAdminClose = () => {
        setAddAdminModal(false);
        setSelectedRowData(false);
    };
    const handleAddAdminShow = () => {
        setAddAdminModal(true);
        setSelectedRowData(false);

    };
    const selectedData = (data, type) => {
        setSelectedRowData(data);
        if (type === 'technician-edit-event') {
            setAddEventTechnicianModal(true);
            setEventModalTitle('Edit Event (System Admistrator)')
        }else if(type === 'frozen-event') {
            setAddEventTechnicianModal(true);
            setEventModalTitle('Frozen Event (System Admistrator)')
        }else if(type === 'copy-event') {
            setAddEventTechnicianModal(true);
            setEventModalTitle('Dublicate Event (System Admistrator)')
        }else if(type === 'reassign-event') {
            setEventIds([data.id])
            setReassignEventModal(true);
        }else if(type === 'transfer-event') {
            setEventIds([data.id])
            setTransferModal(true);
        }else if(type === 'company-user') {
            setAddAdminModal(true);
        }
    };
    const findRows = (rows) => {
		setActionIds(rows);
		
	};
    useImperativeHandle(childRef, () => ({
        deSelectAll() {
          count = deselectAllCheckboxes(document);
          setinputCheckedCount(count);
        }
    }));
    const handleChange = (e) => {
        finalCheck = handleCheckChange(e, document, inputCheckedCount, inputCheckedIds);
        setinputCheckedCount(finalCheck.count);
        setinputCheckedIds(finalCheck.checkData);
        setActionIds(finalCheck.checkData);
        if(finalCheck.checkData.length > 0) return setOpenMenus(true)
        else return setOpenMenus(false)
    };
    const handleAddEventTechnicianClose = () => {
        setAddEventTechnicianModal(false);
        setSelectedRowData(false);
    };
    const hamdleProcessDataShow = () => {
        setProcessDataModal(true);
    };
    const handleProcessDataClose = () => {
        setProcessDataModal(false);
    }
   
    const handleAddEventTechnicianShow = () => {
        setAddEventTechnicianModal(true);
        setEventModalTitle('Add Event (System Admistrator)')
        setSelectedRowData(false);
    };

    const handleEditFormShow = () => { 
        setEditFormModal(true);
    }
    const handleFormEditClose = () => {
        setEditFormModal(false);
    };
    const handleReassignModalClose = () => {
        setReassignEventModal(false);
        setSelectedRowData(false);
    }
    const handleTransferModalClose = () => {
        setTransferModal(false);
        setSelectedRowData(false);
    }
    const handleBulkEventModalShow = () => { 
        setBulkUpdateEventModal(true);
        setSelectedRowData(false);
    }
    const handleBulkEventModalClose = () => {
        setBulkUpdateEventModal(false);
        setSelectedRowData(false);
    }
    const handleCompareLogModalClose = () => {
        setCompareLogModal(false);
        setSelectedRowData(false);
    }
    const handleCompareLogShow = () => {
        setCompareLogModal(true);
        setSelectedRowData(false);
    };
    const timerLoading = () => {
        return driverData.status === "loading" || loading;
    };
    const refresh = async () => {
        handleEditRect(-1);
        setLog(null);
        dispatch(getVehicleMaster())
        dispatch(getEventCode())
        let covertDate = moment.tz(hash, 'DD/MM/YYYY', tz).format('YYYY-MM-DD')
        setLogDate(covertDate);
        dispatch(loadCompanyUsers())
        dispatch(getDriverLog(params.id, covertDate))
    };
    const onBulkTransfer = () => {
        setEventIds(inputActionIds)
        setTransferModal(true);
    }
    const onBulkAssign = () => {
        setEventIds(inputActionIds)
        setReassignEventModal(true);
    }

    const handlePdfDownload = async (e) => {

        if(pdfLogs){
            var doc = new jsPDF();

            console.log(doc);
            
            var pdfContent =  pdfLogs?.html;

            //get table html
            var htmlObject = document.createElement('div');
            
            htmlObject.innerHTML = pdfContent.toString();
            return html2canvas(document.querySelector("#graph-chart"),{
                width: 850,
                height: 250,
                scale: 1,
                windowHeight: 250,
                windowWidth: 850,
            }).then(canvas => {
                return canvas.toDataURL("image/jpeg", 1.0);
                // var doc = new jsPDF('landscape');
                // return doc.addImage(newCanvasImg, 'JPEG', 10, 10, 280, 150 );
            }).then((graph)=>{
                // var graph = document.querySelector('#graph-chart');
                // graph = graph.outerHTML;
                         
              
                         
                // var graph = document.getElementById('graph-chart');


              
                htmlObject.getElementsByTagName("h4")[0].insertAdjacentHTML('beforebegin', '<img src="'+ graph +'" />');            
                
                var html = htmlToPdfmake(htmlObject.outerHTML); 
                
                //html to pdf format
                // var html = htmlToPdfmake(pdfContent);
                    
                const documentDefinition = { content: html };
                pdfMake.vfs = pdfFonts.pdfMake.vfs;
                pdfMake.createPdf(documentDefinition).open();
            })
        }

        
        // e.preventDefault()
        // let doc = new jsPDF("landscape", 'pt', 'A4');
        // doc.html(document.getElementById('pdf-view'), {
        //   callback: () => {
        //     doc.save('test.pdf');
        //   }
        // });
    }

    useEffect(() => {
        if(params?.id){
            dispatch(getPdfLogs(params?.id, logDate));
        }
    }, [dispatch, params, logDate]);

    const pageHead = `Log/${driverData?.driver?.driverName}/${moment(logDate).format("LL")}`
 
    return (
        <>
            <div id="logout-wrapper" className={isMode}>
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <form className="search-data data_logs_detail ">
                                            <div className="row">
                                                <div className="col-12 col-md-4">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group p-0 tp-info">
                                                                <ul className="p-0 list-unstyled">
                                                                    <li><small>Driver:</small> <b>  <span className={isDriverOnline ? "drOnline" : "drOffline"}>{" "}</span>{" "}{driverData?.driver?.driverName}</b></li>
                                                                    {/* <li><small>Co-Driver:</small><b className='text-info'></b>Aishu</li><i className="ti ti-file-stack font-size-18 text-info plane-right"></i> */}
                                                                    {driverData?.driver?.coDriverName ?                   
                                                                    <li><small>Co-Driver:</small> <b className='text-info'><Link to={`/driver/graph-detail/${driverData?.driver?.coDriverId}/${moment(logDate).format('DD-MM-YYYY')}`} className="driver-infoLink"  title="switch to co driver">{ driverData?.driver?.coDriverName } </Link></b><i className="ti ti-file-stack font-size-18 text-info plane-right" onClick={() => handleCompareLogShow()}></i></li>
                                                                    : null }
                                                                    <li><small>Vehicle:</small> <b>{driverData?.vehicle?.vehicleNumber}</b></li>
                                                                    {/* <li><small>Vehicle:</small> <b>{driverData?.vehicle?.vehicleNumber}</b><i className="ti ti-send font-size-18 text-success plane-right"></i></li> */}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 p-0">
                                                            <div className="form-group p-0 tp-info">
                                                                <ul className="p-0 list-unstyled sm2">
                                                                    <li><small>Trailers:</small> <b>{driverData?.trailers?.length > 0 ? driverData?.trailers.join(', ') : 'NA'}</b></li>
                                                                    <li><small>Shipping Docs:</small> <b>{driverData?.shippingDocuments?.length > 0 ? driverData?.shippingDocuments.join(', ') : <span className="text-danger">Missing</span> }</b></li>
                                                                    <li><small>Signature:</small> <b>{driverData?.isCertified? 'Certified' : <span className="text-danger">Uncertified</span>}</b></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-auto col-12 col-md-4 d-inline-block p-0 align-center ">
                                                    {today && spinData ? <DriverSpin today={today} timers={spinData.timers} /> : null}
                                                </div>
                                                <div className="col-auto col-md-3 col-12 ml-auto">
                                                    <div className="">
                                                        <div className='date-slides'>
                                                        <TimeNav
                                                            startDate={startDate}
                                                            setStartDate={setStartDate}
                                                            loading={timerLoading()}
                                                            link
                                                        />
                                                        </div>
                                                        <div className="mt-2">
                                                            <label>
                                                                <button type="button" onClick={() => handleAddAdminShow()} className="btn btn-sm btn-outline-secondary mx-2" ><i className="ti ti-plus"></i> Add Event</button>
                                                            </label>
                                                            <label>
                                                                <button type="button" className="btn btn-sm btn-outline-secondary mx-2" onClick={() => handlePdfDownload()}><i className="ti ti-download"></i>Download</button>
                                                            </label>
                                                            <label>
                                                                <button type='button' className="btn btn border border-color d-block" onClick={() => refresh()}><i className="ti ti-refresh"></i></button>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="graphWrapper row" id="graph-chart">
                                <div className="col-12">
                                    <div className="my-4">
                                       { loading ? <Loading /> : <MainChart
                                            data={!loading ? logs : []}
                                            log={log}
                                            setLog={setLog}
                                            logsLoading={driverData?.status === "loading"}
                                            drViolations={!loading ? drViolations : []}
                                            handleEditRect={
                                                allow_correction ? handleEditRect : () => { }
                                            }
                                            startDate={startDate}
                                            editing={{
                                                editing: editGraph,
                                                index: currentEdit,
                                            }}
                                            canEdit={logsTab === "edited" || !logsTab}
                                            id={params.id}
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
                                            dayLightSavings={driverData?.dayLightSavingsTime}
                                        /> }
                                        
                                    </div>
                                </div>
                            </div>
                            {driverData?.violationRanges?.length > 0 && (
                                <Violations data={driverData.violationRanges} violations={statusViolations} />
                            )}{" "}
                            {allow_system_user ? 
                            <div className='row'>
                                <ul className='data_buttons_edit'>
                                    <li className='data_buttons_edit_li'>
                                        <button type="button" onClick={() => hamdleProcessDataShow()}><i className="ri-loader-2-line"></i> Process Data</button>
                                    </li>
                                    <li className='data_buttons_edit_li'>
                                        <button type="button" onClick={() => handleEditFormShow()}><i className="ti ti-edit" aria-hidden="true"></i> Edit Form</button>
                                    </li>
                                    <li className='data_buttons_edit_li'>
                                        <button type="button" onClick={() => handleAddEventTechnicianShow()}><i className="ti ti-plus"></i> Add Event</button>
                                    </li>
                                    <li className='data_buttons_edit_li'>
                                        <button type='button' onChange={(e) => handleChange(e)} ><input type="checkbox" data-checkboxes="selectAllCheckbox" className="custom-control-input selectAllCheckbox" id="selectAllCheckbox" name="selectAllCheckbox"  /><label htmlFor="selectAllCheckbox" className="custom-control-label mx-1" >Select</label></button>
                                    </li>
                                </ul>
                            </div>
                            : null }
                            <div className='side_fix_button' 
                                style={{
                                    display: inputMenus ? "block" : "none",
                                }}>
                                <ul className='data_buttons_edit'>
                                    <li className='data_buttons_edit_li'>
                                        <button type="button" onClick={() => handleBulkEventModalShow()}><i className="ti ti-edit"></i> Bulk Edit</button>
                                    </li>
                                    <li className='data_buttons_edit_li'>
                                        <button type="button" onClick={() => onBulkAssign()}><i className="ti ti-users"></i> Bulk Reassign</button>
                                    </li>
                                    <li className='data_buttons_edit_li'>
                                        <button onClick={() => onBulkTransfer()} type="button"><i className="ti ti-trash"></i> Bulk Transfer</button>
                                    </li>
                                </ul>
                            </div>
                           
                            <div className="row">
                                <div className="col-12 text-center">
                                    {success ? <span className='text-info'>{success}</span> : null}
                                    <div className="mb-0">
                                        {!editGraph && logs && originalLogs.length > 0 ? (
                                            <DriverLogRow
                                                logs={logs || []}
                                                shouldIShow={shouldIShow}
                                                driver={driver}
                                                originalLogs={originalLogs}
                                                setOriginalLogs={setOriginalLogs}
                                                canEdit={logsTab === "edited" || !logsTab}
                                                handleEditRect={handleEditRect}
                                                setInfoLog={setInfoLog}
                                                allow_correction={allow_correction}
                                                allow_system_user={allow_system_user}
                                                openModal={selectedData}
                                                ref={childRef}
                                                change={findRows}
                                                handleChange={handleChange}
                                                mode='edit'
                                            />
                                        ) : null}{" "}
                                    </div>
                                </div>
                            </div>
                            <LogForm
                                data={driverData}
                                refresh={refresh}
                                date={date}
                                driverId={id}
                                formViolations={formViolations}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--Add Event Modal --> */}
            <EventFormModal open={showAddAdminModal} close={handleAddAdminClose} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} />
            {/* <!--Add Event Modal --> */}
            <EventFormEdithModal open={showEditFormModal} close={handleFormEditClose} data={driverData} logDate={logDate} logId={logId} onLoad={event} driverId={params?.id} />
            {/* <!--Add Event Modal --> */}
            <EventFormTechModal infoLog={infoLog} open={showAddEventTechnicianModal} close={handleAddEventTechnicianClose} title={eventModalTitle} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} />
            {/* <!--Add Event Modal --> */}
            <EventProcessDataModal open={processDataModal} close={handleProcessDataClose} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} />
            {/* <!--Transfer Event Modal --> */}
            <TransferModal ids={inputEventIds} open={transferModal} close={handleTransferModalClose} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} />
            {/* <!--Reassign Event Modal --> */}
            <ReassignEvent ids={inputEventIds} open={reassignEventModal} close={handleReassignModalClose} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} />
            {/* <!--Bulk Update Event Modal --> */}
            <BulkEventUpdate ids={inputActionIds} originalLogs={originalLogs} open={bulkUpdateEventModal} close={handleBulkEventModalClose} data={selectedRowData} logDate={logDate} logId={logId} />
            {/* Compare logs */}
            <CompareLog 
            data={!loading ? logs : []}
            log={log}
            setLog={setLog}
            logsLoading={driverData?.status === "loading"}
            drViolations={!loading ? drViolations : []}
            handleEditRect={
                allow_correction ? handleEditRect : () => { }
            }
            startDate={startDate}
            editing={{
                editing: editGraph,
                index: currentEdit,
            }}
            canEdit={logsTab === "edited" || !logsTab}
            id={params.id}
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
            originalLogs={originalLogs} 
            open={compareLogModal} 
            close={handleCompareLogModalClose} 
            logDate={logDate} logId={logId} 
            coDriver={driverData?.driver}/>
        </>
    )
}
export default DriverGraphDetails 