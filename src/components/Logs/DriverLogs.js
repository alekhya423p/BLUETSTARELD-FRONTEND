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
// import canvg from "canvg";
// import logo from "../Logs/Chart/NewChart/logo.svg";

const DriverGraphDetails = ({ history }) => {

    const dispatch = useDispatch();
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const {driverData, event, loading, pdfLogs } = useSelector(state => state.logs)

    const { user } = useSelector(state => state.auth)

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
    const [isDownload, setIsDownload] = useState(false);
    let finalCheck = {}, count = 0;
    const [inputCheckedCount, setinputCheckedCount] = useState(0);
    const [inputCheckedIds, setinputCheckedIds] = useState([]);
    const allowedUsersForEventsUpdate = ["system-technician" , "system-administrator", "system-super-admin"]
    const shouldIShow = true;
    // const shouldIShow = JSON.parse(localStorage.getItem("shouldIShow"));
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const tz = userInfo && userInfo.companyInfo && userInfo.companyInfo.timeZoneId? userInfo.companyInfo.timeZoneId: "America/Los_Angeles";
    const queryString = window.location.pathname.split("/");
    const hash = queryString[queryString.length - 1];
    const id = queryString[queryString.length - 2];
    let convertDate = moment.tz(hash, 'DD/MM/YYYY', tz).format('YYYY-MM-DD')
    const [logDate, setLogDate] = useState(convertDate);
    const date = moment.tz(hash, "DD-MM-YYYY", tz);
    var userType = user && user.user && user.user.userType;
    // const allow_system_user = false;
    const allow_system_user = user && user.user && user.user.userType ? allowedUsersForEventsUpdate.includes(user.user.userType) : false;
    const allow_correction = user && user.user && user.user.userType ? 
    (user.user.userType === 'company-administrator' || user.user.userType === 'company-portal-user') : false;
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
    const [isTrue, setIsTrue] = useState(false);
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
    console.log(setIsTrue);
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
                                // DR_CERT_1 Logs  // commented for certify eents
                                // if (el.status === checkCertifyStatus(el.status)) {
                                //     certs.push({
                                //         point: el.start,
                                //         driver_signature: el.driver_signature,
                                //         status: el.status,
                                //     });
                                // }
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
                        log.odometer !== prevLog.odometer ||
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
                                odometer: txtArr[6],
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
            setEventModalTitle('Duplicate Event (System Admistrator)')
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

    // const applyConvolution = (sourceImageData, outputImageData, kernel) => {
    //     const src = sourceImageData.data;
    //     const dst = outputImageData.data;
        
    //     const srcWidth = sourceImageData.width;
    //     const srcHeight = sourceImageData.height;
        
    //     const side = Math.round(Math.sqrt(kernel.length));
    //     const halfSide = Math.floor(side / 2);
        
    //     // padding the output by the convolution kernel
    //     const w = srcWidth;
    //     const h = srcHeight;
        
    //     // iterating through the output image pixels
    //     for (let y = 0; y < h; y++) {
    //       for (let x = 0; x < w; x++) {
    //         let r = 0,
    //           g = 0,
    //           b = 0,
    //           a = 0;
              
    //         // calculating the weighed sum of the source image pixels that
    //         // fall under the convolution kernel
    //         for (let cy = 0; cy < side; cy++) {
    //           for (let cx = 0; cx < side; cx++) {
    //             const scy = y + cy - halfSide;
    //             const scx = x + cx - halfSide;
                
    //             if (scy >= 0 && scy < srcHeight && scx >= 0 && scx < srcWidth) {
    //               let srcOffset = (scy * srcWidth + scx) * 4;
    //               let wt = kernel[cy * side + cx];
    //               r += src[srcOffset] * wt;
    //               g += src[srcOffset + 1] * wt;
    //               b += src[srcOffset + 2] * wt;
    //               a += src[srcOffset + 3] * wt;
    //             }
    //           }
    //         }
            
    //         const dstOffset = (y * w + x) * 4;
    //         dst[dstOffset] = r;
    //         dst[dstOffset + 1] = g;
    //         dst[dstOffset + 2] = b;
    //         dst[dstOffset + 3] = a;
    //       }
    //     }
    //     return outputImageData;
    // }
    
    const handlePdfDownload = async (e) => {

        setIsDownload(true);

        if(pdfLogs){
            var doc = new jsPDF();
            console.log(doc);  
            
            // var svg = document.getElementById('svg-container').innerHTML;
 
            // if (svg)
            //     svg = svg.replace(/\r?\n|\r/g, '').trim();

            // var canvasImage = document.createElement('canvas');
            // var contextImage = canvasImage.getContext('2d');


            // contextImage.clearRect(0, 0, canvasImage.width, canvasImage.height);
            // canvg(canvasImage, svg);

            // var imgData = canvasImage.toDataURL('image/png');

            // Generate PDF
           

            // const canvasImage = document.createElement("canvas");
  
            // const contextImage = canvasImage.getContext("2d");
                
            // const canvasImageWidth = 530;
            // const canvasImageHeight = 180;
                
            // canvasImage.width = canvasImageWidth;
            // canvasImage.height = canvasImageHeight;
            
            // contextImage.drawImage(logo, 0, 0, canvasImageWidth, canvasImageHeight);
            
            
            // const sourceImage = contextImage.getImageData(0, 0, canvasImageWidth, canvasImageHeight);
            
            // contextImage.putImageData(sourceImage, 0, 0);
                
            // canvasImage.toDataURL();            
            
            // var svg = document.getElementById('svg-container').innerHTML;
 
            // if (svg)
            //     svg = svg.replace(/\r?\n|\r/g, '').trim();

            // var canvasImage = document.createElement('canvas');
            // var contextImage = canvasImage.getContext('2d');


            // contextImage.clearRect(0, 0, canvasImage.width, canvasImage.height);
            // canvg(canvasImage, svg);

            // var imgData = canvasImage.toDataURL('image/png');

            // Generate PDF
           

            // const canvasImage = document.createElement("canvas");
  
            // const contextImage = canvasImage.getContext("2d");
                
            // const canvasImageWidth = 530;
            // const canvasImageHeight = 180;
                
            // canvasImage.width = canvasImageWidth;
            // canvasImage.height = canvasImageHeight;
            
            // contextImage.drawImage(logo, 0, 0, canvasImageWidth, canvasImageHeight);
            
            
            // const sourceImage = contextImage.getImageData(0, 0, canvasImageWidth, canvasImageHeight);
            
            // contextImage.putImageData(sourceImage, 0, 0);
                
            // canvasImage.toDataURL();            
            
            var pdfContent =  pdfLogs?.html;
            
            //get table html
            var htmlObject = document.createElement('div');

            // console.log(htmlObject, 'htmlObject');
            
            htmlObject.innerHTML = pdfContent.toString();

            // console.log(htmlObject.innerHTML, 'innerHTML');
            
            return html2canvas(document.querySelector("#graph-chart")
            ).then(canvasImg => {
                const canvas = document.createElement("canvas");
  
                const context = canvas.getContext("2d");
                
                const canvasWidth = 530;
                const canvasHeight = 180;
                
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                
                context.drawImage(canvasImg, 0, 0, canvasWidth, canvasHeight);
                context.font = "16px Georgia black";
                
                const sourceImageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
                // const blankOutputImageData = context.createImageData(canvasWidth, canvasHeight);

                // // const finalImg = applyConvolution(sourceImageData, blankOutputImageData,[
                // //     -1, -1, -1, 
                // //    -1, 9, -1,
                // //     -1, -1, -1
                // // ]); 

                context.putImageData(sourceImageData, 0, 0);
                
                return canvas.toDataURL();
                
            }).then((graph)=>{   
                // htmlObject.getElementsByTagName("h1")[0].insertAdjacentHTML('beforebegin', '<img src="'+ imgData +'" />')          
                htmlObject.getElementsByTagName("h2")[0].insertAdjacentHTML('beforebegin', '<img src="'+ graph +'" />');            
                //html to pdf format
                var html = htmlToPdfmake(htmlObject.outerHTML);    
                const documentDefinition = { content: html };

                pdfMake.vfs = pdfFonts.pdfMake.vfs;
                pdfMake.createPdf(documentDefinition).open();
            })
        }
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
                    <div className={userType === "company-administrator" ? "page-content company-admin" :"page-content"}>
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
                                            isDownload= {isDownload}
                                        /> }
                                        
                                    </div>
                                </div>
                            </div>
                            {driverData?.violationRanges?.length > 0 && (
                                <Violations data={driverData.violationRanges} violations={statusViolations} logDate={logDate} />
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
                                                truckNumber={driverData?.vehicle?.vehicleNumber}
                                                logDate={logDate}
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
                                logs = {originalLogs}
                            />
                        </div>
                    </div>
                </div>
            </div>
            { isTrue ? 
            <div id="svg-container" >
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1539.72 352.02">
            <defs>
                {/* <style>
                .cls-1 {
                    fill: #1d2939;
                }

                .cls-2 {
                    fill: #2e90fa;
                }

                .cls-3 {
                    fill: #16b364;
                }

                .cls-4 {
                    fill: #fac515;
                }
                </style> */}
            </defs>
            <g id="Logo">
                <path class="cls-2" d="M255.44,49.88L49.88,255.44c-6.73,6.73-17.95,5.56-23.17-2.4C9.82,227.31,0,196.54,0,163.46,0,73.09,73.09,0,163.46,0c33.07,0,63.85,9.82,89.58,26.71,7.96,5.23,9.13,16.44,2.4,23.17Z"/>
                <path class="cls-3" d="M326.92,163.46c0,33.09-9.83,63.89-26.74,89.62-5.01,7.63-15.6,9.26-22.49,3.27-28.68-24.94-66.16-40.03-107.16-40.03-1.01,0-2.03,0-3.04,.03-13.44,.24-20.26-16.1-10.76-25.6l119.89-119.89c6.73-6.73,17.9-5.55,23.16,2.38,17.15,25.86,27.14,56.87,27.14,90.23Z"/>
                <path class="cls-4" d="M257.75,280.75c5.58,3.95,5.58,12.3,0,16.25-26.64,18.84-59.17,29.91-94.28,29.91s-67.64-11.08-94.28-29.91c-5.59-3.95-5.59-12.3,0-16.25,26.64-18.85,59.17-29.92,94.29-29.92s67.64,11.08,94.29,29.92Z"/>
            </g>
            <g>
                <path class="cls-1" d="M405.1,245.24V81.6h34.6V216.72h70.15v28.52h-104.75Z"/>
                <path class="cls-1" d="M631.6,81.6h34.6v106.27c0,11.93-2.84,22.37-8.51,31.32-5.67,8.95-13.6,15.91-23.77,20.89-10.17,4.98-22.03,7.47-35.56,7.47s-25.46-2.49-35.64-7.47c-10.17-4.98-18.08-11.95-23.73-20.89-5.65-8.95-8.47-19.39-8.47-31.32V81.6h34.6v103.31c0,6.23,1.37,11.77,4.11,16.62,2.74,4.85,6.62,8.66,11.63,11.43,5.01,2.77,10.84,4.16,17.5,4.16s12.56-1.38,17.54-4.16c4.98-2.77,8.84-6.58,11.59-11.43,2.74-4.85,4.11-10.39,4.11-16.62V81.6Z"/>
                <path class="cls-1" d="M836.77,138.89h-35c-.64-4.53-1.95-8.56-3.92-12.1-1.97-3.54-4.5-6.56-7.59-9.07-3.09-2.5-6.64-4.42-10.67-5.75-4.02-1.33-8.38-2-13.06-2-8.47,0-15.85,2.09-22.13,6.27-6.29,4.18-11.16,10.25-14.62,18.22-3.46,7.96-5.19,17.62-5.19,28.96s1.74,21.47,5.23,29.4c3.49,7.94,8.38,13.93,14.66,17.98,6.28,4.05,13.56,6.07,21.81,6.07,4.63,0,8.93-.61,12.9-1.84,3.97-1.22,7.5-3.02,10.59-5.39,3.09-2.37,5.66-5.26,7.71-8.67,2.05-3.41,3.48-7.3,4.27-11.67l35,.16c-.91,7.51-3.16,14.74-6.75,21.69-3.6,6.95-8.42,13.16-14.46,18.62-6.05,5.46-13.24,9.78-21.57,12.94-8.34,3.17-17.75,4.75-28.25,4.75-14.6,0-27.63-3.3-39.11-9.91-11.48-6.6-20.53-16.17-27.17-28.68-6.63-12.52-9.95-27.67-9.95-45.46s3.36-33.02,10.07-45.54c6.71-12.52,15.82-22.07,27.33-28.64,11.51-6.58,24.45-9.87,38.83-9.87,9.48,0,18.28,1.33,26.41,4,8.12,2.66,15.33,6.54,21.61,11.63,6.28,5.09,11.41,11.31,15.38,18.66,3.97,7.35,6.51,15.77,7.63,25.25Z"/>
                <path class="cls-1" d="M893.97,81.6V245.24h-34.6V81.6h34.6Z"/>
                <path class="cls-1" d="M978.25,245.24h-58.01V81.6h58.49c16.46,0,30.63,3.26,42.51,9.79,11.88,6.53,21.03,15.89,27.45,28.08,6.42,12.2,9.63,26.79,9.63,43.79s-3.21,31.69-9.63,43.95c-6.42,12.25-15.61,21.65-27.57,28.2-11.96,6.55-26.25,9.83-42.87,9.83Zm-23.41-29.64h21.97c10.23,0,18.84-1.82,25.85-5.47,7-3.65,12.28-9.32,15.82-17.02,3.54-7.7,5.31-17.64,5.31-29.84s-1.77-21.97-5.31-29.64c-3.54-7.67-8.8-13.32-15.78-16.94-6.98-3.62-15.58-5.43-25.81-5.43h-22.05v104.35Z"/>
                <path class="cls-1" d="M1131.55,245.24V81.6h110.26v28.52h-75.67v38.99h69.99v28.52h-69.99v39.07h75.99v28.52h-110.58Z"/>
                <path class="cls-1" d="M1267.13,245.24V81.6h34.6V216.72h70.15v28.52h-104.75Z"/>
                <path class="cls-1" d="M1450.56,245.24h-58.01V81.6h58.49c16.46,0,30.63,3.26,42.51,9.79,11.88,6.53,21.03,15.89,27.45,28.08,6.42,12.2,9.63,26.79,9.63,43.79s-3.21,31.69-9.63,43.95c-6.42,12.25-15.61,21.65-27.57,28.2-11.96,6.55-26.25,9.83-42.87,9.83Zm-23.41-29.64h21.97c10.23,0,18.84-1.82,25.85-5.47,7-3.65,12.28-9.32,15.82-17.02,3.54-7.7,5.31-17.64,5.31-29.84s-1.77-21.97-5.31-29.64c-3.54-7.67-8.8-13.32-15.78-16.94-6.98-3.62-15.58-5.43-25.81-5.43h-22.05v104.35Z"/>
            </g>
            </svg>
            </div> : ""
            }
            
            {/* <!--Add Event Modal --> */}
            <EventFormModal open={showAddAdminModal} close={handleAddAdminClose} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} truckId={driverData?.vehicle?.vehicleId} truckNo={driverData?.vehicle?.vehicleNumber} />
            {/* <!--Add Event Modal --> */}
            <EventFormEdithModal open={showEditFormModal} close={handleFormEditClose} data={driverData} logDate={logDate} logId={logId} onLoad={event} driverId={params?.id} truckId={driverData?.vehicle?.vehicleId} truckNo={driverData?.vehicle?.vehicleNumber} />
            {/* <!--Add Event Modal --> */}
            <EventFormTechModal infoLog={infoLog} open={showAddEventTechnicianModal} close={handleAddEventTechnicianClose} title={eventModalTitle} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} truckId={driverData?.vehicle?.vehicleId} truckNo={driverData?.vehicle?.vehicleNumber} />
            {/* <!--Add Event Modal --> */}
            <EventProcessDataModal open={processDataModal} close={handleProcessDataClose} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} />
            {/* <!--Transfer Event Modal --> */}
            <TransferModal ids={inputEventIds} open={transferModal} close={handleTransferModalClose} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} />
            {/* <!--Reassign Event Modal --> */}
            <ReassignEvent ids={inputEventIds} open={reassignEventModal} close={handleReassignModalClose} data={selectedRowData} logDate={logDate} logId={logId} onLoad={event} driverId={params?.id} />
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
            coDriver={driverData?.driver}
            driverName={driverData?.driver?.driverName}
            coDriverName={driverData?.driver?.coDriverName}
            />
        </>  
    )
}
export default DriverGraphDetails 