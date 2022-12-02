import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';

const DataTableAlerts = forwardRef((props, ref) => {
//   let data = props.data;

  return (
    <>
      <div className="mb-0 table-responsives">
          <table align="left" className="table table-background dt-responsive">
              <thead>
                  <tr>
                      <th valign="middle"  width="20%">NAME</th>
                      <th valign="middle"  width="20%">TYPE</th>
                      <th width="20%" valign="middle" align="center">MONITOR</th>
                      <th width="20%" valign="middle" >NOTIFICATION</th>
                      <th width="20%" valign="middle" >ACTIONS</th>
                  </tr>
              </thead>     
              <tbody>
                <tr>
                  <td>Trucks Speeding </td>
                  <td>Vehicle Speeding above 70mph</td>
                  <td>All Vehicles</td>
                  <td>SMS, Email</td>
                  <td>
                    <i className="fa fa-pencil" aria-hidden="true" onClick={() => props.handleAddAlert()}></i>&nbsp;&nbsp;
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </td>
                </tr>                                             
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

export default DataTableAlerts;