import React, { useState, useEffect, useRef } from "react";
// import "./style.scss";

export const TimePickerr = ({ initialValue = "00:00", onChange, id }) => {
  const timePickerRef = useRef(null);

  const [hour, setHour] = useState("00");
  const [min, setMin] = useState("00");
  const [sec, setSec] = useState("00");
  const [value, setValue] = useState("00:00 AM");

  const [hourInner, setHourInner] = useState("00");
  const [minInner, setMinInner] = useState("00");
  const [secInner, setSecInner] = useState("00");

  const [show, setShow] = useState(false);

  useEffect(() => {
    let [h, m, s] = initialValue.split(":").map((el) => {
      let time = el.match(/\d/g);
      return (time = time.join(""));
    });
    setHour(h);
    setMin(m);
    setSec(s);
    setHourInner(h);
    setMinInner(m);
    setSecInner(s);
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const event = (e) => {
      const el = e.target;
      const curTimePicker = timePickerRef.current;
      if (
        show &&
        !el.classList.contains("TimePickerr") &&
        !el.classList.contains("TimePickerr_tableWrapper") &&
        !el.classList.contains("TimePickerr_value") &&
        !el.classList.contains("TimePickerr_table") &&
        !el.classList.contains("inp") &&
        !el.classList.contains("arrow") &&
        !el.classList.contains("sep") &&
        !el.classList.contains("fa-chevron-up") &&
        !el.classList.contains("fa-chevron-down") &&
        !el.classList.contains("TimePickerr_body") &&
        !el.classList.contains("TimePickerr_tr") &&
        !el.classList.contains("TimePickerr_td")
      ) {
        setShow(false);
      } else if (show && el.classList.contains("TimePickerr_value")) {
        const timePicker = el.parentNode;
        if (!curTimePicker.isSameNode(timePicker)) {
          setShow(false);
        }
      }
    };
    const editLogModal = document.querySelector(".modal-content");
    if (editLogModal) {
      editLogModal.addEventListener("click", event);
    }
    return () => {
      window.removeEventListener("click", event);
    };
  }, [show]);

  useEffect(() => {
    let h = +hour <= 9 ? `0${+hour}` : +hour;
    let m = +min <= 9 ? `0${+min}` : +min;
    let s = +sec <= 9 ? `0${+sec}` : +sec;
    setValue(`${h}:${m}:${s}`);
    onChange(+hour * 60 + +min + +sec / 60);
  }, [hour, min, sec, onChange]);

  const onEveryChange = async (t) => {
    switch (t) {
      case "hourChange": {
        if (hourInner && +hourInner >= 0) {
          let h = +hourInner <= 9 ? `0${+hourInner}` : hourInner;
          setHour(h);
        }
        break;
      }
      case "hourUp": {
        let h = +hour + 1;
        h = h <= 9 ? `0${h}` : h;
        setHour(h);
        setHourInner(h);
        break;
      }
      case "hourDown": {
        if (+hour > 0) {
          let h = +hour - 1;
          h = h <= 9 ? `0${h}` : h;
          setHour(h);
          setHourInner(h);
        }
        break;
      }
      case "minChange": {
        if (minInner && +minInner >= 0 && +minInner < 59) {
          let m = +minInner <= 9 ? `0${+minInner}` : minInner;
          setMin(m);
        }
        break;
      }
      case "minUp": {
        if (+min < 59) {
          let m = +min + 1;
          m = m <= 9 ? `0${m}` : m;
          setMin(m);
          setMinInner(m);
        } else if (+min === 59) {
          onEveryChange("hourUp");
          setMin("00");
          setMinInner("00");
        }
        break;
      }
      case "minDown": {
        if (+min > 0) {
          let m = +min - 1;
          m = m <= 9 ? `0${m}` : m;
          setMin(m);
          setMinInner(m);
        } else if (+min === 0) {
          onEveryChange("hourDown");
          if (+hour > 0) {
            setMin(59);
            setMinInner(59);
          }
        }
        break;
      }
      case "secChange": {
        if (secInner && +secInner >= 0 && +secInner < 59) {
          let s = +secInner <= 9 ? `0${+secInner}` : secInner;
          setSec(s);
        }
        break;
      }
      case "secUp": {
        if (+sec < 59) {
          let s = +sec + 1;
          s = s <= 9 ? `0${s}` : s;
          setSec(s);
          setSecInner(s);
        } else if (+sec === 59) {
          onEveryChange("minUp");
          setSec("00");
          setSecInner("00");
        }
        break;
      }
      case "secDown": {
        if (+sec > 0) {
          let s = +sec - 1;
          s = s <= 9 ? `0${s}` : s;
          setSec(s);
          setSecInner(s);
        } else if (+sec === 0) {
          onEveryChange("minDown");
          if (+hour > 0) {
            setSec(59);
            setSecInner(59);
          }
        }
        break;
      }
      default:
        break;
    }
  };

  // HOUR
  const onHourChange = (e) => {
    const re = /^-?\d+\.?\d*$/;
    let h = e.target.value;
    if (re.test(h) || h === "") {
      setHourInner(+h);
    }
  };

  const onHourBlur = () => {
    const re = /^-?\d+\.?\d*$/;
    if (re.test(hourInner)) {
      let h = +hourInner;
      if (h <= 59 && h >= 0) {
        onEveryChange("hourChange");
      }
    }
  };

  // MIN
  const onMinChange = (e) => {
    const re = /^-?\d+\.?\d*$/;
    let m = e.target.value;
    if (re.test(m) || m === "") {
      if (+m < 60) {
        setMinInner(+m);
      }
    }
  };
  const onMinBlur = () => {
    const re = /^-?\d+\.?\d*$/;
    if (re.test(minInner)) {
      let m = +minInner;
      if (m <= 59 && m >= 0) {
        onEveryChange("minChange");
      }
    }
  };

  // SEC
  const onSecChange = (e) => {
    const re = /^-?\d+\.?\d*$/;
    let s = e.target.value;
    if (re.test(s) || s === "") {
      if (+s < 60) {
        setSecInner(+s);
      }
    }
  };
  const onSecBlur = () => {
    const re = /^-?\d+\.?\d*$/;
    if (re.test(secInner)) {
      let s = +secInner;
      if (s <= 59 && s >= 0) {
        onEveryChange("secChange");
      }
    }
  };

  const onInputFocus = (e) => {
    e.target.select();
    setShow(true);
  };

  const onInputChange = (e) => {
    // let val = e.target.value.toUpperCase();
    // let h, m;
    // [h, m] = val.split(':').map(el => {
    //    let time = el.match(/\d/g);
    //    if(time) { time = time.join("") }
    //    return time;
    // });
    // if(+h > 0  && +m >= 0 && +m <= 59) {
    //    // setTime(h, m, s);
    // }
  };

  return (
    <div className="TimePickerr" ref={timePickerRef}>
      <input
        id={id}
        onFocus={onInputFocus}
        className="TimePickerr_value"
        onChange={onInputChange}
        value={value}
      />{" "}
      <div className={"TimePickerr_tableWrapper " + (show ? "showPicker" : "")}>
        <table className="TimePickerr_table">
          <tbody className="TimePickerr_body">
            <tr className="TimePickerr_tr">
              <td className="TimePicker_td">
                <span className="arrow" onClick={() => onEveryChange("hourUp")}>
                  <i className="fa fa-chevron-up"> </i>{" "}
                </span>{" "}
              </td>{" "}
              <td className="sep"> & nbsp; </td>{" "}
              <td className="TimePicker_td">
                <span className="arrow" onClick={() => onEveryChange("minUp")}>
                  <i className="fa fa-chevron-up"> </i>{" "}
                </span>{" "}
              </td>{" "}
              <td className="sep"> & nbsp; </td>{" "}
              <td className="TimePicker_td">
                <span className="arrow" onClick={() => onEveryChange("secUp")}>
                  <i className="fa fa-chevron-up"> </i>{" "}
                </span>{" "}
              </td>{" "}
            </tr>{" "}
            <tr className="TimePickerr_tr">
              <td className="TimePicker_td">
                <input
                  value={hourInner}
                  onFocus={(e) => e.target.select()}
                  onBlur={onHourBlur}
                  onChange={onHourChange}
                  maxLength="2"
                  className="inp"
                />
              </td>{" "}
              <td className="sep">: </td>{" "}
              <td className="TimePicker_td">
                <input
                  value={minInner}
                  onFocus={(e) => e.target.select()}
                  onBlur={onMinBlur}
                  onChange={onMinChange}
                  maxLength="2"
                  className="inp"
                />
              </td>{" "}
              <td className="sep">: </td>{" "}
              <td className="TimePicker_td">
                <input
                  value={secInner}
                  onFocus={(e) => e.target.select()}
                  onBlur={onSecBlur}
                  onChange={onSecChange}
                  maxLength="2"
                  className="inp"
                />
              </td>{" "}
            </tr>{" "}
            <tr className="TimePickerr_tr">
              <td className="TimePicker_td">
                <span
                  className="arrow"
                  onClick={() => onEveryChange("hourDown")}
                >
                  <i className="fa fa-chevron-down"> </i>{" "}
                </span>{" "}
              </td>{" "}
              <td className="sep"> </td>{" "}
              <td className="TimePicker_td">
                <span
                  className="arrow"
                  onClick={() => onEveryChange("minDown")}
                >
                  <i className="fa fa-chevron-down"> </i>{" "}
                </span>{" "}
              </td>{" "}
              <td className="sep"> </td>{" "}
              <td className="TimePicker_td">
                <span
                  className="arrow"
                  onClick={() => onEveryChange("secDown")}
                >
                  <i className="fa fa-chevron-down"> </i>{" "}
                </span>{" "}
              </td>{" "}
            </tr>{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
    </div>
  );
};
