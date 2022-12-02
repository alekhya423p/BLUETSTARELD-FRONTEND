import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';

const DataTableIFTAReport = forwardRef((props, ref) => {
    let data = props.data;
    return (
        <> 
        <div className="table-responsives mb-0">
            <table align="left" className="table table-background dt-responsive">
                <thead>
                    <tr>
                        <th valign="middle" width="10%">DATE<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
                        <th valign="middle" width="18%">VEHICLE ID</th>
                        <th width="18%" valign="middle" align="center">DRIVER</th>
                        <th  width="10%" valign="middle">ACTIONS</th>           
                    </tr>
                </thead>      
                <tbody>
                    { data.length > 0 ? data.map((item, index) => (
                        <tr key={index}>
                            <td>{ item.reportCreatedAt }</td> 
                            <td>{ item.vehicleNumber }</td>
                            <td>{ item.driverName }</td>
                            <td><a href={item.fileUrl}><i className="ti ti-download" aria-hidden="true"></i> </a></td>
                        </tr>
                    )) : 
                    <tr>
                        <td colSpan={4} className="text-center">No matching records found</td>
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
                        onChange={props.setCurrentPageNo}
                        itemClass="page-item"
                        linkClass="page-link"
                    />
                </div>
            )}
        </>
    );
});

export default DataTableIFTAReport;