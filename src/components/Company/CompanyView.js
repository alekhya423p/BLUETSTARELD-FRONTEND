import React, { useEffect } from "react"
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loadCompanyDetail } from "../../actions/companyAction"
const CompanyView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.companyDetail);
  const { isMinimize, isMode } = useSelector(state => state.dashboard)

  const pageHead = 'Company Details'

  useEffect(() => {
    dispatch(loadCompanyDetail());
  }, [user, dispatch])

  return (
    <>
      <div id="layout-wrapper" className={isMode}>
        <Header pageHead={pageHead}/>
        <Sidebar/>
        <div className={`main-content ${isMinimize === 'minimize' ? 'minimize-main' : ''}`}>
          <div className="page-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-10 mt-3 mx-auto">
                  <div className="page-title-box">
                    <div className="row flex-row">
                      <div className="float-start col-sm-3">
                        <h3 className="text-capitalize"><strong>{company.companyName}</strong></h3>
                      </div>		
                      <div className="col-9 pe-4 edit-btn-company">
                        <div className="row float-end">
                          <div className="col-sm-12" style={{padding: '0 5px'}}>
                            <Link to={`/settings/company/update/${company._id}`} className="btn d-block add-button-edit "><i className="ti ti-edit"></i> Edit</Link>
                          </div>
                        </div>
                      </div>										
                    </div>									

                    <div className="row mt-5">
                      <div className="col-4 company_heads">
                          <address>
                              <h4 className="text-capitalize">General Informations</h4>
                          </address>
                      </div>
                                                
                      <div className="col-3 ps-1 pe-1 company_sub_content">
                          <address>
                              Company ID:
                              <br/>Company Name:<br/>
                              DOT Number:<br/>
                              Company Time Zone:<br/>
                              Company Address:
                          </address>
                      </div>
                              
                      <div className="col-5 company_sub_content">
                              <address>
                                  <strong>{company?.displayId ? company.displayId : 'NA'}<br/>
                                  {company?.companyName}<br/>
                                  {company?.dotNumber}<br/>
                                  {company?.timeZoneId}<br/>
                                  {company?.address}</strong>
                              </address>
                          </div>
                    </div>
                    <hr/>
                
                    <div className="row mt-5">
                        <div className="col-4 company_heads">
                            <address>
                                <h4 className="text-capitalize">Carrier Settings</h4>
                            </address>
                        </div>
                        <div className="col-3 ps-1 pe-1 company_sub_content">
                            <address>
                                Compliance Mode: 
                                <br/>Vehicle Motion Threshold :<br/>
                                Cycle Rule:<br/>
                                Cargo Type:<br/>
                                Restart:<br/>
                                Rest Break:<br/>
                                Short-Haul Exception:<br/>
                                Split-Sleeper Berth<br/>
                                Personal Conveyance:<br/>
                                Yard Move:<br/>
                                Manual Move:
                                
                            </address>
                        </div>
              
                        <div className="col-5 company_sub_content">
                            <address>
                              <strong>{company?.complianceMode ? company?.complianceMode : 'NA'}<br/>
                             
                              {company?.vehicleMotionThreshold ? company?.vehicleMotionThreshold : 'NA'}<br/>
                              {company?.cycle ? company?.cycle : 'NA'}<br/>
                              {company?.cargoType ? company?.cargoType : 'NA'}<br/>
                              {company?.restartHours ? company?.restartHours : 'NA'}<br/>
                              {company.restBreak ? company.restBreak : 'NA'}<br/>
                              {company?.shortHaulAllowed ? 'ON' : 'OFF'}<br/>
                              {company?.splitSBAllowed ? 'ON' : 'OFF'}<br/>
                              {company?.pcAllowed ? 'ON' : 'OFF'}<br/>
                              {company?.ymAllowed ? 'ON' : 'OFF'}<br/>
                              {company?.manualDriveAllowed ? 'ON' : 'OFF'}
                              <br/>
                              </strong><br/>
                            </address>
                        </div>
                    </div>                
                    <hr/>
                    { company.terminals && company.terminals.map((item, index) => ( 

                    <div key={index} className="row mt-5">
                      <div className="col-4 company_heads">
                          <address>
                            <h4 className="text-capitalize">Terminal {index+1}</h4>
                          </address>
                      </div>

                      <div className="col-3 ps-1 pe-1 company_sub_content">
                        <address>
                        Terminal  Address:
                        <br/>Time Zone:<br/>
                        </address>
                      </div>
                      <div className="col-5 company_sub_content">
                        <address>
                          <strong>{item.address}<br/>
                          {item.timeZone}<br/>
                          </strong>
                        </address>
                      </div>
                    </div>
                     ))}
                    <hr/>
                    
                    <hr/>
                    <div className="row mt-5">
                      <div className="col-4 company_heads">
                          <address>
                            <h4 className="text-capitalize">Intergrations</h4>
                          </address>
                      </div>
                      <div className="col-4 ps-1 pe-1 company_sub_content">
                        <div className="card">
                          <div className="card-body">
                            <form className="search-data add-driver">
                              <img src="/assets/images/projec-44.jpg" alt="project-44"	className="img-fluid" />	
                              <div className="row">
                                <div className="col-md-12 ">
                                  <div className="mt-2 ms-2">
                                    <div>
                                      <div className="form-check form-check-right">
                                        <label className="form-check-label" htmlFor="formCheckRight1">
                                            Integrations:&nbsp; { company?.project44 ? 'ON' : 'OFF'}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>                     
                      </div>
                      <div className="col-4 company_sub_content">
                        <div className="card">
                          <div className="card-body"> 
                            <form className="search-data add-driver">
                              <img src="/assets/images/decrete.jpg" alt="img-discrete"	className="img-fluid" />		
                          
                              <div className="row">
                                <div className="col-md-12 ">
                                  <div className="mt-2 ms-2">
                                    <div>
                                      <div className="form-check form-check-right">
                                          
                                          <label className="form-check-label" >
                                              Integrations:&nbsp; { company?.macropoint ? 'ON' : 'OFF'}
                                          </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
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
      </div>
    </>
  )
}

export default CompanyView