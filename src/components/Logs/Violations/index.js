import React from "react";
// import "./style.scss";
// import { Row, Col } from "reactstrap";
import { getHOSViolationCalculation } from '../utils'

export const Violations = ({ data }) => {
  let result =  getHOSViolationCalculation(data)
  return (
    <div className="row mt-2">
      {/* <div className="col-md-12">
        <div className="violation mt-3">
          <h3 className="title"> Violations: </h3>{" "}
          {data.map((el, i) => (
            <span key={i + el.key} className="field">
              {" "}
              {el.value}{" "}
            </span>
          ))}{" "}
        </div>{" "}
      </div>{" "} */}
      {result.map((el, i) => (
        <div key={i} className="col-sm-4">
          <div className="mnt-brk">
            <span className="text-danger">{el}</span>
            <p className="m-0">30 Minutes Break Required</p>
          </div>
        </div>
      ))}{" "}
       
    </div>
  );
};
