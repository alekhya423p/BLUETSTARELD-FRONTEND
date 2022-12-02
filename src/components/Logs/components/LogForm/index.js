import React from "react";
// import moment from "moment-timezone";

const LogForm = ({ data }) => {

    return (
        <div className="row log-forms-row mt-3">
            <b>Log Form</b>
            <div className="col-md-3">
                <div className="form-group p-0 tp-info">
                    <ul className="p-0 list-unstyled sm2">
                        <li><small>Driver:</small> <b>{data?.driver ? data?.driver.driverName : <span className="text-danger">N/A</span>}</b></li>
                        <li><small>Driver ID:</small> <b>{data?.driver ? <span >{data?.driver.driverUsername}</span> : <span className="text-danger">N/A</span>}</b></li>
                        <li><small>CDL:</small> <b className="">{data?.driver ? data?.driver.licenseNumber : <span className="text-danger">N/A</span>}</b></li>
                        <li><small>CDL State:</small> <b>{data?.driver ? <span  className="">{data?.driver.licenseState}</span> : <span className="text-danger">N/A</span>}</b></li>
                        <li><small>Exempt Driver Status:</small> <b className="">{data?.driver ? data?.driver.exempt ? 'Yes' : 'No': ''}</b></li>
                        <li><small>Co-Driver:</small> <b>{data?.driver ? data?.driver.coDriverName : <span className="text-danger">N/A</span>}</b></li>
                        <li><small>Co-Driver ID:</small> <b >{data?.driver ? data?.driver.coDriverId : <span className="text-danger">N/A</span>}</b></li>
                    </ul>
                </div>
            </div>

            <div className="col-md-3">
                <div className="form-group p-0 tp-info">
                    <ul className="p-0 list-unstyled sm2">
                        <li><small>Vehicle:</small> <b>{data?.vehicle ? data?.vehicle.vehicleNumber : ''}</b><i className="ti ti-send font-size-18 text-success"></i></li>
                        <li><small>VIN:</small><b> {data?.vehicle ? data?.vehicle.vin : ''}</b></li>
                        <li><small>Odometer:</small> <b>{data?.vehicle ? data?.vehicle.odometr : ''}</b></li>
                        <li><small>Distance:</small> <b>{data?.vehicle ? data?.vehicle.distance : ''}</b></li>
                        <li><small>Engine Hours:</small><b> {data?.vehicle ? data?.vehicle.engineHours : ''}</b></li>
                        <li><small>ELD SN (MAC):</small> <b>{data?.vehicle ? data?.vehicle.eldSerialNumber : ''} ({data?.vehicle ? data?.vehicle.eldMacAddress : ''})</b></li>
                    </ul>
                </div>
            </div>

            <div className="col-md-4">
                <div className="form-group p-0 tp-info">
                    <ul className="p-0 list-unstyled sm2">
                        <li><small>Carrier:</small> <b>{data?.company ? data?.company.companyName : ''}</b></li>
                        <li><small>Main Office:</small> <b>{data?.company ? data?.company.address : ''}</b></li>
                        <li><small>Home Terminal:</small> <b>{data?.company ? data?.company.address : ''}</b></li>
                        <li><small>DOT Number:</small> <b>{data?.company ? data?.company.dotNumber : ''}</b></li>
                        <li><small>Time Zone:</small> <b>{data?.company ? data?.company.timeZoneId : ''}</b></li>
                        <li><small>Device Malfunction:</small> <b>{data?.vehicle ? data?.vehicle.deviceMalfunction : ''}</b></li>
                        <li><small>Device Diagnostic:</small> <b>{data?.vehicle ? data?.vehicle.deviceDiagnostic : ''}</b></li>
                    </ul>
                </div>
            </div>
            <div className="col-md-2">
                <div className="form-group p-0 tp-info">
                    <ul className="p-0 list-unstyled sm2">
                        <li><small>ELD Provider:</small> <b>{data?.company ? 'LUCID ELD' : ''}</b></li>
                        <li><small>ELD ID:</small> <b>{data?.company ? 'LUCID1' : ''}</b></li>
                    </ul>
                </div>
            </div>
        </div >
    );
};

export default LogForm;
