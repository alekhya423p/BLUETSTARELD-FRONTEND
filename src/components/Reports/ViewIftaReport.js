import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Loading from "../layout/Loading";
import { useEffect, useRef, useState } from 'react';
import { getReportsDetails } from '../../actions/reportsAction';
import DataTableViewIftaReport from "./dataTables/DataTableViewIftaReport";
import * as actionTypes from '../../constants/actionTypes';
import { useParams } from 'react-router-dom';
import { getVehicleMaster } from "../../actions/vehicleAction";
import Select from 'react-select';

const ViewIftaReport = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const childRef = useRef();
    const [inputMenu, setMenu] = useState(false);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [options, setOptions] = useState();
    const { reportDetails, reportLinks, count, loading, totalMiles } = useSelector(state => state.reports)
    const { masterVehicles } = useSelector(state => state.vehicles)
    const pageHead = `View IFTA Reports`
    const itemsPerPage = 20;
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { user } = useSelector(state => state.auth)
    var userType = user && user.user && user.user.userType;

    useEffect(() => {
        dispatch(getVehicleMaster())
        if(params.id){
            dispatch (getReportsDetails(params?.id, vehicleNumber))
        }else{
            dispatch({ type: actionTypes.GET_IFTA_DETAILS_RESET})
        }        
    }, [dispatch, params, vehicleNumber])
    

    const makeActive = (menuItem, e) => {
        localStorage.setItem("activeMenu", menuItem);
        setMenu(menuItem);
    }

    useEffect(() => {
		if(masterVehicles.vehicles) {
			var options = masterVehicles?.vehicles.map((item, index) => {
				return { key: index, value: item.vehicleNumber, label: item.vehicleNumber }
			})
		}
		setOptions(options);
	}, [masterVehicles])

    const handleAssignVehicle = (e) => {
        setVehicleNumber(e.value);
    }


    return(
        <>
        <div id="layout-wrapper" className={isMode}>
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
                                                            <Link to="/reports/ifta"><button type="button" className="btn btn-sm btn-outline-secondary return_btn_style"><i className="ti ti-arrow-left mtr10"></i>Return</button></Link>
                                                        </div>
                                                    </div>
                                                </div>                                                  
                                                <div className="col col-sm-3">
                                                    <div className="form-group">
                                                        <label className="form-label">Select Vehicle</label>
                                                        <Select defaultValue={vehicleNumber} onChange={(e) => handleAssignVehicle(e)} name="vehicleNumber" options={options} placeholder="Select Vehicle" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-7">
                                                    <div className="export-form-div">
                                                        <div className="row">
                                                            <div className="form-group">
                                                                <label className="form-label">&nbsp;</label>
                                                                <button type="button" className="btn d-block add-button" onClick={(e)=>makeActive("dashboard", e)}><i className="ti ti-file-export"></i>&nbsp;Export</button>
                                                                <ul className={(inputMenu === "dashboard") ? "drop-down-ul showDropDown" : "drop-down-ul"}>
                                                                    <li><a onClick={(e)=>makeActive("dash", e)} href={reportLinks.pdfUrl}>PDF</a></li>
                                                                    <li><a onClick={(e)=>makeActive("dash", e)} href={reportLinks.csvUrl}>CSV</a></li>
                                                                </ul>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label">&nbsp;</label>
                                                                <button type="button" className="btn d-block add-button mx-2" ><i className="ti ti-grid-dots"></i>&nbsp;Detailed Export</button>
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
                                {loading ?
                                    <Loading /> :
                                    <DataTableViewIftaReport ref={childRef} data={ reportDetails } mode='edit' itemsPerPage={itemsPerPage} count={count} totalRecords={totalMiles} id={params?.id} />
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
export default ViewIftaReport;