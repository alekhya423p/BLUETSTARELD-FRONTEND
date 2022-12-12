import { useEffect, useState, useRef } from 'react';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import DataTableIFTAReport from './dataTables/DataTableIFTAReport';
import { useDispatch, useSelector } from 'react-redux';
import Loading from "../layout/Loading";
import { getiftaReports } from  '../../actions/reportsAction';
import CreateReportModal from './CreateReportModal';
import { getVehicleMaster } from '../../actions/vehicleAction';

const IftaReport = () => {
    const dispatch = useDispatch();
    const { reports, count, loading, totalRecord } = useSelector(state => state.reports)
    const { masterVehicles } = useSelector(state => state.vehicles)
    const { user } = useSelector(state => state.auth)
    var userType = user && user.user && user.user.userType;
    const [currentPage, setCurrentPage] = useState(1)
   
    useEffect(() => {
        dispatch (getiftaReports(currentPage))
    }, [dispatch, currentPage])
    
    useEffect(() => {
        dispatch(getVehicleMaster())
    }, [dispatch])

    const [showAddAdminModal, setAddAdminModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(false);

    
    const { isMinimize, isMode } = useSelector(state => state.dashboard)
    const itemsPerPage = 20
    const childRef = useRef();
    const pageHead = `IFTA Reports(${count ? count : ''})`

    const handleNewReport = () => {
        setAddAdminModal(true);
    };

    const handleAddAdminClose = () => {
        setAddAdminModal(false);
        setSelectedRowData(false);
    };

    return (
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
                                            <div className="col-9 flex-grow-1">
                                                <button type="button" className='btn d-block add-button float-right' onClick={() => handleNewReport()}><i className="ti ti-clipboard-list"></i>&nbsp;New Report</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}

                            <div className="row">
                                <div className="col-12 text-center">                                 
                                    {loading ?                                        
                                        <Loading /> : <DataTableIFTAReport count={count} data={reports} currentPage={currentPage} setCurrentPage={setCurrentPage} ref={childRef} totalRecords={totalRecord} itemsPerPage={itemsPerPage} mode='edit' />
                                    }
                                   
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

              {/* <!--Add Report Modal --> */}
              <CreateReportModal
                open={showAddAdminModal}
                close={handleAddAdminClose}
                data={selectedRowData}
                vehicles={masterVehicles}
            />
        </>
    )
}

export default IftaReport;
