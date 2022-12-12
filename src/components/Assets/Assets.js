import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import DataTableAssets from "./DataTableAssets";
import Loading from "../layout/Loading";
import {useEffect, useState, useRef } from "react";
import { getAllAssets } from "../../actions/assetsAction";
import { useDispatch, useSelector } from "react-redux";

const Assets = () => {
    const dispatch = useDispatch()
    const { assets, count, totalRecord, loading } = useSelector(state => state.assets)
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { user } = useSelector((state) => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchkey, setSearchKey] = useState();
    const itemsPerPage = 20
    const childRef = useRef();
    const pageHead = `Assets(${count ? count : 0})`
    var userType = user && user.user && user.user.userType;

    useEffect(() => {
        dispatch(getAllAssets(currentPage, searchkey))
    },[dispatch, currentPage, searchkey])

    const CallSearch = (e) => {
        setSearchKey(e.target.value);
    }

    const clearFilter = (e) => {
        e.preventDefault();
        setSearchKey('');

        dispatch(getAllAssets(currentPage, searchkey));
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
                                        <div className="col-7 flex-grow-1">
                                            <div className="row">
                                                <div className="col col-sm-3">                                                
                                                    <div className="form-group app-search p-0">
                                                        <label>&nbsp;</label>
                                                        <div className="position-relative">
                                                            <input type="text"  className="form-control font-size-11" placeholder="Search by Vehicle ID or VIN Number" onBlur={CallSearch}/>
                                                            <span className="ti ti-search"></span>
                                                        </div>
                                                    </div>
                                                </div>   
                                                <div className="col col-sm-4">
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
                                        <DataTableAssets count={count} currentPage={currentPage} setCurrentPage={setCurrentPage} totalRecord={totalRecord} data={assets} ref={childRef} itemsPerPage={itemsPerPage} mode='edit' />
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
        {/* <!-- Modal --> */}
        <div className={`modal fade ${isMode}`} id="locationModal" tabIndex="-1" aria-labelledby="locationModalLabel" aria-hidden="true">
            <div className="modal-dialog my-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title font-size-16" id="locationModalLabel"><b>Share Live Link</b></h5>
                        <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="expire_date_box">
                            <div className="form-group">                                    
                                <label htmlFor="dtpickerdemo" className="control-label text-dark">Expiration Date</label>
                                <div className='col-sm-4 input-group date'>
                                    <input type='date' className="form-control" id='dtpickerdemo'/>
                                    <span className="input-group-text bg-danger text-light" id="basic-addon1"><i className="ti ti-link"></i></span>
                                </div>
                            </div>
                            <div className="form-group">                                    
                                <label htmlFor="dtpickerdemo" className="control-label mt-2 text-dark">URL</label>
                                <div className='col-sm-4 input-group date'>
                                    <input type='text' className="form-control" placeholder="link.bluestareld.com" />
                                    <span className="input-group-text bg-primary text-light" id="basic-addon1"><i className="fas fa-clone"></i></span>
                                </div>
                            </div>
                        </div>
                        <div className="expire_date_box mt-2">
                            <div className="form-group">                                    
                                <label htmlFor="dtpickerdemo" className="control-label text-dark">Expiration Date</label>
                                <div className='col-sm-4 input-group date'>
                                    <input type='date' className="form-control" id='dtpickerdemo'/>
                                    <span className="input-group-text bg-danger text-light" id="basic-addon1"><i className="ti ti-link"></i></span>
                                </div>
                            </div>
                            <div className="form-group">                                    
                                <label htmlFor="dtpickerdemo" className="control-label mt-2 text-dark">URL</label>
                                <div className='col-sm-4 input-group date'>
                                    <input type='text' className="form-control" placeholder="link.bluestareld.com" />
                                    <span className="input-group-text bg-primary text-light" id="basic-addon1"><i className="fas fa-clone"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer m-auto w-100">
                        <button type="button" className="btn btn-primary w-100">Create Live Share Link</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Assets;