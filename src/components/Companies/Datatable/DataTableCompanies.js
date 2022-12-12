import React, { forwardRef, useState } from "react";
import { activeCompany } from "../../../actions/authAction";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { MDBDataTableV5 } from "mdbreact";
import Loading from "../../layout/Loading";

const DataTableCompanies = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const { loading } = useSelector(state => state.auth)
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const allow_system_user = userInfo && userInfo.user && userInfo.user.userType ? (userInfo.user.userType === 'system-super-admin' || 'system-administrator') : false;
  
  let data = props.data;
// console.log(props)
// console.log(userInfo.user.userType ,'17')
  const onChangeCompany = (id) => {    
    setLoader(true);
    dispatch(activeCompany(id, navigate));
  } 

  let finalData = [];

  if (data) {
    for (var index = 0; index < data.length; index++) {
      let rowItem = {};
      rowItem["id"] = data[index]?._id;
      rowItem["name"] =  data[index]?.companyName;
      rowItem["address"] = data[index]?.address;
      rowItem["dot_number"] = data[index]?.dotNumber;
      rowItem["status"] = data[index]?.isActive === true ? 'Active' : 'Inactive';
      rowItem["comp_id"] = 'Company:' + data[index]?._id
      rowItem["vehicle_count"] = data[index]?.vehicleCount;
      rowItem["sub.vehicles"] = allow_system_user ? (data[index]?.subscribedVehicleCount ?data[index]?.subscribedVehicleCount:0 ):'';
      rowItem["subscription"] = allow_system_user ? (data[index]?.invoiceStatus==="paid" ? <div className="status_payment"><i class="ti ti-check"></i>{data[index]?.invoiceStatus.charAt(0).toUpperCase() + data[index]?.invoiceStatus.slice(1)}</div>:<div className="failed_payment"><i class="ti ti-x"></i>{data[index]?.invoiceStatus ? data[index]?.invoiceStatus.charAt(0).toUpperCase() + data[index]?.invoiceStatus.slice(1) : "Not Subscribed" }</div>) :'';
      rowItem["actions"] = <> <button className="btn custom-btn-outline-info companies-btn" onClick={() => onChangeCompany(rowItem["id"])}>{ (!index && loading && loader) ? <Loading /> : <i className="ri-arrow-right-up-line"></i> }</button>
      { props.allow_correction ? <button className="btn custom-btn-outline-info companies-btn cross-btnn" onClick={() => props.handlDeactiveCompany(rowItem["id"])}><i className="ri-close-line"></i></button> : null }</>;
     
      finalData.push(rowItem);
    }
  }
  const datatable = {
    columns: [
      {
        label: 'NAME',
        field: 'name',
        sort: 'disabled',
        width: 150
      },
      {
        label: 'ADDRESS',
        field: 'address',
        sort: 'disabled',
        width: 150
      },
      {
        label: 'DOT NUMBER',
        field: 'dot_number',
        sort: 'disabled',
        width: 270
      },
      {
        label: 'STATUS',
        field: 'status',
        sort: 'disabled',
        width: 270
      },
      {
        label: 'ID',
        field: 'comp_id',
        width: 270,
        sort: 'disabled'

      },
      {
        label: props?.searchStatus==='inactive'?'INACTIVE VEHICLES':'ACTIVE VEHICLES',
        field: 'vehicle_count',
        width: 150,
        sort: 'disabled'
      },
      {
        label: allow_system_user ? 'SUB. VEHICLES':'',
        field: 'sub.vehicles',
        width: 270,
        sort: 'disabled'
      },
      {
        label: allow_system_user ? 'SUBSCRIPTION' :'',
        field: 'subscription',
        width: 270,
        sort: 'disabled'
      },
      {
        label: 'ACTIONS',
        field: 'actions',
        width: 150,
        sort: 'disabled'
      }
    ],
    rows: finalData
  };
  const datatable1 = {
    columns: [
      {
        label: 'NAME',
        field: 'name',
        sort: 'disabled',
        width: 150
      },
      {
        label: 'ADDRESS',
        field: 'address',
        sort: 'disabled',
        width: 150
      },
      {
        label: 'DOT NUMBER',
        field: 'dot_number',
        sort: 'disabled',
        width: 270
      },
      {
        label: 'STATUS',
        field: 'status',
        sort: 'disabled',
        width: 270
      },
      {
        label: 'ID',
        field: 'comp_id',
        width: 270,
        sort: 'disabled'

      },
      {
        label: props?.searchStatus==='inactive'?'INACTIVE VEHICLES':'ACTIVE VEHICLES',
        field: 'vehicle_count',
        width: 150,
        sort: 'disabled'
      },
      // {
      //   label: allow_system_user ? 'SUB. VEHICLES':'',
      //   field: 'sub.vehicles',
      //   width: 270,
      //   sort: 'disabled'
      // },
      // {
      //   label: allow_system_user ? 'SUBSCRIPTION' :'',
      //   field: 'subscription',
      //   width: 270,
      //   sort: 'disabled'
      // },
      {
        label: 'ACTIONS',
        field: 'actions',
        width: 150,
        sort: 'disabled'
      }
    ],
    rows: finalData
  };
  return (
    <>
    <MDBDataTableV5
      hover
      id="mdbDtTable"
      className="boot_table_custom company_table"
      entries={10}
      data={userInfo.user.userType ==='system-super-admin' || userInfo.user.userType ==='system-administrator'? datatable :datatable1}
      striped
      bordered
      small
      // searchTop
      sortable={true}
      searchBottom={false}
    />
    </>
  );
});

export default DataTableCompanies;