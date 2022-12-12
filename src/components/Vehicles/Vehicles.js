import { useState, useEffect, useRef } from "react"
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux"
import { getVehicles } from "../../actions/vehicleAction"
import DataTableVehicle from './DataTableVehicle'
import Loading from "../layout/Loading"
import { useNavigate } from "react-router-dom";

const Vehicles = () => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState("");
    const [searchStatus, setSearchStatus] = useState("active");
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { vehicles, count, totalRecord, totalVehcile, loading } = useSelector(state => state.vehicles)
    const itemsPerPage = 20
    const childRef = useRef();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const subscriptionInfo = userInfo && userInfo.companyInfo && userInfo.companyInfo.subscription && userInfo.companyInfo.subscription.subscriptionInfo ? userInfo.companyInfo.subscription.subscriptionInfo : '';
    const userType = userInfo && userInfo.user ? userInfo.user.userType : ''
    

    useEffect(() => {
        dispatch(getVehicles(currentPage, searchKey, searchStatus))
    }, [dispatch, currentPage, searchKey, searchStatus])
    // const submitHandler = (e) => {
    //     e.preventDefault();
    //     if (searchKey !== "" || searchStatus !== "") {
    //         dispatch(getVehicles(searchKey, searchStatus));
    //     }
    // };

    const callSearch = (e) => {
        setSearchKey(e.target.value);
    }

    const clearFilter = (e) => {
        e.preventDefault();
        setSearchKey("");
        setSearchStatus("");
        dispatch(getVehicles(searchKey, searchStatus));
    }
    // const setSelectedRowsCount = (newCount) => {
        // setSelectedCount(newCount);
    // };
    const finalVehicleCount = totalVehcile === undefined ? 0 : totalVehcile
    const countValue = subscriptionInfo?.vehicleCount === undefined ? 0 : subscriptionInfo?.vehicleCount;
     const navigate = useNavigate();
    // console.log(countValue,totalVehcile,finalVehicleCount >= countValue,50)
    const handleClick =() =>{
        if(userType === "company-administrator" && finalVehicleCount >= countValue){
        toast.warning(`Your current subscription is only for up to ${countValue} Active Vehicle, Please subscribe to more vehicles`)

        navigate("/billing")
        }else if(userType === "system-technician" || userType === "system-administrator"){ 
            
           userType === "system-technician" ? toast.warning("As technician user you are allowed to add vehicles without subscription") :  toast.warning("As system-administrator user you are allowed to add vehicles without subscription")
            navigate("/settings/vehicles/create")
        }else{
            navigate("/settings/vehicles/create") 
        }
    }
    const pageHead = `Vehicles(${count ? count : 0})`
    return (
        <>
            <div id="layout-wrapper" className={isMode}>
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className={userType === "company-administrator" ? "page-content company-admin" : "page-content"}>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box vehicles-add-div">
                                        <div className="row">
                                            <div className="col-6 flex-grow-1">
                                                {/* <form className="search-data_n"> */}
                                                    <div className="row">
                                                        <div className="col col-sm 12 col-md-6 tob-section-option">
                                                            <div className="form-group app-search p-0 ">
                                                                <label>&nbsp;</label>
                                                                <div className="position-relative">
                                                                    <input type="text" onBlur={callSearch} defaultValue={searchKey} className="form-control font-size-11" placeholder="Search by Vehicle ID or VIN Number" />
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
                                            <div className="col-auto col-6 refresh-btn-div">
                                                <div className="d-inline-flex">
                                                    <div className="col-sm-10">
                                                        <div className="form-group">
                                                            <label className="form-label">&nbsp;</label>
                                                            <button  type="button" onClick={() =>handleClick()}  className="btn d-block add-button" ><i className="ti ti-plus font-size-17 vertical-align-top"></i> Add Vehicle</button>
                                                           
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
                                        { loading ?
                                            <Loading /> :
                                            <DataTableVehicle count={count} currentPage={currentPage} setCurrentPage={setCurrentPage} data={vehicles} ref={childRef} itemsPerPage={itemsPerPage} totalRecord={totalRecord} mode='edit' />
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

export default Vehicles