import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getELDDevices } from "../../actions/eldDevicesAction"
import DataTableELD from "./DataTableELD"
import Loading from "../layout/Loading"
import { getVehicleMaster } from "../../actions/vehicleAction"

const ELD = () => {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const { isMinimize, isMode } = useSelector(state => state.dashboard)
  const [searchStatus, setSearchStatus] = useState("active");
  const { elddevices, count, totalRecord, loading } = useSelector(state => state.elddevice)
  const itemsPerPage = 20
  const childRef = useRef();
 
  useEffect(() => {
    dispatch(getELDDevices(currentPage, searchKey, searchStatus));
    dispatch(getVehicleMaster())
  }, [dispatch, currentPage, searchKey, searchStatus]);

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   if (searchKey !== "" || searchStatus !== "") {
  //     dispatch(getELDDevices(currentPage, searchKey, searchStatus));
  //   }
  // };

  const clearFilter = (e) => {
    e.preventDefault();
    let searchKey = '';
    let searchStatus = '';
    setSearchKey("");
    setSearchStatus("");
    dispatch(getELDDevices(currentPage, searchKey, searchStatus));
  };

  const callSearch = (e) => {
    setSearchKey(e.target.value);
}
  
  const pageHead = `ELD Devices(${count ? count : 0})`
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
                        {/* <form className="search-data_n" onSubmit={submitHandler}> */}
                          <div className="row">
                            <div className="col col-sm 12 col-md-6 tob-section-option">
                              <div className="form-group app-search p-0 ">
                                <label>&nbsp;</label>
                                <div className="position-relative">
                                  <input type="text" defaultValue={searchKey} onBlur={callSearch} className="form-control font-size-11" placeholder="Search by ELD SN or MAC Address" />
                                  <span className="ti ti-search"></span>
                                </div>
                              </div>
                            </div>
                            <div className="col col-sm 12 col-md-6 tob-section-option">
                              <div className="form-group">
                                <label className="form-label">Filter by Status</label>
                                <select className="form-select" value={searchStatus} onChange={e => setSearchStatus(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        {/* </form> */}
                      </div>


                      <div className="ccol-sm 12 col-md-6 refresh-btn-div">
                        <div className="d-inline-flex">
                          <div className="col-sm-10">
                            <div className="form-group">
                              <label className="form-label">&nbsp;</label>
                              <Link to='/settings/elds/create' className="btn d-block add-button" ><i className="ti ti-plus font-size-17 vertical-align-top"></i> Add ELD Device</Link>
                            </div>
                          </div>

                          <div className="col-sm-2">
                            <div className="form-group">
                              <label className="form-label">&nbsp;</label>
                              <button className="btn btn border border-color d-block mx-2" onClick={clearFilter}><i className="ti ti-refresh"></i></button>
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
                  <div className="mb-0">
                    {loading ?
                      <Loading /> :
                      <DataTableELD count={count} currentPage={currentPage} setCurrentPage={setCurrentPage} data={elddevices} ref={childRef} totalRecord={totalRecord} itemsPerPage={itemsPerPage} mode='edit' />
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

export default ELD