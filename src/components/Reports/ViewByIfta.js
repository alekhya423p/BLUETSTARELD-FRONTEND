import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from "../layout/Loading";
import DataTableViewByIfta from "./dataTables/DataTableViewByIfta";
import { useParams } from 'react-router-dom';
import { getReportsByVehicle } from "../../actions/reportsAction";
import { getAllStates } from "../../actions/reportsAction";
import * as actionTypes from '../../constants/actionTypes';
import Select from 'react-select';

const ViewByIfta = () => {

    const pageHead = `View IFTA Reports`;
    const params = useParams();
    const [inputMenu, setMenu] = useState(false);
    const dispatch = useDispatch();
    const [vehiclestate, setVehicleState] = useState();
    const [options, setOptions] = useState();
    const { vehicleDetails, vehicleReportLinks, states, count, loading } = useSelector(state => state.reports)
    const childRef = useRef();
    const { isMinimize } = useSelector(state => state.dashboard)
    const { user } = useSelector(state => state.auth)
    var userType = user && user.user && user.user.userType;

    useEffect(() => {
        dispatch(getAllStates());
        if(params.iftaId && params.vehicleId){
            dispatch (getReportsByVehicle(params?.iftaId, params?.vehicleId, vehiclestate))
        }else{
            dispatch({ type: actionTypes.GET_IFTA_BY_VEHICLE_RESET})
        }
    },[dispatch, params, vehiclestate])

    const makeActive = (menuItem, e) => {
        localStorage.setItem("activeMenu", menuItem);
        setMenu(menuItem);
    }

    useEffect(() => {
		if(states) {
            states.unshift({
                _id: '',
                state: 'Select State',
                stateKey: ''
            });
			var options = states.map((item, index) => {
				return { key: index, value: item.stateKey, label: item.state + (item.stateKey ? '(' + item.stateKey + ')' : '') }
			})
		}
		setOptions(options);
	}, [states])

    const handleAssignState = (e) => {
        setVehicleState(e.value);
    }

    return(
        <>
        <div id="layout-wrapper">
            <Header pageHead={pageHead} />
            <Sidebar />
            <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                <div className={userType === "company-administrator" ? "page-content company-admin" : "page-content"}>
                    <div className="container-fluid">
                         {/* start page title  */}
                         <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="row">
                                        <div className="col-12 flex-grow-1">
                                            <div className="row">
                                                <div className="col col-sm-2">                                                
                                                    <div className="form-group">
                                                        <label>&nbsp;</label>
                                                        <div>
                                                            <Link to={`/reports/ifta/${params?.iftaId}`}><button type="button" className="btn btn-sm btn-outline-secondary return_btn_style"><i className="ti ti-arrow-left mtr10"></i>Return</button></Link>
                                                        </div>
                                                    </div>
                                                </div>                                                  
                                                <div className="col col-sm-3">
                                                    <div className="form-group">
                                                        <label className="form-label">Select States</label>
                                                        <Select defaultValue={vehiclestate} onChange={(e) => handleAssignState(e)} name="vehiclestate" options={options} placeholder="All States" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-7">
                                                    <div className="export-form-div">
                                                        <div className="row">
                                                            <div className="form-group">
                                                                <label className="form-label">&nbsp;</label>
                                                                <button type="button" className="btn d-block add-button" onClick={(e)=>makeActive("dashboard", e)}><i className="ti ti-file-export"></i>&nbsp;Export</button>
                                                                <ul className={(inputMenu === "dashboard") ? "drop-down-ul showDropDown" : "drop-down-ul"}>
                                                                    <li><a onClick={(e)=>makeActive("dash", e)} href={vehicleReportLinks.pdfUrl}>PDF</a></li>
                                                                    <li><a onClick={(e)=>makeActive("dash", e)} href={vehicleReportLinks.csvUrl}>CSV</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>                                                   
                                            </div>
                                        </div>		
                                    </div>
                                </div>
                            </div>
                        </div>
                         {/* end page title */}
                        
                        <div className="row">
                            <div className="col-12 text-center">
                                <div className="mb-0">
                                { loading ?
                                    <Loading /> :
                                    <DataTableViewByIfta itemsPerPage={20} ref={childRef} data={vehicleDetails} states={states} count={count} mode='edit' />
                                }     
                                </div>
                            </div>  
                            {/* end col */}
                        </div> 
                        {/* <!-- end row --> */}
                         {/* end row */}
                    </div> 
                    {/* container-fluid */}
                </div>
                 {/* End Page-content */}
            </div>
        </div>
        </>
    )

}
export default ViewByIfta;