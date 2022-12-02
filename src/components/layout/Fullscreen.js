import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { getHeaderData } from "../../actions/dashboardAction";
import logoDay from '../../assets/Lucid ELD Logo-white.svg';
import logoNight from '../../assets/Lucid-ELD-Logo.svg';
import greenCircle from '../../assets/green-circle.svg';
import moveArrow from '../../assets/move-arrow.svg';
import stopPoint from '../../assets/stop-point.svg';
import { event } from "jquery";


const Fullscreen = (props) => {
    const dispatch = useDispatch();
    const { isMinimize } = useSelector(state => state.dashboard)
    const { isMode } = useSelector(state => state.dashboard)
    const [changeClass, setChangeClass] = useState(false);
    const [checked , setChecked] = useState(true)
    const [isDashboard, setIsDashboard] = useState(false);
    const [chart, setChart] = useState(isMode === 'nModeOn' ? logoDay : logoNight);
    const { dashboardStatus, vehicleStatus } = useSelector(state => state.dashboard)
    console.log(chart)
    useEffect(() => {
        setChart(isMode === 'nModeOn' ? logoDay : logoNight);
    }, [isMode]);
    useEffect(() => {
        var splitUrl = window.location.pathname.split('/').join('');
        if (splitUrl === 'dashboard') {
            setIsDashboard(true)
            dispatch(getHeaderData())
        } else setIsDashboard(false);
    }, [dispatch]);

    const handleClick = (event) => {
        props.handleClick2()
        setChangeClass(true)
        document.exitFullscreen()

    }
    const handleClickSatellite =() =>{
        props.handleClickMapSatellite()
        setChecked(false)
     }
     const handleClickDefault =() =>{
        props.handleClickMapDefault()
        setChecked(true)
     }
     const handleClickTerrain = () =>{
        props.handleClickMapTerrain()
        setChecked(false)
     }
    
    const escFunction = useCallback((event ,args) => {
        if (event.key === "Escape") {
            props.handleClick2()
            setChangeClass(true)
            document.exitFullscreen()          
        }
        
  // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction);
        return () => {
            document.removeEventListener("keydown", escFunction);
        };
        
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
   
    console.log(event, "event");

    return (
        <header id="page-topbar">
            <div className={`navbar-header mt-2 pb-1 ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>

                {isDashboard ?
                    <div className={changeClass ? "" : "d-flex badges maximize_map_div"}>
                        {/* <ul className="badges-new">
                            <li>
                                <div className="form-group">
                                    <button type="button" className="btn btn d-block  mx-2"><i className="ti ti-refresh font-size-20"></i></button>
                                </div>
                            </li>
                        </ul> */}
                        <ul className="badges-new">
                            <li><span className="border-right"><i className="ti ti-truck  font-size-20"></i><span className="badge_count">{vehicleStatus.totalVehicles}</span></span></li>
                            <li>
                                <i className="ti ti-send font-size-18 text-success"></i> {vehicleStatus.IN_MOTION}
                                <i className="ri-checkbox-blank-circle-fill font-size-18 text-success"></i> {vehicleStatus.STATIONARY}
                                <i className="ri-checkbox-blank-circle-fill font-size-18"></i> {vehicleStatus.INACTIVE}
                            </li>
                        </ul>
                        <ul className="badges-new">
                            <li><span className="border-right"><i className="ti ti-steering-wheel font-size-20  align-middle me-1"></i><span className="badge_count">{dashboardStatus.totalDrivers}</span></span></li>
                            <li>
                                <span className="badge custom-badges bg-success">D</span> {dashboardStatus.DS_D}
                                <span className="badge custom-badges bg-warning">SB</span> {dashboardStatus.DS_SB}
                                <span className="badge custom-badges bg-primary">ON</span> {dashboardStatus.DS_ON}
                                <span className="badge custom-badges bg-gray">OFF</span> {dashboardStatus.DS_OFF}
                                <span className="badge custom-badges bg-violet">PC</span> {dashboardStatus.DR_IND_PC}
                                <span className="badge custom-badges bg-orange">YM</span> {dashboardStatus.DR_IND_YM}
                            </li>
                        </ul>


                    </div> : null}

                <div className="side_maximize_icon">
                    <ul className="badges-new">
                            <li>
                                <div className="form-group">
                                    <button type="button" className="btn btn d-block  mx-2"><i className="ti ti-refresh font-size-20"></i></button>
                                </div>
                            </li>
                        </ul>
                    <ul className="badges-new">
                        <li>
                            <div className="form-group">
                                <div className="dropdown">
                                    <button type="button" className="btn btn d-block dropdown-toggle mx-2" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti ti-info-circle font-size-20"></i></button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <p className="dropdown-item" style={{ marginBottom: "0px" }}><img src={moveArrow} alt="logo-sm" height="18" /> <span style={{ marginLeft: "6px" }}>Moving Vehicles </span></p>
                                        <p className="dropdown-item" style={{ marginBottom: "0px" }}><img src={greenCircle} alt="logo-sm" height="17" /><span style={{ marginLeft: "9px" }}>Online and Stationary Vehicles</span> </p>
                                        <p className="dropdown-item" style={{ marginBottom: "0px" }} ><img src={stopPoint} alt="logo-sm" height="18" /><span style={{ marginLeft: "10px" }}>Offline Vehicles</span></p>
                                        <p className="dropdown-item" style={{ marginBottom: "0px" }}><i className="ri-checkbox-blank-circle-fill font-size-18 vehicles_clustered_icon"></i><span style={{ marginLeft: "10px" }}>Vehicles Clustered</span></p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <ul className="badges-new">
                        <li>
                            <div className="form-group">
                                <div className="dropdown">
                                    <button type="button" className="btn btn d-block dropdown-toggle  mx-2" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti ti-adjustments-horizontal font-size-20"></i></button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <label style={{ marginLeft: "17px" }}>
                                            MAP VIEW
                                        </label>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>

                                            <input onClick={()=> handleClickDefault()} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"  checked={checked} />
                                            <div  className="form-check-label" htmlFor="flexRadioDefault1">
                                                Default
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input onClick={()=> handleClickTerrain()} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Terrain
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.9em" }}>

                                            <input onClick={()=> handleClickSatellite()} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault1">
                                                Satellite
                                            </div>
                                        </div>
                                        <label style={{ marginLeft: "17px" }} >
                                            OVERLAY
                                        </label>
                                        {/* <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Traffic
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.9em" }}>

                                            <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault1">
                                                Fleet Clustering
                                            </div>
                                        </div> */}
                                        <label style={{ marginLeft: "17px" }}>
                                            STATIONS
                                        </label>
                                        {/* <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Weigh Stations
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                CAT Scales
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Pilot Flying J
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                TA Petro
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
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
                                    <button type="button" className="btn btn d-block dropdown-toggle  mx-2" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti ti-cloud-rain"></i></button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <label style={{ marginLeft: "17px" }}>
                                            WEATHER
                                        </label>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>

                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault1">
                                                None
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Radar
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>

                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault1">
                                                Wind
                                            </div>
                                        </div>

                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Rain
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>

                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault1">
                                                Snow
                                            </div>
                                        </div>

                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Snow Depth
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Humidity
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Temperature
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.6em" }}>
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Temps: Freeze
                                            </div>
                                        </div>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.9em" }}>
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
                                                Storm Reports
                                            </div>
                                        </div>
                                        <label style={{ marginLeft: "17px" }}>
                                            CONTROLS
                                        </label>
                                        <div className="form-check" style={{ paddingLeft: "2.5em", marginBottom: "0.9em" }}>
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                            <div className="form-check-label" htmlFor="flexRadioDefault2">
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
                                <button type="button" onClick={(event) => handleClick(event)} className="btn btn d-block  mx-2"><i class="ti ti-minimize"></i>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Fullscreen