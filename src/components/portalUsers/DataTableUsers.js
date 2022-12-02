import React from "react";
import Pagination from 'react-js-pagination';
import { Link } from "react-router-dom";

const DataTableUsers = (props) => {
  let data = props.data;
  
  return (
    <>
    
     <div className="table-responsives mb-0">
        <table align="left" className="table table-background dt-responsive">
          <thead>
            <tr>
              <th valign="middle" width="20%">NAME<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
              <th valign="middle" width="20%">EMAIL</th>
              <th width="20%" valign="middle" align="center">ROLE</th>
              <th width="20%">STATUS</th>
              <th width="20%">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {data && data?.length > 0 ? data?.map((item, index) => (
              <tr key={index}>
                <td>{item.firstName + ' ' + (item.lastName)}</td>
                <td>{item.email}</td>
                <td>{item.role }</td>
                <td>{item.active === true ? 'Active' : 'Inactive'}</td>
                <td><Link className="btn custom-btn-outline-info" to={`/settings/user/update/${item.id}`}><i className="ti ti-edit"></i></Link>
                </td>
              </tr>
            )) : <tr>
                  <td colSpan={5} className="align-center">No matching records found</td>
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
};

export default DataTableUsers;