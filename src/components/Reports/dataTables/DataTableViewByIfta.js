import React, { forwardRef } from "react";
import Pagination from 'react-js-pagination';

const DataTableViewByIfta = forwardRef((props, ref) => {
  
    let data = props.data;
   

    if(data){
        for(let i=0; i < data.length; i++){
           
            for(let j=0; j < props.states.length; j++){
                if(data[i].state === props.states[j].state){
                    data[i]['stateKey'] = props.states[j].stateKey 
                }
            }
        }
    }

  
    
    return (
        <> 
        <div className="table-responsives mb-0">
            <table align="left" className="table table-background dt-responsive left-style-table">
                <thead>
                    <tr>
                        <th>STATE<i className="ti ti-arrow-narrow-down font-size-14"></i></th>
                        <th>DISTANCE</th>          
                    </tr>
                </thead>      
                <tbody>
                    { data.length > 0 ? data.map((item, index) => (
                        <tr key={index}>            
                            <td>{ item.state + '(' + item.stateKey + ')' } </td>
                            <td>{item.distance} mi</td>
                        </tr>
                    )) : <tr>
                            <td colSpan={2} className="text-center">No matching records found</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
            {props.totalRecords > props.itemsPerPage && (
            <div className="pagination-bx">
                <Pagination
                    activePage={props.currentPage}
                    itemsCountPerPage={props.itemsPerPage}
                    totalItemsCount={props.totalRecords}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="First"
                    lastPageText="Last"
                    onChange={props.setCurrentPageNo}
                    itemClass="page-item"
                    linkClass="page-link"
                />
            </div>
        )}
        </>
    );
});

export default DataTableViewByIfta;