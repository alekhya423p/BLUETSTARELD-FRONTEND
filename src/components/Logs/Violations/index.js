import React from "react";
// import "./style.scss";
// import { Row, Col } from "reactstrap";
import { getHOSViolationCalculate, times } from '../utils'
import moment from "moment-timezone";

export const Violations = ({ data, logDate }) => {
  const {tz} = times();
  
  return (
    <div className="row mt-2">
      {data.map((el, i) => (
        el.regulation === "30M_REST_BREAK" || el.regulation === "14H_SHIFT_LIMIT" || el.regulation === "70H_CYCLE_LIMIT" || el.regulation === "11H_DRIVE_LIMIT" ?
          <div key={i} className="col-sm-4">
            <div className="mnt-brk">
              <span className="text-danger">{ getHOSViolationCalculate(el.regulation)}</span>
              <p className="m-0">{moment.tz(el?.startTime, tz).format('MMM D, hh:mm:ss A')} - {moment.tz(el?.endTime, tz).format('MMM D, hh:mm:ss A')}</p>
            </div>
          </div> : ""
      ))}{" "}       
    </div>
  );
};
