import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import ProfileUpdate from "./ProfileUpdate";
import { useDispatch, useSelector } from "react-redux";
import Header from '../layout/Header'
import Sidebar from '../layout/Sidebar'
import Loading from "../layout/Loading";
import { loadUserProfile } from "../../actions/authAction";
import { LOAD_PROFILE_RESET } from "../../constants/actionTypes";
import ProfileUpdate from "./ProfileUpdate";
// import AdditionalSetting from "./AdditionalSetting";
import ChangePassword from './ChangePassword'
const Profile = () => {

    const dispatch = useDispatch();
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const { usertype } = useSelector(state => state.auth)
    var userType = usertype && usertype.user && usertype.user.userType;
    const { loading, user } = useSelector(state => state.updateProfile)
    useEffect(() => {
        dispatch({ type: LOAD_PROFILE_RESET })
        dispatch(loadUserProfile())
    }, [dispatch])

    const pageHead = 'Edit Your Profile';

    return (
        <>
            <div id="layout-wrapper" className={isMode}>
                <Header pageHead={pageHead} />
                <Sidebar />
                <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
                    <div className={userType === "company-administrator" ? "page-content company-admin" : "page-content"} style={{ background: '#eff3f6' }}>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-7 mt-3 mx-auto">
                                    <div className="page-title-box">
                                        <div className="row">
                                            <div className="col-7">
                                                <div className="row">
                                                    <h3 className="text-capitalize"><strong>Personal Info</strong></h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider" style={{ borderTopColor: '#e3e6eb' }}></div>
                                        <div className="row mt-4">
                                            <div className="col-md-12">
                                                {loading ? <div className="col-md-12 text-center"> <Loading /> </div> : 
                                                <ProfileUpdate user={user} />
                                                }
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            {loading ?  null : 
                                                <ChangePassword user={user} />
                                            }
                                        </div>
                                        {/* <div className="row mt-4">
                                            {loading ?  null : 
                                                <AdditionalSetting user={user} />
                                            }
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Profile;