import { React, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import { getResources } from "../../actions/resourceActions";

const Resources = () => {
  const pageHead = "Resources";
  let dispatch = useDispatch();
  const { isMinimize } = useSelector((state) => state.dashboard);
  const { user } = useSelector(state => state.auth)
  var userType = user && user.user && user.user.userType;
  const { allResources } = useSelector((state) => state.resources);

  useEffect(() => {
    dispatch(getResources());
  }, [dispatch]);

  return (
    <>
      <Header pageHead={pageHead} />
      <Sidebar />
      <div
        className={`main-content ${
          isMinimize === "minimize" ? "minimize-main" : ""
        }`}
      >
        <div className={userType === "company-administrator" ? "page-content billing-page-sec company-admin" : "page-content billing-page-sec"}>
          <div className="container">
            <div className="row">
              <div className="col-md-12 billing-box resources-pge">
                <div className="row">
                  <div className="col-12 text-center">
                    <div className="mb-0">
                      <div className="mb-0 table-responsives billing-table">
                        <table
                          align="left"
                          className="table table-responsives table-background"
                        >
                          <thead>
                            <tr>
                              <th valign="middle" width="70%">DESCRIPTION</th>
                              <th valign="middle" width="30%">FILE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allResources.length > 0 ? (
                              allResources.map((resource, index) => (
                                <tr key={index}>
                                  <td>
                                    <p><strong>{resource.resource_title}</strong></p>
                                    <p>{resource.resource_description}</p>
                                  </td>
                                  <td className="align-left">
                                    <a href={resource.resource_filepath} download>Download{" "}<i className="ti ti-book-download"></i></a>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={12} className="align-center">
                                  No resources added yet
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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
  );
};

export default Resources;
