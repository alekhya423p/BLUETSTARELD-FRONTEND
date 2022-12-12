import React, { useState, useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormModal from "./FormModal";
import DataTableCompanies from "../Datatable/DataTableCompanies";
import Loading from "../../layout/Loading";
import { loadCompanies } from "../../../actions/companyAction";
import DeactivateModal from "./DeactivateModal";

const Company = (props) => {

  const dispatch = useDispatch();
  const [searchStatus, setsearchStatus] = useState("active");
  const [searchKey, setSearchKey] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [showDeactivateModal, setDeactivateModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {companies, loading, totalRecord, } = useSelector(state => state.companyDetail)
  const itemsPerPage = 20;
  const childRef = useRef();

  useEffect(() => {
    dispatch(loadCompanies(searchKey, searchStatus, searchCompany))
  },[dispatch, searchKey, searchStatus, searchCompany])

  const callSearch = (e) => {
    setSearchKey(e.target.value);
  };
  const searchByCompany = (e) => {
    setSearchCompany(e.target.value);
  };
  const handleCreateCompany = () => {
    setShowCreateCompanyModal(true);
  };
  const handleCreateCompanyClose = () => {
    setShowCreateCompanyModal(false);
    setSelectedRowData(false);
  };
  const handlDeactiveCompany = (id) => {
    setSelectedRowData(id)
    setDeactivateModal(true);
  };
  const handleDeactivateModalClose = () => {
    setDeactivateModal(false);
    setSelectedRowData(false);
  };
  // console.log(searchStatus,"4888")
  return (
    <>
      <div className="row mb-40">
        <h1 className="title-name-companies">Companies</h1>
        <div className="col-sm 12 col-md-8 flex-grow-1">
          {/* <form className="search-data_n"> */}
          <div className="row">
            <div className="col col-md-5 col-sm-12 tob-section-option">
              <div className="form-group app-search p-0 ">
                <label>&nbsp;</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control font-size-11"
                    onBlur={callSearch}
                    defaultValue={searchKey}
                    placeholder="Search by Company Name or Dot Number"
                  />
                  <span className="ti ti-search"></span>
                </div>
              </div>
            </div>
            <div className="col col-md-3 col-sm-12 tob-section-option">
              <div className="form-group">
                <label className="form-label">Filter by Status</label>
                <select
                  className="form-select"
                  value={searchStatus}
                  onChange={(e) => setsearchStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="col col-md-4 col-sm-12 tob-section-option">
              <div className="form-group app-search p-0 ">
                <label>&nbsp;</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control font-size-11"
                    onBlur={searchByCompany}
                    defaultValue={searchCompany}
                    placeholder="Search by Company ID"
                  />
                  <span className="ti ti-search"></span>
                </div>
              </div>
            </div>
          </div>
          {/* </form> */}
        </div>
        <div className="col-sm 12 col-md-4 refresh-btn-div company_btn">
          <div className="d-inline-block">
            <div className="form-group">
              <label className="form-label">&nbsp;</label>
              <button
                type="button"
                className="btn d-block add-button"
                onClick={() => handleCreateCompany()}
              >
                <i className="ti ti-plus font-size-17 vertical-align-top"></i>{" "}
                Create Company
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">&nbsp;</label>
              <button
                type="button"
                onClick={props.handleLogout}
                className="line-logout-btn"
              >
                <i className="ti ti-logout"></i>Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* end page title */}

      <div className="row">
        <div className="col-12 text-center">
          <div className="mb-0">

          { loading ?
            <Loading /> :
            <DataTableCompanies allow_correction={props.allow_correction} handlDeactiveCompany={handlDeactiveCompany} totalRecord={totalRecord} currentPage={currentPage} searchStatus={searchStatus} setCurrentPage={setCurrentPage} data={companies} ref={childRef} itemsPerPage={itemsPerPage} mode='edit'/>
          }
          </div>
        </div>
        {/* end col */}
      </div>
      {/* <!-- end row --> */}
      {/* <!--Add Report Modal --> */}
      <FormModal
        open={showCreateCompanyModal}
        close={handleCreateCompanyClose}
        data={selectedRowData}
        searchKey={searchKey}
        searchStatus={searchStatus}
        searchCompany={searchCompany}
      />
      <DeactivateModal
        open={showDeactivateModal}
        close={handleDeactivateModalClose}
        data={selectedRowData}
      />
    </>
  );
};

export default Company;
