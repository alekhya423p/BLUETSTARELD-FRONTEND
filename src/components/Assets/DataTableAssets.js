import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';
import { Link } from "react-router-dom";

const DataTableAssets = forwardRef((props, ref) => {
  let data = props.data;

  return (
   <>
    <div className="table-responsives mb-0">
      <table align="left" className="table table-background dt-responsive">
        <thead>
          <tr>
            <th valign="middle" width="15%">VEHICLE ID<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
            <th valign="middle" width="15%">LOCATION SHARE</th>
            <th width="15%" valign="middle" align="center">DRIVER</th>
            <th width="15%">LOCATION</th>
            <th width="10%">VIN</th>
            <th width="10%">ELD SN (MAC)</th>
            <th width="15%">LOCATION HISTORY</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((item, index) => (
            <tr key={index}>
              <td><Link to={`/dashboard/vehicle/${item.vehicle}/${item.vehicleId}`}>{ item.vehicle }</Link></td>
              <td><i className="ti ti-link" aria-hidden="true" data-toggle="modal" data-target="#locationModal"></i></td>
              <td>{item.driver ? item.driver : 'NA'}</td>
              <td>{item.location ? <><i className="ti ti-map-pin"></i> {item.location}</> : 'NA'} </td>
              <td>{ item.vin }</td>
              <td>{item.eldsn ? item.eldsn : 'NA'}</td>
              <td><Link to={`/dashboard/vehicle/${item.vehicle}/${item.vehicleId}`}><i className="ti ti-link" aria-hidden="true"></i></Link></td>
            </tr>
          )) : 
          <tr>
            <td colSpan={7} className="align-center">No matching records Found</td>
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

export default DataTableAssets;