import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';
import { Link } from "react-router-dom";

const DataTableUsers = forwardRef((props, ref) => {
  let data = props.data;

  return (
    <>
      <div className="mb-0 table-responsives">
        <table align="left" className="table table-responsives table-background dt-responsive">
          <thead>
            <tr>
              <th valign="middle" width="20%">DRIVER<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
              <th valign="middle" width="10%">DRIVER ID</th>
              <th width="10%" valign="middle" align="center">EMAIL</th>
              <th width="10%">PHONE</th>
              <th width="10%">CYCLE</th>
              <th width="10%">ASSIGNED VEHICLE</th>
              <th width="10%">APP VERSION</th>
              <th width="10%">STATUS</th>
              <th width="10%">ACTION</th>
            </tr>
          </thead>
          <tbody>
          {data && data.length > 0 ? data.map((item, index) => (
            <tr key={index}>
              <td>{ item.firstName } { item.lastName }</td>
              <td>{item.userName}</td>
              <td>{item.email}</td>
              <td>{item.phoneNumber }</td>
              <td>{item.cycle ? item.cycle : 'NA'}</td>
              <td>{item.vehicleNo ? item.vehicleNo : 'NA'}</td>
              <td>{item.os === "android" ? <i className="ti ti-brand-android font-size-24"></i> : item.os === "iOS" ? 'ios' : ''}{item.appVersion }</td>
              <td>{item.active === true ? 'Active' : 'Inactive'}</td>
              <td><Link className="btn custom-btn-outline-info" to={`/settings/drivers/${item.id}`}><i className="ti ti-edit"></i></Link></td>
            </tr>
          )) : 
          <tr>
            <td colSpan={9} className="align-center">No matching records Found</td>
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

export default DataTableUsers;