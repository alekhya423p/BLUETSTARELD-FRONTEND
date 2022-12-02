import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import MainChart from "../../Chart/MainChart";
import moment from "moment-timezone";
import { getCoDriverLog } from '../../../../actions/logAction';
import {LOAD_CO_DRIVER_GRAPH_LOG_RESET} from '../../../../constants/actionTypes'
import { times, getFilteredLogs, checkStatusChart, checkCertifyStatus} from "../../utils";
const CompareLog = ({ open, close, coDriver,data, drViolationsCurrentDriver, shiftsCurrentDriver, cyclesCurrentDriver, warningsCurrentDriver, canEditCurrentDriver, editingCurrentDriver, logCurrentDriver, setLogCurrentDriver, handleEditRectCurrentDriver, todayCurrentDriver, logsLoadingCurrentDriver, idCurrentDriver,intersCurrentDriver,noteErrorCurrentDriver, missIntersCurrentDriver, certifiesCurrentDriver, setSuccessCurrentDriver}) => {
  const params = useParams();
  const dispatch = useDispatch();
  const {coDriverData, loading } = useSelector(state => state.logs)
  const { isMode } = useSelector((state) => state.dashboard);
  const shouldIShow = JSON.parse(localStorage.getItem("shouldIShow"));
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const tz = user && user.companyInfo && user.companyInfo.timeZoneId? user.companyInfo.timeZoneId: "America/Los_Angeles";
  const queryString = window.location.pathname.split("/");
  const hash = queryString[queryString.length - 1];
  const date = moment.tz(hash, "DD-MM-YYYY", tz);
  const [startDate, setStartDate] = useState(date);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [editGraph, setEditGraph] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [inters, setInters] = useState([]);
  const [missInters, setMissInters] = useState([]);
  const [certifies, setCertifies] = useState([]);
  const [drViolations, setDrViolations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [log, setLog] = useState({start: 0,end: 0});
  const [today, setToday] = useState(false);

  useEffect(() => {
		dispatch({type: LOAD_CO_DRIVER_GRAPH_LOG_RESET})
		let covertDate = moment.tz(hash, 'DD/MM/YYYY', tz).format('YYYY-MM-DD')
		if(coDriver?.coDriverId) dispatch(getCoDriverLog(coDriver?.coDriverId, covertDate))
		else dispatch({type: LOAD_CO_DRIVER_GRAPH_LOG_RESET})
	},[coDriver,dispatch,hash,tz]);

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
			setEditGraph(false);
			setInters([]);
			setMissInters([]);
			setShifts([]);
			setCycles([]);
			setCertifies([]);
			setWarnings([])
			setCurrentEdit(null);
		}
		return () => (cancel = true);
	}, [hash]);
	useEffect(() => {
		let cancel = false;
		let asyncFunc = async () => {
			const user = JSON.parse(localStorage.getItem("userInfo"));
			if (coDriverData && coDriverData.driver && user) {
				const driver = coDriverData.driver;
				document.title = `Lucid ELD - ${driver.driverName + " " } - ${user?.user?.firstName + " " + user?.user?.lastName}`;
			}

			if (coDriverData) {
				const { startDate, tz } = times();
				let timestamp = moment.tz(coDriverData.timestamp, tz).toISOString();
				let today = moment.tz(timestamp, tz).dayOfYear() === moment(startDate).dayOfYear();
				if (coDriverData.shifts) {
					const { startDate, tz } = times();
					let tempShifts = [];
					coDriverData.shifts.forEach((shift) => {
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
				if (coDriverData.cycles) {
					// console.log(coDriverData, 'cycles101');
					// console.log(coDriverData.cycles, 'cycles');
					const { startDate, tz } = times();
					let tempCycles = [];
					coDriverData.cycles.forEach((item) => {
						let time = moment.tz(item, tz);
						// console.log(time, 'time');
						let flag = time.dayOfYear() === moment(startDate).dayOfYear();
						// console.log(flag, 'flag');
						if (flag) {
						tempCycles.push(moment.duration(time.diff(startDate)).asSeconds());
						}
					});
					// console.log(tempCycles, 'tempcycles');
					setCycles(tempCycles);
				} else {
					setCycles([]);
				}
				if (!editGraph) {
					let data = coDriverData;
					if (data && data.logs) {
						let { logs, originalLogs } = getFilteredLogs(coDriverData, true);
						let vehIds = [];
						if (originalLogs[0] && (originalLogs[0].vehicleId || data.vehicleId)) {
							vehIds.push(originalLogs[0].vehicleId || data.vehicleId);
						}
						const rs3 = coDriverData.logs.findIndex((log) => log.record_status === 'INACTIVE_CHANGED') !== -1;
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

						if (coDriverData.violationRanges &&coDriverData.violationRanges.length > 0) {
							const endDate = moment.tz(startDate, tz).endOf("day");
							const viols = [];
							coDriverData.violationRanges.forEach((viol) => {
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
						// setOfflineLogs(coDriverData.offlineLogs);
						setToday(today);
						setLogs(logs);
						setInters(interPoints);
						setMissInters(missInterPoints);
						setCertifies(certs);
					}
				}
			}
		};
		!cancel && asyncFunc();

		return () => (cancel = true);
	}, [coDriverData, tz, editGraph, shouldIShow,hash]);
	return (
		open && (
		<Modal
			className={`compareModal ${isMode}`}
			show={open}
			onHide={close}
		>
        <Modal.Header>
			<Modal.Title id="contained-modal-title">
				{"Driver: "}
			</Modal.Title>
			<Button variant="outline-danger" onClick={close}>
				<i className="ti ti-x"></i>
			</Button>
			</Modal.Header>
			<Modal.Body>
				<MainChart
					data={!loading ? data : []}
					log={logCurrentDriver}
					setLog={setLogCurrentDriver}
					logsLoading={false}
					drViolations={!loading ? drViolationsCurrentDriver : []}
					startDate={startDate}
					editing={{
						editing: editGraph,
						index: currentEdit,
					}}
					canEdit={canEditCurrentDriver}
					id={idCurrentDriver}
					today={today}
					shifts={shiftsCurrentDriver}
					cycles={cyclesCurrentDriver}
					warnings={warningsCurrentDriver}
					tz={tz}
					noteError={noteErrorCurrentDriver}
					inters={intersCurrentDriver}
					missInters={missIntersCurrentDriver}
					certifies={certifiesCurrentDriver}
					setSuccess={setSuccessCurrentDriver}
				/>
				<h5><strong>Co-Driver:</strong></h5>
				<hr></hr>
				<MainChart
					data={!loading ? logs : []}
					log={log}
					setLog={setLog}
					logsLoading={false}
					drViolations={!loading ? drViolations : []}
					startDate={startDate}
					editing={{
						editing: editGraph,
						index: currentEdit,
					}}
					id={params.id}
					today={today}
					shifts={shifts}
					cycles={cycles}
					warnings={warnings}
					tz={tz}
					noteError={null}
					inters={inters}
					missInters={missInters}
					certifies={certifies}
				/>
				<div className="modal-footer">
					<button
					type="button"
					onClick={close}
					className="btn btn-secondary"
					data-dismiss="modal"
					>
					Cancel
					</button>
				</div>
			</Modal.Body>
		</Modal>
	));
};

export default CompareLog;
