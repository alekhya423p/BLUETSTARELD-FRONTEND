import React, { forwardRef, 
  //useState , useImperativeHandle 
} from "react";
import moment from "moment-timezone";

// import { deselectAllCheckboxes, handleCheckChange } from "../../utility/helper";
// import { v4 as uuid } from "uuid";
import { checkStatus, checkStatusChart, times, isDrStatus, checkCertifyStatus, isInfoNotDrStatus } from "./utils";
import { Status } from "./StatusIndicator";
import './driverLogRow.css'

const DriverLogRow = forwardRef(({allow_system_user,handleChange ,openModal,handleEditRect,logs,canEdit,driver,originalLogs,setOriginalLogs, allow_correction , setInfoLog, change ,shouldIShow}, ref) => {
  const {startDate, tz } = times();
  // let finalCheck = {}, count = 0;
  // const [inputCheckedCount, setinputCheckedCount] = useState(0);
  // const [inputCheckedIds, setinputCheckedIds] = useState([]);
  // useImperativeHandle(ref, () => ({
  //   deSelectAll() {
  //     count = deselectAllCheckboxes(document);
  //     setinputCheckedCount(count);
  //     // change(count);
  //   }
  // }));

  const getStart = (start_date) => {
    return moment.tz(start_date, tz).format("hh:mm:ss A");
  };

  const getDuration = (log) => {
    let totalSecs = log.end - log.start;
    let h = Math.floor(totalSecs / 3600);
    let m = Math.floor((totalSecs - h * 3600) / 60);
    let s = Math.round(totalSecs - (h * 3600 + m * 60));
    h = h > 0 ? `${h}h${m > 0 || s > 0 ? ":" : ""}` : "";
    m = m > 0 ? `${m}m${s > 0 ? ":" : ""}` : "";
    s = s > 0 ? `${s}s` : "";

    return h + m + s;
  };

  const onMouseOver = (log, hover = true) => {
    let index = logs.findIndex((l) => l.id === log.id);
    if (checkStatusChart(log.status)) {
      const newLogs = [];
      if (index >= 0) {
        logs.forEach((item, i) => {
          if (checkStatus(item.status)) {
            const l = logs.filter((el) => checkStatus(el.status)).find((el) => el.id === item.id);
            newLogs.push(l);
          }
        });
        let rects = document.querySelectorAll(".graphWrapper .rect");
        if (rects) {
          Array.from(rects).forEach((rect, i) => {
            if (i === index && hover) {
              rect.classList.add("hovered");
            } else {
              rect.classList.remove("hovered");
            }
          });
        }
      }
    } else if (log.status === checkCertifyStatus(log.status) && shouldIShow) {
      const certLogs = originalLogs.filter((l) => l.status === checkCertifyStatus(l.status));
      const certIndex = certLogs.findIndex((l) => l.id === log.id);
      if (certIndex >= 0) {
        // const certsDom = document.querySelectorAll(`.${checkCertifyStatus(log.status)}`);
        const certsDom = document.querySelectorAll(".Certify");
        let certDom = [...certsDom][certIndex];
        if (certDom) {
          hover ? certDom.classList.add("hoveredCert") : certDom.classList.remove("hoveredCert");
        }
      }
    } else if (log.status === "INTER_NORMAL_PRECISION" && shouldIShow) {
      const interLogs = originalLogs.filter((l) => l.status === "INTER_NORMAL_PRECISION");
      const interIndex = interLogs.findIndex((l) => l.id === log.id);
      if (interIndex >= 0) {
        const intersDom = document.querySelectorAll(".INTER_NORMAL_PRECISION");
        let interDom = [...intersDom][interIndex];
        if (interDom) {
          hover ? interDom.classList.add("hoveredInter") : interDom.classList.remove("hoveredInter");
        }
      }
    }
  };

  const errorColor = (index, type) => {
    let errColor = "";
    let main = originalLogs[index];
    let pre = originalLogs[index - 1];
    let stIndex = logs.findIndex((el) => el.id === main.id);
    let preSt = logs[stIndex - 1];

    let durMain = (main.end - main.start) / 60;
    let durPreSt = preSt && (preSt.end - preSt.start) / 60;
    
    let trkm = main.truck_number ? main.truck_number : main.truck_number;
    let trkp = pre ? pre.truck_number ? pre.truck_number : pre.truck_number : null;
    
    let typeDiff = type === "odometr" ? 3 : 0.3;
    
    if (!driver.codriverId && main?.status !== checkCertifyStatus(main?.status) && pre && pre?.status !== checkCertifyStatus(main?.status) && trkm === trkp) {
      if (preSt && !isDrStatus(main.status) && checkStatusChart(main.status) && isDrStatus(preSt.status) && durPreSt > 30 && +main[type] - +preSt[type] < typeDiff) {
       
        errColor = "errColor";
      } else if (isDrStatus(main.status) &&isDrStatus(pre.status) &&durPreSt > 30 && +main[type] === +pre[type]) {
       
        errColor = "errColor";
      } else if (preSt &&type === "odometr" &&checkStatusChart(pre.status) &&!isDrStatus(main.status) &&!isDrStatus(preSt.status) &&Math.abs(+main.odometr - +preSt.odometr) > typeDiff) {
       
        errColor = "errColor";
      } else if (isDrStatus(main.status) && isDrStatus(pre.status) && durMain > 30 && durPreSt > 30 && main[type] === pre[type]) {
      
        errColor = "errColor";
      } else if ( type === "odometr" && isInfoNotDrStatus(pre.status) && Math.abs(+main.odometr - +pre.odometr) > 3) {
        let firstPreSt;
        for (let i = index - 1; i >= 0; i--) {
          const el = { ...originalLogs[i] };
          if (checkStatusChart(el.status)) {
            firstPreSt = el;
            break;
          }
        }
        if (firstPreSt && !isDrStatus(firstPreSt.status)) {
          
          errColor = "errColor";
        }
      }
    }
    return errColor;
  };

  // const onEditInfoLog = (infoLog) => {
  //   let certsDom = document.querySelectorAll(".DR_CERT_1.hoveredCert");
  //   certsDom = [...certsDom];
  //   if (certsDom && certsDom.length > 0) {
  //     certsDom.forEach((cd) => cd.classList.remove("hoveredCert"));
  //   }
  //   let intersDom = document.querySelectorAll(".Intermediate.hoveredInter");
  //   intersDom = [...intersDom];
  //   if (intersDom && intersDom.length > 0) {
  //     intersDom.forEach((cd) => cd.classList.remove("hoveredInter"));
  //   }
  //   setInfoLog(infoLog);
  // };
  

  const handleCurrentDateEvent = (log) => {
    let timestamp = moment.tz(startDate, tz).format('yyyy-MM-DD');
    let logDate =  log?.logDate ? log?.logDate?.split('T')[0] : ' ';
    // let today = moment.tz(timestamp, tz).dayOfYear() === moment(logDate).dayOfYear();
    const date1 = new Date(timestamp);
    const date2 = new Date(logDate);
    return date1.getFullYear() === date2.getFullYear() && date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();
  };

  return (
    <div
      className="DriverLogRow table-responsives"
      style={{
        height: originalLogs.length >= 10 ? "530px" : "auto",
      }}
    >
      <table className="w-100 table table-responsives row_driver_hos_table">
        <thead>
          <tr className="head">
            <th><div className="num"> # </div></th>
            <th><div className="status align-center">Duty Status </div></th>
            <th><div className="start"> Start </div></th>
            <th><div className="duration"> Duration </div></th>
            <th><div className="notes">Event Status </div></th>
            <th><div className="location"> Location </div></th>
            <th><div className="positioning"> Positioning </div></th>
            <th><div className="vehicle"> Vehicle </div></th>
            <th><div className="eld-sn"> ELD SN (MAC) </div></th>
            <th><div className="odometr"> Odometer </div></th>
            <th><div className="eng-hours"> Engine Hours </div></th>
            <th><div className="origin"> Origin </div></th>
            <th><div className="notes"> Notes </div></th>
            <th><div className="id"> ID </div></th>
            <th className="align-center">Actions</th>
            {allow_system_user ? <th></th> : null}
          </tr>
        </thead>
        <tbody className="body">
        {originalLogs.map((item, i) => {
            let trkNo = item.truck_number? item.truck_number : null;
            let isCoordinatesNull = Object.values(item.coordinates).every(value => {
              if (value !== null) return true;
              else return false;
            });
            return (
              <tr
                  key={i}
                  className="item pt-3 pb-3"
                  onMouseOver={() => onMouseOver(item)}
                  onMouseOut={() => onMouseOver(item, false)}
                >
                <td><span className="num row-item-font"> {i + 1} </span></td>
                <td className="align-center">
                <Status
                    type={item.status}
                    errColor={item.intermediateErr || item.certifyErr}
                  />{" "}
                   </td>
                <td><span className="start row-item-font">{!handleCurrentDateEvent(item) || item.status === 'DS_ON'  ? moment.tz(item.eventDate, tz).format('MMM DD,') + getStart(item.eventDate)  : getStart(item.start_date)}</span></td>
                <td><span className="duration row-item-font"> 
                {checkStatusChart(item.status) ? getDuration(item) : ""}{" "}
                </span></td>
                <td>
                  <span className="notes row-item-font">
                    {item.status !== checkCertifyStatus(item.status) ? item.record_status : "N/A"}
                  </span>
                </td>
                <td>
                  <span className={`location row-item-font ${ isCoordinatesNull || item.status === checkCertifyStatus(item.status) ? "" : "errColor" }`} title={!isCoordinatesNull ? "no coordinates" : ""}>
                    {item.status !== checkCertifyStatus(item.status) ? item.location ? item.location : "N/A" : moment(item.certify_date).format("MM-DD-yyyy")}
                  </span>
                </td>
                <td><span className="positioning row-item-font">  {item.status !== checkCertifyStatus(item.status) ? item?.positioning?.charAt(0).toUpperCase() + item?.positioning?.slice(1) : "N/A"} </span></td>
                <td><span className={`vehicle row-item-font ${!trkNo ? 'text-danger' : null}`} title={!trkNo ? "Vehicle not set" : ""}> {trkNo ? trkNo : 'No vehicle'} </span></td>
                <td><span className="eld_address row-item-font"> {item.status !== checkCertifyStatus(item.status) ? item.eld_address ? item.eld_address : "NO ELD" : " "}     </span></td>
                <td>
                  <span className={"row-item-font " + errorColor(i, "odometr")}>
                    {item.status !== checkCertifyStatus(item.status) ? item.odometr : " "}
                  </span>
                </td>
                <td>
                  <span className={ "eng-hours row-item-font " + errorColor(i, "engine_hours")}>
                    {item.status !== checkCertifyStatus(item.status) ? item.engine_hours : " "}
                  </span>
                </td>
                <td>
                  <span className={ "eng-hours row-item-font "}>
                    {item.status !== checkCertifyStatus(item.status) ? item.origin_code : " "}
                  </span>
                </td>
                <td>
                  <span className="notes row-item-font">
                    {item.status !== checkCertifyStatus(item.status) ? item.note : " "}
                  </span>
                </td>
                <td>
                  <span className="notes row-item-font">
                    {item.status !== checkCertifyStatus(item.status) ? item.sequenceId ? item.sequenceId : "N/A" : item.sequenceId}
                  </span>
                </td>
                <td  className="align-center">
                  {handleCurrentDateEvent(item) && item.isEditable && allow_correction ? 
                      <button type="button" onClick={() => openModal(item, 'company-user')} className="btn btn-sm"><i className="ti ti-edit"></i></button> : null }
                  {allow_system_user ? <>
                  {item.inspection ? <button type="button" onClick={() => openModal(item, 'frozen-event')} className="btn btn-sm"><i className="ti ti-edit text-info"></i></button>: null} 
                  {handleCurrentDateEvent(item) ? <button type="button" onClick={() => openModal(item, 'technician-edit-event')} className="btn btn-sm"><i className="ti ti-edit text-danger"></i></button> : null} 
                  <button type="button" onClick={() => openModal(item, 'reassign-event')} className="btn btn-sm"><i className="ti ti-user text-danger"></i></button>   
                  <button type="button" onClick={() => openModal(item, 'copy-event')} className="btn btn-sm"><i className="ti ti-copy text-danger"></i></button>   
                  {!item.inspection ? <button type="button" onClick={() => openModal(item, 'transfer-event')} className="btn btn-sm"><i className="ti ti-trash text-danger"></i></button> : null} </>
                  : null }
                  </td>   
                  {allow_system_user ? <> { handleCurrentDateEvent(item) ? <td><input type="checkbox" disabled={item.inspection} className="custom-control-input table_checkbox" id={i} key={i} name={item.id} onChange={(e) => handleChange(e)} value={item.id} /><label htmlFor={i} className="custom-control-label"></label></td> : <td></td> } </> : null }
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export default DriverLogRow;
