import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const DataTableViewIftaReport = forwardRef((props, ref) => {
    let data = props.data;

    return (
        <>
            <div className="table-responsives mb-0">
                <table align="left" className="table table-background dt-responsive total-vehiles-table">
                    <thead>
                        <tr>
                            <th>Total Vehicles: {props.count}</th>
                            <th>Total Distance: {props.totalRecords} mi</th>
                        </tr>
                    </thead>
                </table>
                <table align="left" className="table table-background dt-responsive left-style-table">
                    <thead>
                        <tr>
                            <th>VEHICLE ID<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
                            <th>DISTANCE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((item, index) => (
                            <tr key={index}>
                                <td><Link to={`/reports/ifta/${props.id}/vehicle/${item.vehicleId}`}>{item.vehicleNumber}</Link></td>
                                <td className="align-left">{item.totalDistance} mi</td>
                            </tr>
                        )) : <tr>
                            <td colSpan={2} className="text-center">No matching records found</td>
                        </tr>
                        }

                    </tbody>
                </table>
            </div>
        </>
    );
});

export default DataTableViewIftaReport;