import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { StaffOvertimePaginatedResponse, StaffOvertimeResult } from '@/interfaces/StaffOvertimeModel';
import { Badge, Button } from 'react-bootstrap';
import { IconEye, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import LiveImageComponent from '../../components/LiveImageComponent';
import StaffModel from './StaffModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), {
    ssr: false
});
interface OvertimeIR {
    pendingData: StaffOvertimePaginatedResponse | undefined;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}
const StaffOvertimeDataTable: React.FC<OvertimeIR> = ({ pendingData, updatePage, updateLimit }) => {
    // Initialize states with safe default values
    const [data, setData] = React.useState<StaffOvertimeResult[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);
    // show hide modal
    const [show, setShow] = React.useState(false);
    const [selected, setSelected] = React.useState<StaffOvertimeResult | null>(null);
    // Update state when pendingData changes
    React.useEffect(() => {
        if (pendingData) {
            setData(pendingData.results || []);
            setCurrentPage(pendingData.page || 1);
            setPageSize(pendingData.limit || 10);
            setTotalDocuments(pendingData.total || 0);
        }
    }, [pendingData]);

    const columns = [
        {
            name: "Staff Profile".toLocaleUpperCase(),
            cell: (row: StaffOvertimeResult) => (
                <LiveImageComponent url={row.staff.staff_profilePic} />
            ),
            ignoreRowClick: true,
            // allowOverflow: true,
        },
        {
            name: "Staff Name".toLocaleUpperCase(),
            selector: (row: StaffOvertimeResult) => `${row.staff.staff_fname} ${row.staff.staff_lname}`,
            sortable: true
        },
        {
            name: "Actual Time".toLocaleUpperCase(),
            selector: (row: StaffOvertimeResult) => `${row.actual_time}`,
            sortable: true
        },
        {
            name: "Overtime Rate".toLocaleUpperCase(),
            selector: (row: StaffOvertimeResult) => `UGX ${row.overtime_rate.toLocaleString()}`,
            sortable: true,
            right: true
        },

        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: StaffOvertimeResult) => `UGX ${row.overtime_charge.toLocaleString()}`,
            sortable: true,
            right: true
        },
        {
            name: "Status",
            cell: (row: StaffOvertimeResult) => row.status === 0 ? <Badge pill bg='secondary'>Pending</Badge> : <Badge pill bg='success'>Cleared</Badge>,
            sortable: true
        },
        // {
        //     name: "Actions".toLocaleUpperCase(),
        //     cell: (row: StaffOvertimeResult) => (
        //         <div className="flex items-center justify-center">
        //             <Button variant="outline-primary" size="sm"
        //                 className="p-2 rounded-md"
        //                 onClick={() => { setShow(true); setSelected(row); }}>

        //                 <IconEye className="w-5 h-5" />
        //             </Button>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     // allowOverflow: true,
        // }
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };

    const tableData = {
        columns,
        data,
    };

    return (
        <>
            <DataTableExtensions {...tableData}>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={pendingData?.total ?? 0}
                    paginationDefaultPage={pendingData?.page ?? 1}
                    paginationPerPage={pendingData?.limit ?? 0}
                    onChangePage={(page, tt) => handlePageChange(page)}
                    onChangeRowsPerPage={(currentRowsPerPage, tt) => updateLimit(currentRowsPerPage)}
                    responsive
                    striped
                />
            </DataTableExtensions>
            <StaffModel close={setShow} staff={selected} show={show} size={'lg'} />
        </>
    );
}

export default StaffOvertimeDataTable;