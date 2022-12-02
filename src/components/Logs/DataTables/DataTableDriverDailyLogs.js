import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';
import { Link } from "react-router-dom";
import moment from "moment";
import { getHOSViolation } from '../utils'
import { Tooltip } from "../../layout/Comman/Tooltip";
import { distance } from '../components/EventFormTechModal/utils'
const DataTableDriverLogDetail = forwardRef((props, ref) => {
  let finalData = props.data;
  const getLocation = (latestCoordinate, lastCoordinate) => {
    let response = distance(latestCoordinate.lat, latestCoordinate.lng , lastCoordinate.lat ,lastCoordinate.lng)
    return response + ' mi';
  }
  return (
    <>
    <div className="table-responsives mb-0">
        <table align="left" className="table table-background dt-responsive">
          <thead>
            <tr>
              <th valign="middle" width="20%">DATE<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
              <th valign="middle" width="20%">HOURS WORKED</th>
              <th width="20%" valign="middle" align="center">DISTANCE</th>
              <th width="20%">HOS VIOLATIONS</th>
              <th width="20%">FORM & MANNER ERRORS</th>
            </tr>
          </thead>
          <tbody>
          { finalData.length > 0 ? finalData.map((item, index) => (
            <tr key={index}>
              <td><Link to={`/driver/graph-detail/${item.driverId}/${moment(item.logDate).format('DD-MM-YYYY')}`}>{moment(item.logDate).format('MMMM DD')}</Link></td>
              <td>{item.hoursWorked ? item.hoursWorked : 'NA'}</td>
              <td>{item?.latestCoordinates && item?.lastCoordinates ? getLocation(item?.latestCoordinates, item?.lastCoordinates) : 'NA'}</td>
              <td>{item.hosViolation && item.hosViolation.length > 0  ? 
                <span className="text-danger">
                    {getHOSViolation(item.hosViolation)[0]}
                    <span className="counter">
                        {`+${getHOSViolation(item.hosViolation).length - 1}`}
                    </span>
                </span> : 'No Violation'}
              </td>
              <td>{item.forms_errors && item.forms_errors.length ?
                    <span className="d-flex text-danger">
                    <Tooltip
                      color="#EB5757"
                      bgColor="#fff"
                      border="#EB5757"
                      tooltips={item.forms_errors.filter((el, i) => i !== 0)}
                    >
                    {item.forms_errors[0]['value']}
                      <span className="counter">
                        {`+${item.forms_errors.length - 1}`}
                      </span>
                    </Tooltip>
                    </span>
                : 'No Error'}
              </td>
            </tr>
          ))
          : <tr><td colSpan={5} className="align-center">No matching records found</td></tr>
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

export default DataTableDriverLogDetail;