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
            rowItem["billing_date"] = moment(data[index].created*1000).format("MMM DD, YYYY");
            rowItem["amount"] = <span>{`${data[index]?.currency?.toUpperCase()} ${data[index].amount_paid / 100}` }</span>;
            rowItem["plan"] = data[index].product_name;
            rowItem["status"] = data[index]?.status?.toUpperCase();
            rowItem["invoice_url"] = <a href={data[index].invoice_pdf}>Download</a>;
            finalData.push(rowItem);
        }
    }

    const datatable = {
        columns: [
        {
            label: 'INVOICE',
            field: 'invoice',
            sort: 'asc',
            width: 150
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
            label: '',
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