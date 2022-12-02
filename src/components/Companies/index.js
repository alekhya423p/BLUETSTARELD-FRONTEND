import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { logout } from "../../actions/authAction";
import SystemUsers from "./SystemUsers";
import Company from "./Company";
import FMCSALogs from "./FMCSALogs";

const Companies = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth)
    const allow_correction = user && user.user && user.user.userType ? (user.user.userType === 'system-super-admin') : false;
    // const user = JSON.parse(localStorage.getItem("userInfo"));
    const {isMode } = useSelector(state => state.dashboard)
    const handleLogout = () => {
        dispatch(logout(navigate))
    };
    return (
        <>
        <div id="layout-wrapper" className={isMode}>
            <div className="main-contents">
                <div className="page-content companies-page">
                    <div className="container">
                         {/* start page title  */}
                         <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="row">
                                    <ul className="nav nav-tabs companies-nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="companies-tab" data-bs-toggle="tab" data-bs-target="#companies-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Companies List</button>
                                        </li>
                                        { allow_correction ? 
                                        <>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="system-tab" data-bs-toggle="tab" data-bs-target="#system-tab-pane" type="button" role="tab" aria-controls="system-tab-pane" aria-selected="false">System Users Management</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link" id="fmcsa-tab" data-bs-toggle="tab" data-bs-target="#fmcsa-tab-pane" type="button" role="tab" aria-controls="fmcsa-tab-pane" aria-selected="false">FMCSA Transfer Logs</button>
                                            </li>
                                        </>
                                        : null }
                                    </ul>
                                    <div className="tab-content" id="myTabContent">
                                        <div className="tab-pane fade show active" id="companies-tab-pane" role="tabpanel" aria-labelledby="companies-tab" tabIndex="0">
                                            <Company 
                                                allow_correction={allow_correction}
                                                handleLogout={handleLogout} />
                                            {/* end row */}
                                        </div>
                                        <div className="tab-pane fade" id="system-tab-pane" role="tabpanel" aria-labelledby="system-tab" tabIndex="0">
                                        {allow_correction ?  <SystemUsers allow_correction={allow_correction} handleLogout={handleLogout} /> : null }
                                            {/* end row */}
                                        </div>
                                        <div className="tab-pane fade" id="fmcsa-tab-pane" role="tabpanel" aria-labelledby="fmcsa-tab" tabIndex="0">
                                        {allow_correction ?  <FMCSALogs handleLogout={handleLogout} /> : null }
                                            {/* end row */}
                                        </div>
                                    </div>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                         
                    </div> 
                    {/* container-fluid */}
                </div>
                {/* End Page-content */}
            </div>
        </div>
        </>
    )
}

export default Companies;