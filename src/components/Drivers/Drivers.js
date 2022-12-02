import {useEffect, useState, useRef} from "react"
import { useSelector, useDispatch } from "react-redux";
import { getDriver } from "../../actions/driverAction";
import { Link } from 'react-router-dom'
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
// import {Adb} from '@mui/icons-material';
import Loading from "../layout/Loading";
import DataTableUsers from "./DataTableUsers";

const Drivers = () => {

    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState("");
    const [searchStatus, setsearchStatus] = useState("active");
    const { drivers, count, totalRecord, loading } = useSelector(state => state.drivers)
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const itemsPerPage = 20
    const childRef = useRef();

    useEffect(()=>{
        dispatch(getDriver(currentPage, searchKey, searchStatus))
    },[dispatch, currentPage, searchKey, searchStatus])
   
    const clearFilter = (e) => {
        e.preventDefault();
        setSearchKey('');
        setsearchStatus('');
        dispatch(getDriver(currentPage, searchKey, searchStatus));
    }

    const callSearch = (e) => {
        setSearchKey(e.target.value);
    }

    const pageHead = `Driver(${count ? count : 0})`
    return (
        <>
        <div id="layout-wrapper" className={isMode}>
            <Header pageHead={pageHead}/>
            <Sidebar/>
            <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                <div className="page-content">
                    <div className="container-fluid">
                         {/* start page title  */}
                         <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="row">
                                        <div className="col-sm 12 col-md-6 flex-grow-1">
                                            {/* <form className="search-data_n"> */}
                                                <div className="row">
                                                    <div className="col col-md-6 col-sm-12 tob-section-option">
                                                        <div className="form-group app-search p-0 ">
                                                            <label>&nbsp;</label>
                                                            <div className="position-relative">
                                                                <input type="text" className="form-control font-size-11" onBlur={callSearch} defaultValue={searchKey} placeholder="Search by Driver Name"/>
                                                                <span className="ti ti-search"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col col-md-6 col-sm-12 tob-section-option">
                                                        <div className="form-group">
                                                            <label className="form-label">Filter by Status</label>
                                                            <select className="form-select" value={searchStatus} onChange={e=>setsearchStatus(e.target.value)}>
                                                                <option value="">All</option>
                                                                <option value="active">Active</option>
                                                                <option value="inactive">Inactive</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            {/* </form> */}
                                        </div>		
                                        <div className="col-sm 12 col-md-6 refresh-btn-div">
                                            <div className="d-inline-flex">
                                                <div className="col-sm-10">
                                                    <div className="form-group">
                                                        <label className="form-label">&nbsp;</label>
                                                        <Link to="/settings/drivers/create" type="button" className="btn d-block add-button" ><i className="ti ti-plus font-size-17 vertical-align-top"></i> Add Driver</Link>
                                                    </div>
                                                </div>
                                                <div className="col-sm-2">
                                                    <div className="form-group">
                                                        <label className="form-label">&nbsp;</label>
                                                        <button type="button" className="btn btn border border-color d-block  mx-2" onClick={clearFilter}><i className="ti ti-refresh"></i></button>
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
                                     <DataTableUsers currentPage={currentPage} setCurrentPage={setCurrentPage} data={drivers} ref={childRef} totalRecord={totalRecord} itemsPerPage={itemsPerPage} mode='edit' />
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

export default Drivers