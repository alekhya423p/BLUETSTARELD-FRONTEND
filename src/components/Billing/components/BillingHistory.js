import React, {forwardRef} from "react";
import moment from "moment";
import { MDBDataTableV5 } from "mdbreact";

const BillingHistory = forwardRef((props, ref) => {
    let data = props.data;
    // console.log(data,7)
    let finalData = [];
    if(data){
        for(var index=0; index < data.length; index++){
            let rowItem = {};
            rowItem["invoice"] = <span>{data[index]?.number}</span>;
            rowItem["billing_date"] =data[index]?.created ? moment(data[index]?.created*1000).format("MMM DD, YYYY") : "";
            rowItem["amount"] =<span>{`${data ?(data[index]?.currency ? data[index]?.currency?.toUpperCase() : "" ) : ""} ${data? (data[index]?.amount_paid ?data[index]?.amount_paid/100: 0 ) : ""}` }</span>;
            rowItem["plan"] = data[index]?.product_name;
            rowItem["status"] = data[index]?.status==="paid" ? <div className="status_payment"><i class="ti ti-check"></i>{data[index]?.status==='active'? "" : data[index]?.status.charAt(0).toUpperCase() + data[index]?.status.slice(1)}</div>:<div className="failed_payment"><i class="ti ti-x"></i>{data[index]?.status==='active'? "" : data[index]?.status.charAt(0).toUpperCase() + data[index]?.status.slice(1)}</div>;
            rowItem["invoice_url"] = <div className="billing_actions"><a href={data[index]?.invoice_pdf}><i class="ti ti-file-download"></i></a> <a href={data[index]?.invoice_stripe_view} target="_blank" rel="noreferrer"><i class="ti ti-file-invoice"></i></a></div>;
            finalData.push(rowItem);
        }
    }

    const datatable = {
        columns: [
        {
            label: 'INVOICE',
            field: 'invoice',
            sort: 'asc',
            width: 150,
            className:"invoice"
        },
        {
            label: 'BILLING DATE',
            field: 'billing_date',
            sort: 'asc',
            width: 150
        },
        {
            label: 'AMOUNT',
            field: 'amount',
            sort: 'asc',
            width: 270
        },
        {
            label: 'PLAN',
            field: 'plan',
            sort: 'asc',
            width: 270
        },
        {
            label: 'STATUS',
            field: 'status',
            sort: 'asc',
            width: 270
        },
        {
            label: 'ACTION',
            field: 'invoice_url',
            sort: 'asc',
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
                className="history-table"
                entriesOptions={[5, 10, 20,50,100]}
                entries={5}
                pagesAmount={5}
                data={datatable}
                striped
                bordered
                small
                // searchTop
                sortable={false}
                searchBottom={false}

            />
        </>
    );
});
export default BillingHistory;