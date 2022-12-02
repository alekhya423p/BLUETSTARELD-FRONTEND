import React from 'react';
// import './Dst.scss';
import moment from 'moment-timezone';
import { times } from '../../../utils';

export const Dst = () => {
   const { startDate, tz } = times();

   let isDst = !moment.tz(moment(startDate), tz).isDST()
      && moment.tz(moment(startDate).add(1, "days"), tz).isDST()

   let isNotDst = moment.tz(moment(startDate), tz).isDST()
      && !moment.tz(moment(startDate).add(1, "days"), tz).isDST()

   let text = isDst ? "-1" : isNotDst && "+1";

   return (
      isDst || isNotDst ?
      <div className="Dst">
         <span className="Dst_text">{text}</span>
      </div> : null
   )
}
