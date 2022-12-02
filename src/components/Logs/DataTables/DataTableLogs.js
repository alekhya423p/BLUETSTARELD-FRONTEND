import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import Pagination from 'react-js-pagination';
import { getHOSViolation } from '../utils'
import moment from 'moment'
import { Tooltip } from "../../layout/Comman/Tooltip";

const DataTableLogs = forwardRef((props, ref) => {
  let data = props.data;
  return (
    <>
      <div className="mb-0">
        <table align="left" className="table table-background table-responsives dt-responsive">
          <thead>
            <tr>
              <th valign="middle" width="10%">DRIVER<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
              <th valign="middle" width="10%">HOS VIOLATIONS</th>
              <th width="10%" valign="middle" align="center">FORMS & MANNER ERRORS</th>
              <th width="10%">LAST SYNC</th>
            </tr>
          </thead>
          <tbody>
            { data.length > 0 ? data.map((item, index) => (
              <tr key={index}>
                <td><Link to={`/driver/${item.driverId}`}>{item.driverName}</Link></td>
                <td>{item.hosViolation && item.hosViolation.length > 0  ? 
                  <span className="text-danger">
                  <Tooltip
                    color="#EB5757"
                    bgColor="#fff"
                    border="#EB5757"
                    tooltips={getHOSViolation(item.hosViolation).filter((el, i) => i !== 0)}
                  >
                    {getHOSViolation(item.hosViolation)[0]}
                    <span className="counter">
                        {`+${getHOSViolation(item.hosViolation).length - 1}`}
                    </span>
                    </Tooltip>
                  </span> : 'No Violation'}
                </td>
                
                <td>{item.forms_errors && item.forms_errors.length ?
                  <Tooltip
                    color="#EB5757"
                    bgColor="#fff"
                    border="#EB5757"
                    tooltips={item.forms_errors.filter((el, i) => i !== 0)}
                  >
                    <span className="d-flex text-danger">
                    {item.forms_errors[0]['value']}
                      <span className="counter">
                        {`+${item.forms_errors.length - 1}`}
                      </span>
                    </span>
                  </Tooltip>
                : 'No Error'}
                </td>
                <td>{item.lastSync ? moment(item.lastSync).fromNow() : 'NA'}</td>
              </tr>
            )) : <tr><td colSpan={4} className="align-center">No matching records found</td></tr> }           
          </tbody>
        </table>
      </div>
      { props.totalRecord > props.count && (
        <div className="pagination-bx">
          <Pagination
            activePage={props.currentPage}
            itemsCountPerPage={props.count}
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