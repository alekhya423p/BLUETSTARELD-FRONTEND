import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import Pagination from 'react-js-pagination';

const DataTableIFTAReport = forwardRef((props, ref) => {
    let data = props.data;
    return (
        <> 
        <div className="table-responsives mb-0">
            <table align="left" className="table table-background dt-responsive ifta-report-tbl">
                <thead>
                    <tr>
                        <th valign="middle" width="20%">CREATED<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
                        <th valign="middle" width="20%">VEHICLE</th>
                        <th width="20%" valign="middle" align="center">DATES</th>
                        <th width="20%" valign="middle">STATUS</th>
                        <th width="20%">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.createdAt}</td>
                            <td>{item.vehicles}</td>
                            <td>{item.fromDate} - {item.toDate}</td>
                            <td>{item.status}</td>
                            <td><Link to={`/reports/ifta/${item.id}`}><i className="ti ti-clipboard-list"></i></Link></td>
                        </tr>
                        
                    )) : <tr>
                            <td colSpan={5} className="text-center">No matching records found</td>
                        </tr>}
                </tbody>
            </table>
            </div>
                 {props.totalRecords > props.itemsPerPage && (
                <div className="pagination-bx">
                    <Pagination
                        activePage={props.currentPage}
                        itemsCountPerPage={props.itemsPerPage}
                        totalItemsCount={props.totalRecords}
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

export default DataTableIFTAReport;