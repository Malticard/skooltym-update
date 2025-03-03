import React from 'react';
import DataTable from 'react-data-table-component';
import { Badge, Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import { StaffLatePaginatedResponse, StaffLateResult } from '@/interfaces/StaffLateInterface';
import LiveImageComponent from '../../components/LiveImageComponent';
import moment from 'moment';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), {
    ssr: false
});
interface LateRecordsIR {
    pendingData: StaffLatePaginatedResponse;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}
const LateRecordsDataTable: React.FC<LateRecordsIR> = ({ pendingData, updatePage, updateLimit }) => {
    // Initialize states with safe default values
    // const [data, setData] = React.useState<StaffLateResult[]>(pendingData?.results ?? []);

    function formatTime(time: string) {
        if (!time) return 'N/A';
        try {
            return moment(time).format('ll - hh:mm A').toUpperCase();
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Invalid Time';
        }
    }
    const columns = [
        {
            name: "Staff Picture".toLocaleUpperCase(),
            cell: (row: StaffLateResult) => (
                <LiveImageComponent url={row.staff.staff_profilePic} />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Staff Name".toLocaleUpperCase(),
            selector: (row: StaffLateResult) => `${row.staff.staff_fname} ${row.staff.staff_lname}`,
            sortable: true
        },
        {
            name: "Time".toLocaleUpperCase(),
            selector: (row: StaffLateResult) => formatTime(row.time_in),
            sortable: true
        },
        {
            name: "Late Charge".toLocaleUpperCase(),
            selector: (row: StaffLateResult) => `UGX ${row.late_charge.toLocaleString()}`,
            sortable: true,
            right: true
        },
        {
            name: "Status".toLocaleUpperCase(),
            cell: (row: StaffLateResult) => row.status === 1 ? <Badge bg='success'>PAID</Badge> : <Badge bg='danger' >UNPAID</Badge>,
            sortable: true,
        },
        // {
        //     name: "Actions".toLocaleUpperCase(),
        //     cell: (row: StaffLateResult) => (
        //         <div className="flex items-center space-x-2">
        //             <Button variant="outline-primary" size="sm">
        //                 <IconEdit className="w-5 h-5" />
        //             </Button>
        //             <Button variant="outline-danger" size="sm">
        //                 <IconTrash className="w-5 h-5" />
        //             </Button>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     // allowOverflow: true,
        // }
    ];
    const data = pendingData?.results;
    const tableData = {
        columns,
        data,
    };

    return (
        <DataTableExtensions {...tableData}>
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationServer
                paginationTotalRows={pendingData?.total ?? 0}
                paginationDefaultPage={pendingData?.limit}
                paginationPerPage={pendingData?.pages ?? 1}
                onChangePage={(page, total) => updatePage(page)}
                onChangeRowsPerPage={(currentRowsPerPage, cp) => updateLimit(currentRowsPerPage)}
                responsive
                striped
                persistTableHead
            />
        </DataTableExtensions>
    );
}

export default LateRecordsDataTable;
