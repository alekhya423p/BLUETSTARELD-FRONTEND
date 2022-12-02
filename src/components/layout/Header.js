import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { logout } from "../../actions/authAction";
import { getHeaderData } from "../../actions/dashboardAction";
import * as actionTypes from "../../constants/actionTypes";
// import logoDay from '../../assets/BLE-Logo-White.png';
import logoDay from "../../assets/Lucid ELD Logo-white.svg";
import logoNight from "../../assets/Lucid-ELD-Logo.svg";
import logo from "../../assets/icon-only.svg";
import greenCircle from "../../assets/green-circle.svg";
import moveArrow from "../../assets/move-arrow.svg";
import stopPoint from "../../assets/stop-point.svg";
// import { getDashboard } from "../../actions/dashboardAction";

const Header = (props) => {
    const dispatch = useDispatch();
    const { isMinimize } = useSelector((state) => state.dashboard);
    const { isMode } = useSelector((state) => state.dashboard);
    const [inputMenu, setMenu] = useState(false);
    const [isDashboard, setIsDashboard] = useState(false);
    const [checked , setChecked] = useState(true)
    const { user } = useSelector((state) => state.auth);
    const allow_correction =
        user && user.user && user.user.userType
            ? user.user.userType === "system-administrator" ||
            user.user.userType === "system-technician" ||
            user.user.userType === "system-super-admin"
            : false;
    // const allow_billing =
    //     user && user.user && user.user.userType
    //         ? user.user.userType !== "company-fleet-manager"
    //         : true;
    // const userType = user && user.user && user.user.userType;
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout(navigate));
    };
    // let nMode = JSON.parse(localStorage.getItem("nMode"));
    const [chart, setChart] = useState(
        isMode === "nModeOn" ? logoDay : logoNight
    );
    const { dashboardStatus, vehicleStatus } = useSelector(
        (state) => state.dashboard
    );

    useEffect(() => {
        // let nMode = JSON.parse(localStorage.getItem("nMode"));
        setChart(isMode === "nModeOn" ? logoDay : logoNight);
    }, [isMode]);

    useEffect(() => {
        var splitUrl = window.location.pathname.split("/").join("");
        if (splitUrl === "dashboard") {
            setIsDashboard(true);
            dispatch(getHeaderData());
        } else setIsDashboard(false);
    }, [dispatch]);

    const makeActive = () => {
        let status = inputMenu === "sidebar" ? "test" : "sidebar";
        setMenu(status);
        dispatch({ type: actionTypes.SET_OPEN_MOBILE_REQUEST, payload: status });
    };
    // const changeTheme = () => {
    //     let status = isMode === "nModeOff" ? "nModeOn" : "nModeOff";
    //     localStorage.setItem("nMode", status);
    //     dispatch({ type: actionTypes.SET_COLOR_THEME_REQUEST, payload: status });
    // };
    // const refreshDashboard = () => {
    //     dispatch(getDashboard())
    // }

    // const toggle_full_screen = () => {
    //     if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)){
    //         if (document.documentElement.requestFullScreen){
    //             document.documentElement.requestFullScreen();
    //         }else if (document.documentElement.mozRequestFullScreen){ /* Firefox */
    //             document.documentElement.mozRequestFullScreen();
    //         }else if (document.documentElement.webkitRequestFullScreen){   /* Chrome, Safari & Opera */
    //             document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    //         }else if (document.msRequestFullscreen){ /* IE/Edge */
    //             document.documentElement.msRequestFullscreen();
    //         }
    //     }else {
    //         if (document.cancelFullScreen){
    //             document.cancelFullScreen();
    //         }else if (document.mozCancelFullScreen){ /* Firefox */
    //             document.mozCancelFullScreen();
    //         }else if (document.webkitCancelFullScreen){   /* Chrome, Safari and Opera */
    //             document.webkitCancelFullScreen();
    //         }else if (document.msExitFullscreen){ /* IE/Edge */
    //             document.msExitFullscreen();
    //         }
    //     }
    // }
    const handleClick = () => {
        props.handleClick1();
        document.documentElement.requestFullscreen();
    };
    const handleClickSatellite = () => {
        props.handleClickMapSatellite();
        setChecked(false)
    };
    const handleClickDefault = () => {
        props.handleClickMapDefault();
        setChecked(true)
    };
    const handleClickTerrain = () => {
        props.handleClickMapTerrain();
        setChecked(false)
    };
    return (
 
            <header id="page-topbar">
                { user.user.userType === "system-technician"  ?
                <div className="top_header">
                    <div className="container">
                        <div className="row">
                            <p>System Technicians troubleshooting mode. CAUTION: some changes made in this mode cannot be undone</p>
                        </div>
                    </div>
                </div>
                : user.user.userType === "system-super-admin" ?  
                <div className="top_header s-admin">
                    <div className="container">
                        <div className="row">
                            <p>System Technicians troubleshooting mode. CAUTION: some changes made in this mode cannot be undone</p>
                        </div>
                    </div>
                </div> : 
                ''}
                <div
                    className={`navbar-header mt-2 pb-1 ${isMinimize === "minimize" ? "minimize-main" : ""
                        }`}
                >
                    <div className="d-flex">
                        <div className="navbar-brand-box">
                            <div to="" className="logo logo-dark">
                                <span className="logo-sm">
                                    <Link to="/">
                                        <img src={logo} alt="logo-sm" height="28" />
                                    </Link>
                                </span>
                                <span className="logo-lg">
                                    <Link to="/">
                                        <img src={chart} alt="logo-dark" height="30" />
                                    </Link>
                                </span>
                            </div>
    
                            <Link to="" className="logo logo-light">
                                <span className="logo-sm">
                                    <img src={logo} alt="logo-sm-light" height="40" />
                                </span>
                                <span className="logo-lg">
                                    <img src={logoDay} alt="logo-light" height="30" />
                                </span>
                            </Link>
                        </div>
                        {/* {`vertical-menu ${isOpen}`} */}
                        <button
                            type="button"
                            className="btn btn-sm px-2 font-size-24 header-item waves-effect d-sm-none d-block"
                            id="vertical-menu-btn1"
                            onClick={() => makeActive()}
                        >
                            <i className="ti ti-menu-2 align-middle"></i>
                        </button>
                        <div className="d-none d-lg-block app-search d-no ne d-lg-block pt-4">
                            <h4>
                                <strong>{props?.pageHead}</strong>
                            </h4>
                        </div>
                    </div>
                    {isDashboard ? (
                        <div className="d-flex badges">
                            <ul className="badges-new">
                                <li>
                                    <div className="form-group">
                                        <button type="button" className="btn btn d-block  mx-2">
                                            <i className="ti ti-refresh font-size-20"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                            <ul className="badges-new">
                                <li>
                                    <span className="border-right">
                                        <i className="ti ti-truck  font-size-20"></i>
                                        <span className="badge_count">
                                            {vehicleStatus.totalVehicles}
                                        </span>
                                    </span>
                                </li>
                                <li>
                                    <img src={moveArrow} alt="logo-sm" height="18"  />
                                    {/* <i className="ti ti-send font-size-18 text-success"></i>{" "} */}
                                    {vehicleStatus.IN_MOTION}
                                    <i className="ri-checkbox-blank-circle-fill font-size-18 text-success"></i>{" "}
                                    {vehicleStatus.STATIONARY}
                                    <i className="ri-checkbox-blank-circle-fill font-size-18"></i>{" "}
                                    {vehicleStatus.INACTIVE}
                                </li>
                            </ul>
                            <ul className="badges-new">
                                <li>
                                    <span className="border-right">
                                        <i className="ti ti-steering-wheel font-size-20  align-middle me-1"></i>
                                        <span className="badge_count">
                                            {dashboardStatus.totalDrivers}
                                        </span>
                                    </span>
                                </li>
                                <li>
                                    <span className="badge custom-badges bg-success">D</span>{" "}
                                    {dashboardStatus.DS_D}
                                    <span className="badge custom-badges bg-warning">SB</span>{" "}
                                    {dashboardStatus.DS_SB}
                                    <span className="badge custom-badges bg-primary">ON</span>{" "}
                                    {dashboardStatus.DS_ON}
                                    <span className="badge custom-badges bg-gray">OFF</span>{" "}
                                    {dashboardStatus.DS_OFF}
                                    <span className="badge custom-badges bg-violet">PC</span>{" "}
                                    {dashboardStatus.DR_IND_PC}
                                    <span className="badge custom-badges bg-orange">YM</span>{" "}
                                    {dashboardStatus.DR_IND_YM}
                                </li>
                            </ul>
                            <ul className="badges-new">
                                <li>
                                    <div className="form-group">
                                        <div className="dropdown">
                                            <button
                                                type="button"
                                                className="btn btn d-block dropdown-toggle mx-2"
                                                id="dropdownMenuButton"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="ti ti-info-circle font-size-20"></i>
                                            </button>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuButton"
                                            >
                                                <a className="dropdown-item" href="/">
                                                    <img src={moveArrow} alt="logo-sm" height="18" />{" "}
                                                    <span style={{ marginLeft: "6px" }}>
                                                        Moving Vehicles{" "}
                                                    </span>
                                                </a>
                                                <a className="dropdown-item" href="/">
                                                    <img src={greenCircle} alt="logo-sm" height="17" />
                                                    <span style={{ marginLeft: "9px" }}>
                                                        Online and Stationary Vehicles
                                                    </span>{" "}
                                                </a>
                                                <a className="dropdown-item" href="/">
                                                    <img src={stopPoint} alt="logo-sm" height="18" />
                                                    <span style={{ marginLeft: "10px" }}>
                                                        Offline Vehicles
                                                    </span>
                                                </a>
                                                <a className="dropdown-item" href="/">
                                                    <i className="ri-checkbox-blank-circle-fill font-size-18 vehicles_clustered_icon"></i>
                                                    <span style={{ marginLeft: "10px" }}>
                                                        Vehicles Clustered
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <ul className="badges-new">
                                <li>
                                    <div className="form-group">
                                        <div className="dropdown">
                                            <button
                                                type="button"
                                                className="btn btn d-block dropdown-toggle  mx-2"
                                                id="dropdownMenuButton"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="ti ti-adjustments-horizontal font-size-20"></i>
                                            </button>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuButton"
                                            >
                                                <label style={{ marginLeft: "17px" }}>MAP VIEW</label>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        onClick={() => handleClickDefault()}
                                                        className="form-check-input"
                                                        type="radio" checked={checked}
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault1"
                                                    >
                                                        Default
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        onClick={() => handleClickTerrain()}
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Terrain
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.9em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                        onClick={() => handleClickSatellite()}
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault1"
                                                    >
                                                        Satellite
                                                    </div>
                                                </div>
                                                <label style={{ marginLeft: "17px" }}>OVERLAY</label>
                                                {/* <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Traffic
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.9em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault1"
                                                    >
                                                        Fleet Clustering
                                                    </div>
                                                </div> */}
                                                <label style={{ marginLeft: "17px" }}>STATIONS</label>
                                                {/* <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Weigh Stations
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        CAT Scales
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Pilot Flying J
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        TA Petro
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Love's
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            {/* <ul className="badges-new">
                                <li>
                                    <div className="form-group">
                                        <div className="dropdown">
                                            <button
                                                type="button"
                                                className="btn btn d-block dropdown-toggle mx-2"
                                                id="dropdownMenuButton"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                <i className="ti ti-cloud-rain"></i>
                                            </button>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuButton"
                                            >
                                                <label style={{ marginLeft: "17px" }}>WEATHER</label>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault1"
                                                    >
                                                        None
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Radar
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault1"
                                                    >
                                                        Wind
                                                    </div>
                                                </div>
    
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Rain
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault1"
                                                    >
                                                        Snow
                                                    </div>
                                                </div>
    
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Snow Depth
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Humidity
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Temperature
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Temps: Freeze
                                                    </div>
                                                </div>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.9em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Storm Reports
                                                    </div>
                                                </div>
                                                <label style={{ marginLeft: "17px" }}>CONTROLS</label>
                                                <div
                                                    className="form-check"
                                                    style={{ paddingLeft: "2.5em", marginBottom: "0.9em" }}
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault2"
                                                    />
                                                    <div
                                                        className="form-check-label"
                                                        htmlFor="flexRadioDefault2"
                                                    >
                                                        Timeline
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul> */}
                            <ul className="badges-new">
                                <li>
                                    <div className="form-group">
                                        <button
                                            type="button"
                                            onClick={() => handleClick()}
                                            className="btn btn  d-block  mx-2"
                                        >
                                            <i className="ti ti-maximize font-size-20"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ) : null}
    
                    <div className="d-flex">
                        <div className="dropdown d-inline-block d-lg-none ms-2">
                            <button
                                type="button"
                                className="btn header-item noti-icon "
                                id="page-header-search-dropdown"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className="ti ti-search"></i>
                            </button>
                            <div
                                className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                aria-labelledby="page-header-search-dropdown"
                            >
                                <form className="p-3">
                                    <div className="mb-3 m-0">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search ..."
                                            />
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="submit">
                                                    <i className="ti ti-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
    
                        <div className="dropdown d-inline-block">
                            {/* <button
                                type="button"
                                className="btn header-item noti-icon"
                                id="page-header-notifications-dropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="ri-notification-3-line"></i>
                                <span className="noti-dot"></span>
                            </button> */}
                            <div
                                className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                                aria-labelledby="page-header-notifications-dropdown"
                            >
                                <div className="p-3">
                                    <div className="row align-items-center border-bottom-new-color">
                                        <div className="col">
                                            <h6 className="m-0"> Notifications </h6>
                                        </div>
                                        <div className="col-auto">
                                            <Link to="#!" className="small">
                                                {" "}
                                                Mark all as read <i className="ri-mail-settings-line"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div data-simplebar style={{ maxHeight: "230px" }}>
                                    <Link to="" className="text-reset notification-item">
                                        <div className="d-flex">
                                            <div className="avatar-xs">
                                                <span className="rounded-circle font-size-20 text-orangs">
                                                    <i className="ti ti-tool"></i>
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h6 className="mb-0 m-0 font-size-13 text-muted">
                                                    Vechile 7000 has active fault code
                                                </h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="m-0">
                                                        {" "}
                                                        <small>2minutes ago</small>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="iconic">
                                                <i className="ti ti-circle-check text-primary  font-size-7"></i>
                                            </div>
                                        </div>
                                    </Link>
    
                                    <Link to="" className="text-reset notification-item">
                                        <div className="d-flex">
                                            <div className="avatar-xs">
                                                <span className="rounded-circle font-size-20 text-orangs">
                                                    <i className="ti ti-gauge"></i>
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h6 className="mb-0 m-0 font-size-13 text-muted">
                                                    Vechile 7000 has active fault code
                                                </h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="m-0">
                                                        {" "}
                                                        <small>2minutes ago</small>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="iconic">
                                                <i className="ri-checkbox-blank-circle-fill text-primary  font-size-7"></i>
                                            </div>
                                        </div>
                                    </Link>
    
                                    <Link to="" className="text-reset notification-item">
                                        <div className="d-flex">
                                            <div className="avatar-xs">
                                                <span className="rounded-circle font-size-20 text-orangs">
                                                    <i className="mdi mdi-text-box-outline"></i>
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h6 className="mb-0 m-0 font-size-13 text-muted">
                                                    Vechile 7000 has active fault code
                                                </h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="m-0">
                                                        {" "}
                                                        <small>2minutes ago</small>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="iconic">
                                                <i className="ri-checkbox-blank-circle-fill text-primary  font-size-7"></i>
                                            </div>
                                        </div>
                                    </Link>
    
                                    <Link to="" className="text-reset notification-item">
                                        <div className="d-flex">
                                            <div className="avatar-xs">
                                                <span className="rounded-circle font-size-20 text-orangs">
                                                    <i className="ti ti-clock"></i>
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h6 className="mb-0 m-0 font-size-13 text-orangs">
                                                    Corey Godman 30 Minutes Break Required code
                                                </h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="m-0">
                                                        {" "}
                                                        <small>2minutes ago</small>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="iconic">
                                                <i className="ri-checkbox-blank-circle-fill text-primary  font-size-7"></i>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to="" className="text-reset notification-item">
                                        <div className="d-flex">
                                            <div className="avatar-xs">
                                                <span className="rounded-circle font-size-20">
                                                    <i className="ti ti-clock"></i>
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h6 className="mb-0 m-0 font-size-13 ">
                                                    Corey Godman 30 Minutes Break Required code
                                                </h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="m-0">
                                                        {" "}
                                                        <small>2minutes ago</small>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="iconic">
                                                <i className="ri-checkbox-blank-circle-fill text-primary  font-size-7"></i>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to="" className="text-reset notification-item">
                                        <div className="d-flex">
                                            <div className="avatar-xs">
                                                <span className="rounded-circle font-size-20">
                                                    <i className="ti ti-clock"></i>
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h6 className="mb-0 m-0 font-size-13 ">
                                                    Corey Godman 30 Minutes Break Required code
                                                </h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="m-0">
                                                        {" "}
                                                        <small>2minutes ago</small>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="iconic">
                                                <i className="ri-checkbox-blank-circle-fill text-primary  font-size-7"></i>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
    
                        <div className="d-inline-block">
                            <button
                                type="button"
                                className="btn header-item noti-icon"
                                aria-expanded="false"
                            >
                                <Link to={"/resources"}>
                                    <i className="ri-book-2-line"></i>
                                    {/* <span className="noti-dot"></span> */}
                                </Link>
                            </button>
                            {/* <div className="d-inline-block">
                                <button
                                    type="button"
                                    onClick={changeTheme}
                                    className="btn header-item noti-icon "
                                    aria-expanded="false"
                                >
                                    <i className="ti ti-moon"></i>
                                    <span className="noti-dot"></span>
                                </button>
                            </div> */}
    
                            <div className="dropdown d-inline-block user-dropdown">
                                <button
                                    type="button"
                                    className="btn header-item  font-size-13"
                                    id="page-header-user-dropdown"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <span className="rounded-circle header-profile-user p-2 text-capitalize">
                                        {user?.user?.firstName?.charAt(0) +
                                            "" +
                                            user?.user?.lastName?.charAt(0)}
                                    </span>
    
                                    <span className="d-none d-xl-inline-block text-capitalize ms-1  font-size-14  user-name vertical-middle">
                                        {user?.user?.firstName} {user?.user?.lastName}
                                        <br></br>
                                        <small>{user?.user?.email}</small>{" "}
                                    </span>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link className="dropdown-item" to="/profile">
                                        <i className="ti ti-user align-middle me-1"></i> Profile
                                    </Link>
                                    {/* <Link className="dropdown-item" to="#"><i className=" ri-notification-3-line align-middle me-1"></i> Alerts </Link> */}
                                    {/* <Link className="dropdown-item" to="#"><i className="ri-star-s-line align-middle me-1"></i> What's New </Link> */}
                                    <div className="dropdown-divider m-0"></div>
                                    {/* {allow_billing ? (
                                        userType === "system-technician" ? null : ( */}
                                            <Link className="dropdown-item" to="/billing">
                                                <i className="ri-bank-card-line align-middle me-1"></i>{" "}
                                                Billing{" "}
                                            </Link>
                                        {/* ) */}
                                    {/* ) : null} */}
                                    {/* <Link className="dropdown-item " to="#"><i className="ri-shopping-cart-2-line align-middle me-1"></i> Web Store </Link> */}
                                    <div className="dropdown-divider m-0"></div>
                                    {/* <Link className="dropdown-item" to="#"><i className="mdi mdi-api  align-middle me-1"></i> API </Link> */}
    
                                    {allow_correction ? (
                                        <Link className="dropdown-item" to="/companies">
                                            <i className="ti ti-building  align-middle me-1"></i>{" "}
                                            Companies{" "}
                                        </Link>
                                    ) : null}
    
                                    <button
                                        type="button"
                                        className="dropdown-item "
                                        to="#"
                                        onClick={handleLogout}
                                    >
                                        <i className="ti ti-logout"></i> Log out
                                    </button>
                                    {/* <div className="dropdown-divider m-0"></div> */}
                                    {/* <ul className="d-inline-flex bootom-links p-r-5 p-0 mb-0"> */}
                                    {/* <li><Link className="dropdown-item font-size-9 inline-flex  " to="#"><small>Term Of services</small></Link></li> */}
                                    {/* <li><Link className="dropdown-item  font-size-9 inline-flex " to="#"> <small>Privacy</small></Link></li> */}
                                    {/* </ul> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
    
       
    );
};

export default Header;
