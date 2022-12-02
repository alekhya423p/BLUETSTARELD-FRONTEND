import { useState, useEffect } from "react"
import { useDispatch,useSelector} from "react-redux"
import { Link, useLocation //  useNavigate 
} from "react-router-dom"
import * as actionTypes from '../../constants/actionTypes'


const Sidebar = (props) => {
    const [isOpen, setIsOpen] = useState('')
    const [isMinimize, setIsMinimize] = useState('')
    const [inputMenu, setMenu] = useState(false);
    const [input, setInput] = useState(false);
    
    const [number , setNumber] = useState(1);
    const { isOpenMobileMenu } = useSelector(state => state.dashboard)
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation();
    let minimize = localStorage.getItem('minimize');


    useEffect(() => {
        let menu = (localStorage.getItem("activeMenu")) ? localStorage.getItem("activeMenu") === location.pathname.slice(1) ? localStorage.getItem("activeMenu") : location.pathname.slice(1) : "dashboard" ;
        setMenu(menu);
    }, [location]);

    useEffect(() => {
        let menu = (localStorage.getItem("activeMenu")) ? localStorage.getItem("activeMenu") === location.pathname.slice(1) ? localStorage.getItem("activeMenu") : "dashboard" : "dashboard";
        setInput(menu);
    }, [location]);

    useEffect(() => {
        setIsOpen(minimize)
    }, [minimize])

    // const handleLogout = () => {
    //     localStorage.clear();
    //     navigate('/login')
    // };

useEffect(() => {
   
    // Update the document title using the browser API
    if(number >1){
   
    // if(localStorage.getItem('minimize')=== 'minimize' && localStorage.getItem('minimize1')=== 'not_minimize'){
   
    // }

      if(props?.handleClose === true){
        hendelMinimize()
        
    }else {
        hendelMinimize()
    }
}
   setNumber(2)
   // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[props?.handleClose]);

    const hendelMinimize = () => {
        let status =  isMinimize === "minimize" ? 'not_minimize' : 'minimize';
        localStorage.setItem('minimize', status)
        setIsMinimize(status)
        setIsOpen(status)
        dispatch({ type: actionTypes.SET_MINIMIZE_REQUEST, payload: status })
    }
    
    const makeActive = (menuItem, e) => {
        localStorage.setItem("activeMenu", menuItem);
        setMenu(menuItem);
    }

    const addMenus = (item, e) => {
        localStorage.setItem("activeMenu", item);
        setInput(item);
    }

    return (
        // <div className={`vertical-menu ${isOpen ? 'expand' :'collapse'}`}>
        <div className={(isOpenMobileMenu === "sidebar") ? `vertical-menu showSidebar ${isOpen}` : `vertical-menu  ${isOpen}`}>
            <div data-simplebar className="h-100">
                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li className={(inputMenu === "dashboard") ? "active" : ""}>
                            <Link to="/dashboard" className="waves-effect" onClick={(e)=>makeActive("dashboard", e)}>
                                <i className="ti ti-home-2"></i><span className="badge rounded-pill bg-grey float-end"></span>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        <li className={(inputMenu === "driver-hos") ? "active" : ""} onClick={(e)=>makeActive("driver-hos", e)}>
                            <Link to="/driver-hos" className="waves-effect">
                                <i className="ti ti-clock"></i>
                                <span>Driver HOS</span>
                            </Link>
                        </li>

                        <li className={(inputMenu === "logs") ? "active" : ""} onClick={(e)=>makeActive("logs", e)}>
                            <Link to="/logs" className="waves-effect">
                                <i className="ti ti-wave-square"></i>
                                <span>Logs</span>
                            </Link>

                        </li>

                        <li className={(inputMenu === "assets") ? "active" : ""} onClick={(e)=>makeActive("assets", e)}>
                            <Link to="/assets" className="waves-effect">
                                <i className="ti ti-truck"></i>
                                <span>Assets</span>
                            </Link>
                        </li>

                        {/* <li>
                            <Link to="" className=" waves-effect">
                                <i className="mdi mdi-wrench"></i>
                                <span>DVIR</span>
                            </Link>
                        </li> */}

                        <li className={(inputMenu === "eld-events") ? "active" : ""} onClick={(e)=>makeActive("eld-events", e)}>
                            <Link to="/eld-events" className=" waves-effect">
                                <i className="ti ti-stack-2"></i>
                                <span>ELD Events</span>
                            </Link>

                        </li>
                        <li className={(inputMenu === "reports" || inputMenu ===  "fmcsa-records") ? "active" : ""}>
                            <a href="#report" data-toggle="collapse" className="has-arrow waves-effect" onClick={(e) => addMenus("submenu_setting", e)}>
                                <i className="ti ti-clipboard-list"></i>
                                <span>Reports</span>
                            </a>
                            <ul className={(input === "submenu_report" ? "sub-menu collapse submenu_report" : "sub-menu collapse ")} id="report">
                                <li className={(inputMenu === "reports") ? "active" : ""} onClick={(e)=>makeActive("reports", e)}><Link to="/reports/ifta">IFTA</Link></li>
                                <li className={(inputMenu === "fmcsa-records") ? "active" : ""} onClick={(e)=>makeActive("fmcsa-records", e)}><Link to="/fmcsa-records">FMCSA Records</Link></li>
                            </ul>
                        </li>
                        {/* <li>
                            <Link to="/chat" className="waves-effect">
                                <i className="ri-chat-3-line"></i>
                                <span className="badge rounded-pill bg-light float-end">3</span>
                                <span>Chat</span>
                            </Link>
                        </li> */}

                        <li className={(inputMenu === "drivers" || inputMenu === 'vehicles' || inputMenu === 'company'  || inputMenu === 'elds' || inputMenu === "alerts"  || inputMenu === 'portal-users') ? "active" : ""} >
                            <a href="#demo" data-toggle="collapse" className="has-arrow waves-effect" onClick={(e) => addMenus("submenu_report", e)}>
                                <i className="ti ti-settings"></i>
                                <span>Setting</span>
                            </a>
                            <ul className={(input === "submenu_setting" ? "sub-menu collapse submenu_setting" : "sub-menu collapse ")} id="demo">
                                <li className={(inputMenu === "drivers") ? "active" : ""} onClick={(e)=>makeActive("drivers", e)}><Link to="/settings/drivers">Driver </Link></li>
                                <li className={(inputMenu === "vehicles") ? "active" : ""} onClick={(e)=>makeActive("vehicles", e)}><Link to="/settings/vehicles">Vehicles</Link></li>
                                <li className={(inputMenu === "elds") ? "active" : ""} onClick={(e)=>makeActive("elds", e)}><Link to="/settings/elds">ELD Devices</Link></li>
                                {/* <li className={(inputMenu === "alerts") ? "active" : ""} onClick={(e) => makeActive("alerts", e)}><Link to="/settings/alerts">Alerts</Link></li> */}
                                <li className={(inputMenu === "portal-users") ? "active" : ""} onClick={(e)=>makeActive("portal-users", e)}><Link to="/settings/portal-users">Portal Users</Link></li>
                                <li className={(inputMenu === "company") ? "active" : ""} onClick={(e)=>makeActive("company", e)}><Link to="/settings/company">Company</Link></li>
                            </ul>
                        </li>
                        <li>

                        </li>
                    </ul>

                    <div className="minimize-side-btn">
                        <button id="vertical-menu-btn" onClick={() => hendelMinimize()} className="mt-3 text-muted metismenu  d-sm-block align-content-center d-none">
                            <i className="ti ti-logout font-size-20 open-mnu"></i> <i className="ti ti-login font-size-20 close-mnu"></i> <span>Close</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Sidebar