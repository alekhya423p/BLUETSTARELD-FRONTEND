import React, { forwardRef, useState, useImperativeHandle } from "react";
import { deselectAllCheckboxes, handleCheckChange } from "../../utility/helper";
import Pagination from 'react-js-pagination';
import db from "../../../src/data/db.json";

const DataTableVehicleLogs = forwardRef((props, ref) => {
  let data = props.data;
  let finalCheck = {}, count = 0;
  const [inputCheckedCount, setinputCheckedCount] = useState(0);
  const [inputCheckedIds, setinputCheckedIds] = useState([]);

  useImperativeHandle(ref, () => ({
    deSelectAll() {
      count = deselectAllCheckboxes(document);
      setinputCheckedCount(count);
      // props.countRows(count);
    }

  }));

  if(data){
    for(let i = 0; i < data.length; i++){
      for(let j=0; j< db.timeZone.length; j++){
        if(data[i].timeZone === db.timeZone[j].value){
          data[i]['tz'] = db.timeZone[j].title;
        }
      }
    }
  }

  const handleChange = (e) => {
    finalCheck = handleCheckChange(e, document, inputCheckedCount, inputCheckedIds);
    setinputCheckedCount(finalCheck.count);
    setinputCheckedIds(finalCheck.checkData);
    props.change(finalCheck.checkData);
    // console.log(finalCheck.checkData, 'checkedids')
  };

  return (
    <>
    <div className="table-responsives mb-0">
      <table align="left" className="table table-background dt-responsive table-check-box">
        <thead>
            <tr>
                <th valign="middle" width="20%">TIME</th>
                <th width="20%">EVENT</th>
                <th valign="middle" width="20%">LOCATION</th>
                <th width="20%" valign="middle" align="center">ODOMETER</th>
                <th width="10%">ENGINE HOURS</th>
                <th width="10%"><div className="custom-checkbox custom-control"><span>ACTION</span>  <input type="checkbox" data-checkboxes="selectAllCheckbox" className="custom-control-input selectAllCheckbox" id="selectAllCheckbox" name="selectAllCheckbox" onChange={(e) => handleChange(e)} /><label htmlFor="selectAllCheckbox" className="custom-control-label" ></label></div></th>
            </tr>
        </thead>
        <tbody>
        { data.length > 0 ? data.map((item, index) => (
          <tr key={index}>      
            <td>{item.eventTime} {item.tz} </td>
            <td>{item.eventCode ? item.eventCode : 'NA'}</td>
            <td>{item.location }</td>
            <td>{item.odometer ? item.odometer : 'NA'} mi</td>
            <td>{item.engineHours } </td>
            <td>
              <div className="custom-checkbox custom-control inner-check">
                <button onClick={() => props.openModal(item.id)} className="btn custom-btn-outline-info"><i className="ti ti-user-plus"></i></button>
                <button className="btn custom-btn-outline-info text-danger"><i className="ti ti-trash" aria-hidden="true"></i></button>
                <input type="checkbox" className="custom-control-input table_checkbox" id={index} key={index} name={item.id} onChange={(e) => handleChange(e)} value={item.id} /><label htmlFor={index} className="custom-control-label"></label>
              </div>
            </td>
          </tr>
        )) :
        <tr><td colSpan={6} className="align-center">No matching records Found</td></tr>
        }           
        </tbody>
      </table>
    </div>
    {props.totalRecord > props.itemsPerPage && (
    <div className="pagination-bx">
      <Pagination
        activePage={props.currentPage}
        itemsCountPerPage={props.itemsPerPage}
        totalItemsCount={props.totalRecord}
        nextPageText="Next"
        prevPageText="Prev"
        firstPageText="First"
        lastPageText="Last"
        onChange={props.setCurrentPage}
        itemClass="page-item"
        linkClass="page-link"
      />
    </div>
    )}
  </>
  );
});

export default DataTableVehicleLogs;