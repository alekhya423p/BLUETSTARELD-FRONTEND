import React, { useState, useEffect } from "react"
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { getUsers } from '../../actions/userAction'
import { useSelector, useDispatch } from "react-redux"
import DataTableUsers from "./DataTableUsers"
import { Link } from "react-router-dom"
import Loading from "../layout/Loading"

const PortalUser = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setsearchKey] = useState("");
    const [searchStatus, setsearchStatus] = useState("");
    const { users, count, totalRecord, loading } = useSelector(state => state.user)
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const pageHead = `Portal Users(${count ? count : 0})`
    const itemsPerPage = 20;
    //console.log(users);
    useEffect(() => {
        dispatch(getUsers(currentPage, searchKey, searchStatus))
    }, [dispatch, currentPage, searchKey, searchStatus])

    const callSearch = (e) => {
        setsearchKey(e.target.value);
    }
    
    const clearFilter = (e) => {
        e.preventDefault();
        setsearchKey("");
        setsearchStatus("");
        dispatch(getUsers(currentPage, searchKey, searchStatus));
    }
    return (
        <>
            <div id="layout-wrapper" className={isMode}>
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <div className="row">
                                            <div className="col-sm 12 col-md-6 flex-grow-1">
                                                <div className="row">
                                                    <div className="col col-sm-6 tob-section-option">
                                                        <div className="form-group app-search p-0 ">
                                                            <label>&nbsp;</label>
                                                            <div className="position-relative">
                                                                <input type="text" defaultValue={searchKey} onBlur={callSearch} className="form-control font-size-11" placeholder="Search by Name or Email" />
                                                                <span className="ti ti-search"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col col-sm-6 tob-section-option">
                                                        <div className="form-group">
                                                            <label className="form-label">Filter by Status</label>
                                                            <select className="form-select" value={searchStatus} onChange={e => setsearchStatus(e.target.value)}>
                                                                <option value="">All</option>
                                                                <option value="active">Active</option>
                                                                <option value="inactive">Inactive</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm 12 col-md-6 refresh-btn-div">
                                                <div className="d-inline-flex">
                                                    <div className="col-sm-10">
                                                        <div className="form-group">
                                                            <label className="form-label">&nbsp;</label>
                                                            <Link to="/settings/user/create" className="btn d-block add-button" ><i className="ti ti-plus font-size-17 vertical-align-top"></i> Add User</Link>
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
                            <div className="row">
                                <div className="col-12 text-center">
                                    <div className="table-responsives mb-0">


                                    {loading ?
                                     <Loading /> :
                                     <DataTableUsers count={count} currentPage={currentPage} setCurrentPage={setCurrentPage} data={users} totalRecord={totalRecord} itemsPerPage={itemsPerPage} mode='edit' />
                                    }

                                    </div>
                                </div>
                                {/* end col */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PortalUser