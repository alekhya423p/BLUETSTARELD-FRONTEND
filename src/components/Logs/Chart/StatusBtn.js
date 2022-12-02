import React from 'react';


export const OffBtn = ({onClick, status}) => {
  return (
    <span onClick={onClick}>
      <img alt="" 
        // src={status ? require('./svg/status_off.svg') : require('./svg/status_off_dis.svg')} 
        className="ml-3 mr-3 status-btn" />
    </span>
  );
}

export const SbBtn = ({onClick, status}) => {
  return (
    <span onClick={onClick}>
      <img alt="" 
        // src={status ? require('./svg/status_sb.svg') : require('./svg/status_sb_dis.svg')} 
        className="ml-3 mr-3 status-btn" />
    </span>
  );
}

export const DrBtn = ({onClick, status}) => {
  return (
    <span onClick={onClick}>
      <img alt="" 
        // src={status ? require('./svg/status_dr.svg') : require('./svg/status_dr_dis.svg')} 
        className="ml-3 mr-3 status-btn" />
    </span>
  );
}

export const OnBtn = ({onClick, status}) => {
  return (
    <span onClick={onClick}>
      <img alt=" " 
        // src={status ? require('./svg/status_on.svg') : require('./svg/status_on_dis.svg')} 
        className="ml-3 mr-3 status-btn" />
    </span>
  );
}

export const YMBtn = ({onClick, status}) => {
  return (
    <span onClick={onClick}>
      <img alt=" " 
        // src={status ? require('./svg/status_ym.svg') : require('./svg/status_ym_dis.svg')} 
        className="ml-3 mr-3 status-btn" />
    </span>
  );
}

export const PCBtn = ({onClick, status}) => {
  return (
    <span onClick={onClick}>
      <img alt="" 
        // src={status ? require('./svg/status_pc.svg') : require('./svg/status_pc_dis.svg')} 
        className="ml-3 mr-3 status-btn" />
    </span>
  );
}