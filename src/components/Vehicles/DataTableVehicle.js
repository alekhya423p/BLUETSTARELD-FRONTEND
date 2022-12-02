import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import Pagination from 'react-js-pagination';

const DataTableVehicle = forwardRef((props, ref) => {
  // const [currentPage, setCurrentPage] = useState(1) 

  // const setCurrentPageNo = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  let data = props.data;

  return (
    <>
      <div className="table-responsives mb-0">
        <table align="left" className="table table-background dt-responsive">
          <thead>
              <tr>
                  <th valign="middle" width="10%">VEHICLE ID<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
                  <th valign="middle" width="10%">LICENSE PLATE</th>
                  <th width="10%" valign="middle" align="center">YEAR</th>
                  <th width="10%">MAKE/MODEL</th>
                  <th width="10%">VIN</th>
                  <th width="10%">ELD SN (MAC)</th>
                  <th width="10%" valign="middle">Status</th>
                  <th width="10%">Action</th>
              </tr>
          </thead>
          <tbody>
          { data.length > 0  ? data.map((item, index) => (
            <tr key={index}>
              <td>{item.vehicleNumber}</td>
              <td>{item.plateNumber ? item.plateNumber : 'N/A'}</td>
              <td>{item.year}</td>
              <td>{item.make } / {item.vehicleModel}</td>
              <td>{item.vin}</td>
              <td>{item.eldSerialNumber} {item.eldMacAddress ?  '(' + item.eldMacAddress + ')' : ''}</td>
              <td>{item.active === true ? 'Active' : 'Inactive'}</td>
              <td><Link className="btn custom-btn-outline-info" to={`/settings/vehicles/${item.id}`}><i className="ti ti-edit"></i></Link>
              </td>
            </tr>
          )) :
          <tr>
            <td colSpan={8} className="align-center">No matching records Found</td>
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

export default DataTableVehicle;