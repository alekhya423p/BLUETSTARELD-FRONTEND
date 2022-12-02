import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import Loading from "../layout/Loading";
import DataTableFMCSA from "../Datatable/DataTableFMCSA";

const FMCSALogs = (props) => {
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    // dispatch(loadCompanyUsers());
  }, [dispatch]);

  const callSearch = (e) => {
    setSearchKey(e.target.value);
  };

  return (
    <>
      <div className="row mb-40">
        <h1 className="title-name-companies">FMCSA Transfer Logs</h1>
        <div className="col-sm 12 col-md-8 flex-grow-1">
          {/* <form className="search-data_n"> */}
          <div className="row">
            <div className="col col-md-4 col-sm-12 tob-section-option">
              <div className="form-group app-search p-0 ">
                <label>&nbsp;</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control font-size-11"
                    onBlur={callSearch}
                    defaultValue={searchKey}
                    placeholder="Search by Company Name"
                  />
                  <span className="ti ti-search"></span>
                </div>
              </div>
            </div>
            <div className="col col-md-4 col-sm-12 tob-section-option">
              <div className="form-group app-search p-0 ">
                <label>&nbsp;</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control font-size-11"
                    onBlur={callSearch}
                    defaultValue={searchKey}
                    placeholder="Search by Driver Name"
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
            <div className="table-responsives mb-0">
              <DataTableFMCSA />
            </div>
          </div>
        </div>
        {/* end col */}
      </div>
      {/* <!-- end row --> */}
    </>
  );
};

export default FMCSALogs;
