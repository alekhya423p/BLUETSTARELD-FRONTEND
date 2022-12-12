import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';
import moment from "moment";
// import { activeCompany } from "../../../actions/authAction";
// import { useDispatch } from 'react-redux'

const DataTableFMCSA = forwardRef((props, ref) => {
//   const dispatch = useDispatch();
// let data = props.data;
//   const hendelActiveCompany = (id) => {
//     dispatch(activeCompany(id))
//   } 

let data = props.data;

  return (
    <>
        <div className="table-responsives mb-0">
            <table align="left" className="table table-background dt-responsive fmsca_transfer">
                <thead>
                <tr>
                    <th valign="middle" width="23%">DATE <i className="ti ti-arrow-narrow-down font-size-14"></i>
                    </th>
                    <th valign="middle" width="23%">COMPANY NAME</th>
                    <th valign="middle" width="23%">VEHICLE ID</th>
                    <th width="23%" valign="middle">DRIVER</th>
                    <th width="23%">REQUEST ORIGIN</th>
                    <th width="23%">DATE RANGE</th>
                    <th width="23%">FILE STATUS</th>
                    <th width="23%">TEST</th>
                    <th width="8%" className="align-right">ACTIONS</th>
                </tr>
                </thead>
                <tbody>
                  {/* Jan 15, 2022 - 11:25PM */}
                  {data.length > 0 ? data?.map((item, index) => (
                    <tr>
                      <td>{moment(item.createdAt).utc().format('MMM DD, YYYY - hh:mm A')} UTC</td>
                      <td>{item?.companyId?.companyName}</td>
                      <td>{item?.vehicleId?.vehicleNumber}</td>
                      <td>{item?.driverId?.firstName} {item?.driverId?.lastName}</td>
                      <td>{item.requestType === "MOBILE_TRANSFER_DATA" ? 'Mobile App - Transfer Data'  : item.requestType === "MOBILE_EMAIL_TRANSFER" ? 'Mobile App - Email Logs' : 'Portal - Transfer Data'} </td>
                      <td>{`${moment(item.startDate).format('MMM D')} - ${moment(item.endDate).format('MMM D')}`}</td>
                      <td>{item.status}</td>
                      <td>{item.test ? 'TRUE' : 'FALSE'}</td>
                      <td className="align-right"><a href={item.file}><i className="ti ti-file-download"></i></a></td>
                  </tr>
                  )): 
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

export default DataTableFMCSA;