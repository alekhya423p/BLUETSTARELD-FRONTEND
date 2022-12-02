import React from "react";
// import moment from "moment";
import moment from "moment-timezone";
import { DatetimePickerTrigger } from "rc-datetime-picker";
import { Link, useNavigate } from "react-router-dom";
import "./DatePicker.css";

export const TimeNav = ({startDate, setStartDate, loading = false, link = false}) => {
    const navigate = useNavigate();
    // const user = JSON.parse(localStorage.getItem("user"));
    // const tz = user && user.company && user.company.tz ? user.company.tz.value : "America/Los_Angeles";
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const tz = user && user.companyInfo && user.companyInfo.timeZoneId? user.companyInfo.timeZoneId: "America/Los_Angeles";
    const onChange = (val) => {
        if (link) {
            const queryString = window.location.pathname.split("/");
        if (queryString && queryString.length > 0) {
            let drId = queryString[queryString.length - 2];
            let date = val.format("DD-MM-YYYY");
            let hash = queryString[0] + `/driver/graph-detail/${drId}/${date}`;
            navigate(hash);
        }
    } else {
        setStartDate(val);
    }
};

const getDate = () => {
    return moment.tz(startDate,tz);
  };
  
  const getYesterday = () => {
      const date = moment.tz(startDate, tz).subtract(1, "day");
      setStartDate(date);
    };
    
    const getLinkYesterday = () => {
        const queryString = window.location.pathname.split("/");
        const logDate = queryString[queryString.length - 1];
        if (logDate) {
            const yesterday = moment.tz(logDate, "DD-MM-YYYY", tz).startOf("day").subtract(1, "day");
            let drId = queryString[queryString.length - 2];
            let date = yesterday.format("DD-MM-YYYY");
            let url = queryString[0] + `/driver/graph-detail/${drId}/${date}`;
            return url;
        } else {
            return "/";
        }
};

const getTomorrow = () => {
    if (isToday()) {
      return;
    } else {
      const date = moment.tz(startDate, tz).add(1, "day");
      setStartDate(date);
    }
};

const getLinkTomorrow = () => {
  const queryString = window.location.pathname.split("/");
  const logDate = queryString[queryString.length - 1];
  if (logDate) {
      const tomorrow = moment.tz(logDate, "DD-MM-YYYY", tz).startOf("day").add(1, "day");
      let drId = queryString[queryString.length - 2];
      let date = tomorrow.format("DD-MM-YYYY");
      let url = queryString[0] + `/driver/graph-detail/${drId}/${date}`;
      return url;
  } else {
      return "/";
  }
};

const isToday = () => {
  let today = moment.tz(tz).startOf("day");
  let date = moment.tz(startDate, tz).startOf("day");
  return date.isSame(today);
};

const getToday = () => {
    let today = moment.tz(tz);
    return today;
};

  return (
      startDate && (
          <span className="DatePicker">
        <DatetimePickerTrigger
          moment={getDate()}
          onChange={onChange}
          closeOnSelectDay
          maxDate={getToday()}
          >
          <span className="DP-inputWrapper">
            <input
              className="DP-input"
              type="text"
              // format={date => date.utc().format("MMM DD, YYYY HH:mm:ss")}
              value={getDate().format("MMM DD, YYYY")}
              readOnly
              />
          </span>{" "}
        </DatetimePickerTrigger>{" "}
        <span className="switcher">
          {" "}
          {
          // !loading &&
            (link ? (
                <>
                <Link to={getLinkYesterday()} className="left">
                  <span className="faIcon"><i className="ti ti-chevron-left"></i></span>
                </Link>
                <Link to={!isToday() ? getLinkTomorrow() : "#"}
                  className={`right ${isToday() ? "cursor-block" : ""}`}
                  >
                  <span className="faIcon"><i className="ti ti-chevron-right"></i></span>
                </Link>
              </>
            ) : (
                <>
                <span onClick={getYesterday} className="left">
                    <span className="faIcon"><i className="ti ti-chevron-left"></i></span>
                </span>
                <span
                  onClick={getTomorrow}
                  className={`right ${isToday() ? "cursor-block" : ""}`}
                  >
                  <span className="faIcon"><i className="ti ti-chevron-right"></i></span>
                </span>
              </>
            ))}
        </span>
      </span>
    )
    );
};
