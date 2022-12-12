import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import Pagination from 'react-js-pagination';

const DataTableELD = forwardRef((props, ref) => {
  let data = props.data;
  
  return (
    <>
      <div className="table-responsives mb-0">
        <table align="left" className="table table-background dt-responsive">
          <thead>
            <tr>
              <th valign="middle" width="10%">ELD SN (MAC)<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
              <th valign="middle" width="10%">ELD MODEL</th>
              <th width="10%" valign="middle" align="center">ASSIGNED VEHICLE</th>
              <th width="10%">BLE VERSION</th>
              <th width="10%">FIRMWARE VERSION</th>
              <th width="10%" valign="middle">STATUS</th>
              <th width="10%">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((item, index) => (
              <tr key={index}>
                <td>{item.serialNumber + ' ('+ item.macAddress +')'}</td>
                <td>{item.eldModel}</td>
                <td>{item.vehicleNumber ? item.vehicleNumber : 'NA'}</td>
                <td>{item.bleVersion ? item.bleVersion : 'NA'}</td>
                <td>{item.fwVersion ? item.fwVersion : 'NA'}</td>
                <td>{item.active === true ? 'Active' : 'Inactive'}</td>
                <td><Link className="btn custom-btn-outline-info" to={`/settings/elds/${item.id}`}><i className="ti ti-edit"></i></Link>
                </td>
              </tr>
            )) : <tr>
              <td colSpan={7} className="align-center">No matching records found</td>
            </tr>}           
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

export default DataTableELD;