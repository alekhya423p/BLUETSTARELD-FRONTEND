import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../layout/Loading";
import { Link } from "react-router-dom";
import { getSystemUsers } from "../../../actions/systemUserActions";
import DataTableSystemUsers from "../Datatable/DataTableSystemUsers";
import DeactivateModal from "./DeactivateModal";

const SystemUsers = (props) => {
  const dispatch = useDispatch();
  const [searchStatus, setsearchStatus] = useState("true");
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeactivateModal, setDeactivateModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(false);

  const {users, loading, count, totalRecord, } = useSelector(state => state.systemUsers)
  const itemsPerPage = 20;
  const childRef = useRef();




  useEffect(() => {
    dispatch(getSystemUsers(currentPage, searchKey, searchStatus));
  }, [dispatch, currentPage, searchKey, searchStatus]);

  const callSearch = (e) => {
    setSearchKey(e.target.value);
  };
  const handlDeactiveCompany = (item) => {
    setSelectedRowData(item.id)
    setDeactivateModal(true);
  };
  const handleDeactivateModalClose = () => {
    setDeactivateModal(false);
    setSelectedRowData(false);
  };


  return (
    <>
      <div className="row mb-40">
        <h1 className="title-name-companies">System Users Management</h1>
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
                    placeholder="Search by Name or Email or Nickname"
                  />
                  <span className="ti ti-search"></span>
                </div>
              </div>
            </div>
            <div className="col col-md-4 col-sm-12 tob-section-option">
              <div className="form-group">
                <label className="form-label">Filter by Status</label>
                <select
                  className="form-select"
                  value={searchStatus}
                  onChange={(e) => setsearchStatus(e.target.value)}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          {/* </form> */}
        </div>
        <div className="col-sm 12 col-md-3 refresh-btn-div company_btn">
          <div className="d-inline-block">
            <div className="form-group">
              <label className="form-label">&nbsp;</label>
              <Link to="/add-user" className="btn d-block add-button">
                <i className="dripicons-plus font-size-20 vertical-align-top"></i>{" "}
                Add User
              </Link>
            </div>
            <div className="form-group">
              <label>&nbsp;</label>
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
          <div className="mb-0 companies-table">
            <div className="mb-0">

            {
              loading ? <Loading /> : <DataTableSystemUsers count={count} onActive={handlDeactiveCompany} totalRecord={totalRecord} currentPage={currentPage} setCurrentPage={setCurrentPage} data={users} ref={childRef} itemsPerPage={itemsPerPage} mode='edit'/>
            }

            </div>
          </div>
        </div>
        {/* end col */}
      </div>
      <DeactivateModal
        open={showDeactivateModal}
        close={handleDeactivateModalClose}
        data={selectedRowData}
      />
      {/* <!-- end row --> */}
    </>
  );
};

export default SystemUsers;
