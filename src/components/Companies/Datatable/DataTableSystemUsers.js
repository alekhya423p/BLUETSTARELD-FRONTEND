import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { MDBDataTableV5 } from "mdbreact";

const DataTableSystemUsers = forwardRef((props, ref) => {
  let data = props.data;
  let finalData = [];

  if (data) {
    for (var index = 0; index < data.length; index++) {
      let rowItem = {};
      rowItem["id"] = data[index]._id;
      rowItem["name"] =  data[index].firstName + ' ' + data[index].lastName;
      rowItem["email"] = data[index].email;
      rowItem["nickname"] = data[index].nickName;
      rowItem["role"] = data[index].role;
      rowItem["companies"] = data[index].accessAllCompanies === false ? data[index].companiesObject && data[index].companiesObject.length > 0 ? data[index].companiesObject.join(", ") : false :  'All Companies'
      rowItem["status"] = data[index].isActive === true ? 'Active' : 'Inactive'; 
      rowItem["actions"] = <><Link className="companies-btn" to={`update-user/${data[index]._id}`}><i className="ti ti-edit" aria-hidden="true"></i></Link>
      <button className="btn btn-lg p-0 companies-btn" onClick={() => props.onActive(rowItem)}><i className="ti ti-square-x"></i></button></>;
     
      finalData.push(rowItem);
    }
  }

  // const [datatable, setDatatable] = React.useState({
  const datatable = {
    columns: [
      {
        label: 'NAME',
        field: 'name',
        sort: 'disabled',
        width: 150
      },
      {
        label: 'EMAIL',
        field: 'email',
        sort: 'disabled',
        width: 150
      },
      {
        label: 'NICKNAME',
        field: 'nickname',
        sort: 'disabled',
        width: 270
      },
      {
        label: 'ROLE',
        field: 'role',
        sort: 'disabled',
        width: 270
      },
      {
        label: 'COMPANIES',
        field: 'companies',
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
        label: 'ACTIONS',
        field: 'actions',
        sort: 'disabled',
        width: 270
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

export default DataTableSystemUsers;