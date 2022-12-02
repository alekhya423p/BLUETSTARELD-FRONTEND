import React, { forwardRef } from "react";
import { activeCompany } from "../../../actions/authAction";
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { MDBDataTableV5 } from "mdbreact";

const DataTableCompanies = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let data = props.data;

  const onChangeCompany = (id) => {    
    dispatch(activeCompany(id, navigate));
  } 

  let finalData = [];

  if (data) {
    for (var index = 0; index < data.length; index++) {
      let rowItem = {};
      rowItem["id"] = data[index]._id;
      rowItem["name"] =  data[index].companyName;
      rowItem["address"] = data[index].address;
      rowItem["dot_number"] = data[index].dotNumber;
      rowItem["status"] = data[index].isActive === true ? 'Active' : 'Inactive';
      rowItem["comp_id"] = 'Company:' + data[index]._id
      rowItem["vehicle_count"] = data[index].vehicleCount;
      rowItem["actions"] = <><button className="btn custom-btn-outline-info companies-btn" onClick={() => onChangeCompany(rowItem["id"])}><i className="ri-arrow-right-up-line"></i></button>
      {props.allow_correction ? <button className="btn custom-btn-outline-info companies-btn cross-btnn" onClick={() => props.handlDeactiveCompany(rowItem["id"])}><i className="ri-close-line"></i></button> : null}</>;
     
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
        label: 'TOTAL VEHICLES',
        field: 'vehicle_count',
        width: 150,
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

  return (
    <>
    <MDBDataTableV5
      hover
      id="mdbDtTable"
      className="boot_table_custom"
      entries={10}
      data={datatable}
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