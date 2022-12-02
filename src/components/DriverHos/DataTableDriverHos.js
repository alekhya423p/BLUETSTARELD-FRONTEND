import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';
import { Link } from "react-router-dom";
import moment from "moment";
import { getLogEventCode } from '../../helper/helper'
const DataTableDriverHos = forwardRef((props, ref) => {
  let data = props.data;
  
  const getDuration = (totalSecs) => {
    var sec_num = parseInt(totalSecs, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60

    return [hours,minutes]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
    // let h = Math.floor(totalSecs / 3600);
    // let m = Math.floor((totalSecs - h * 3600) / 60);
    // return h +':'+ m;
  };

  return (
    <>
    <div className="table-responsives mb-0">
      <table align="left" className="table table-background table-responsive dt-responsive driver-hos-tbl">
        <thead>
          <tr>
            <th width="5%">DRIVER</th>
            <th width="10%">VEHICLE <i className="ti ti-arrow-narrow-down font-size-14"></i></th>
            <th width="10%">STATUS</th>
            <th width="10%">BREAK</th>
            <th width="10%">DRIVE</th>
            <th width="10%">SHIFT</th>
            <th width="10%">CYCLE</th>
            <th width="10%">CYCLE TOMORROW</th>
            <th width="10%">LAST SYNC</th>
            <th width="10%">VIOLATION</th>
            <th width="5%">LOGS</th>
            {/* <th>CONTACTS</th> */}
          </tr>
        </thead>
        <tbody>
        {data.length > 0 ? data.map((item, index) => (          
          <tr key={index}>
            <td>{ item.driver }</td>
            <td>{ item.eldConnectionInterface === "" ? <i className="ti ti-alert-triangle text-danger warning-danger"></i> : item.eldConnectionInterface === "connected" ? <i className="ri-bluetooth-line font-size-24  text-success"></i> : <img src="assets/images/bluetooth-red.png" alt="bluetooth-off" height="22s"/> } <i className="ri-map-pin-line text-grey  font-size-24"></i> &nbsp; <strong>{ item.vehicleNumber }</strong></td>
            {/* <td><i className="ri-bluetooth-line font-size-24  text-success"></i>&nbsp;<i className="ri-map-pin-line text-grey  font-size-24"></i> &nbsp; <strong>{ item.vehicleNumber }</strong></td> */}
            <td>
              <button type="button" className={`btn custtom-btns waves-effect waves-light ${item.currentStatus}`}><span className="d-block">{getLogEventCode(item.currentStatus)}</span><small className="font-size-10">{moment(item.currentDate).fromNow()}</small></button>
            </td>           
            <td>
              { item && item?.calculatedTimes.map((time) => (
                 time.type === "breakTime" ? getDuration(time.limitTime ? time.limitTime : 0) : '' 
                ))
              }
            </td>
            <td>
              { item && item?.calculatedTimes.map((time) => (
                  time.type === "driveTime" ? getDuration(time.limitTime ? time.limitTime : 0) : '' 
                ))
              }
            </td>
            <td>
              { item && item?.calculatedTimes.map((time) => (
                  time.type === "shiftTime" ? getDuration(time.limitTime ? time.limitTime : 0) : '' 
                ))
              }
            </td>
            <td>
              { item && item?.calculatedTimes.map((time) => (
                  time.type === "cycleTime" ? getDuration(time.limitTime ? time.limitTime : 0) : '' 
                ))
              }
            </td>
            <td>{ item.cycleTimeAvailableTomorrow ? item.cycleTimeAvailableTomorrow : 'NA' }</td>
            <td className="last_sync">{ moment(item.lastSync).fromNow()  }</td>
            <td className="text-danger">{ item.violation ? <i className="ti ti-clock warning-danger"></i> : "" }</td>
            <td><Link to={`/driver/graph-detail/${item.driverId}/${moment().format('DD-MM-YYYY')}`}><i className="ti ti-wave-square font-size-24"></i></Link></td>
            {/* <td><span><i className="ti ti-phone-outgoing font-size-24"></i>&nbsp;<i className="ti ti-message-circle-2 font-size-24"></i></span></td> */}
          </tr>
        )) : 
        <tr>
          <td colSpan={12} className="align-center">No matching records Found</td>
        </tr>
        }           
        </tbody>
      </table>
    </div>
    {props.totalRecord > props.itemsPerPage && (
    <div className="pagination-bx">
      <Pagination
        activePage={props.currentPage}
        itemsCountPerPage={props.itemsPerPage}
        totalItemsCount={props.totalRecord}
        nextPageText="Next"
        prevPageText="Prev"
        firstPageText="First"
        lastPageText="Last"
        onChange={props.setCurrentPage}
        itemClass="page-item"
        linkClass="page-link"
      />
    </div>
    )}
    </>
  );
});

export default DataTableDriverHos;