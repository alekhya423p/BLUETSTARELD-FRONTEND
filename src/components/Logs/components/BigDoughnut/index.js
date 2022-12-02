import React from "react";
import { Doughnut } from "react-chartjs-2";
import "./style.css";

export const BigDoughnut = ({ timer = 0, type }) => {
  let total;
  let dataTimer = Math.round(+timer);
  let hours = "00";
  let minutes = "00";
  let colors = ["#F2994A", "#cfcfcf"];
  let labels;
  switch (type) {
    case "break":
      colors = ["#eaaa08", "#ffe9b0"];
      labels = ["", ""];
      total = 8;
      break;
    case "drive":
      colors = ["#16b364", "#b9ffdc"];
      labels = ["", ""];
      total = 11;
      break;
    case "shift":
      colors = ["#2e90fa", "#cae4ff"];
      labels = ["", ""];
      total = 14;
      break;
    case "cycle":
      colors = ["#667085", "#dcdcdc"];
      labels = ["", ""];
      total = 70;
      break;
    case "recap":
      colors = ["#F2994A", "#cfcfcf"];
      labels = ["", ""];
      total = 50;
      break;
    default:
      break;
  }

  if (+timer && +timer > 0) {
    hours = Math.floor(Math.round(+timer) / 60);
    minutes = Math.round(+timer - 60 * hours);
    hours = hours > 9 ? `${hours}` : `0${hours}`;
    minutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
  }
  return (
    <div className="item Doughnut">
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data: [dataTimer, total * 60 - dataTimer],
              backgroundColor: colors,
              borderColor: ["transparent", "transparent"],
            },
          ],
        }}
        height={6}
        width={6}
        options={{
          animation: {
            duration: 0,
          },
          cutoutPercentage: 90,
          maintainAspectRatio: 1,
          tooltips: false,
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
        }}
      />{" "}
      <div className="doughnut-status-time">
        <div className={`time ${type}`}> {`${hours}:${minutes}`} </div>{" "}
        <div className="status"> {type} </div>{" "}
      </div>{" "}
    </div>
  );
};
