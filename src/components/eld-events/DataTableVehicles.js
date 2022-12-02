import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';
import { Link } from "react-router-dom";

const DataTableLogs = forwardRef((props, ref) => {
  let data = props.data;

  return (
    <>
    <div className="table-responsives mb-0">
      <table align="left" className="table table-background dt-responsive">
        <thead>
            <tr>
              <th width="20%" valign="middle">VEHICLE ID<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
              <th width="20%">VIN</th>
              <th valign="middle" width="20%">ELD SN (MAC)</th>
              <th width="20%" valign="middle" align="center">UNIDENTIFIED EVENTS</th>
              <th width="20%">UNIDENTIFIED TIME</th>
            </tr>
        </thead>
        <tbody>
        { data.length > 0 ? data.map((item, index) => (
          <tr key={index}>
            <td><Link to={`/eld-events/${item.vehicleId}/${item.vehicleNumber}/${item.vin}`}>{item.vehicleNumber}</Link></td>
            <td>{item.vin ? item.vin : 'NA'}</td>
            <td>{item.eldSerialNumber + item.eldMacAddress ? '(' +  item.eldMacAddress + ')' : ''}</td>
            <td className="text-danger">{item.eventCount ? item.eventCount : '0'}</td>
            <td>{item.unidentifiedTime } </td>
          </tr>
        )) :
        <tr>
          <td colSpan={5} className="align-center">No matching records Found</td>
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

export default DataTableLogs;