import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';
// import { activeCompany } from "../../../actions/authAction";
// import { useDispatch } from 'react-redux'

const DataTableFMCSA = forwardRef((props, ref) => {
//   const dispatch = useDispatch();
  // let data = props.data;
//   const hendelActiveCompany = (id) => {
//     dispatch(activeCompany(id))
//   } 
  return (
    <>
        <div className="table-responsives mb-0">
            <table align="left" className="table table-background dt-responsive">
                <thead>
                <tr>
                    <th valign="middle" width="23%">DATE <i className="ti ti-arrow-narrow-down font-size-14"></i>
                    </th>
                    <th valign="middle" width="23%">COMPANY</th>
                    <th width="23%" valign="middle">DRIVER</th>
                    <th width="23%">REQUEST ORIGIN</th>
                    <th width="8%" className="align-right">ACTIONS</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Jan 15, 2022 - 11:25PM</td>
                    <td>ABC Trans Inc</td>
                    <td>Corey Goodman</td>
                    <td>Mobile App - Transfer Date </td>
                    <td className="align-right"><a href="/"><i className="ti ti-file-download"></i></a></td>
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

export default DataTableFMCSA;