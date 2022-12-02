import React from "react";
import { BigDoughnut } from "./components/BigDoughnut";

const DriverSpin = ({ today, timers }) => {
  const show = today;

  return (
    <div className="cycles-info">
      {show && (
        <div className="chart">
          <BigDoughnut timer={timers && (timers.break)/60} type="break" />
          <BigDoughnut timer={timers && (timers.drive)/60} type="drive" />
          <BigDoughnut timer={timers && (timers.shift)/60} type="shift" />
          <BigDoughnut timer={timers && (timers.cycle)/60} type="cycle" />{" "}
          {timers && +timers.recap > 0 && (
            <BigDoughnut timer={timers.recap} type="recap" />
          )}{" "}
        </div>
      )}{" "}
    </div>
  );
};

export default DriverSpin;
