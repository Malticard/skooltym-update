import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import { deleteStreamData } from '@/utils/data_fetch';
import { OvertimeModel, Overtimes } from '@/interfaces/OvertimeModel';
import { StaffOvertimePaginatedResponse, StaffOvertimeResult } from '@/interfaces/StaffOvertimeModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), {
    ssr: false
});
interface OvertimeIR {
    pendingData: StaffOvertimePaginatedResponse | undefined;
    updatePage: (value: number) => void;
}
const StaffOvertimeDataTable: React.FC<OvertimeIR> = ({ pendingData, updatePage }) => {
    // Initialize states with safe default values
    const [data, setData] = React.useState<StaffOvertimeResult[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);

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
                <img
                    className="rounded-full w-12 h-12 object-cover"
                    src={row.staff.staff_profilePic}
                    alt={`${row.staff.staff_fname}'s picture`}
                    width={48}
                    height={48}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
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
            name: "Overtime Currency".toLocaleUpperCase(),
            selector: (row: StaffOvertimeResult) => `${row.overtime_currency}`,
            sortable: true
        },
        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: StaffOvertimeResult) => `UGX ${row.overtime_charge.toLocaleString()}`,
            sortable: true,
            right: true
        },
        {
            name: "Status",
            selector: (row: StaffOvertimeResult) => `${row.status === 0 ? 'Pending' : 'Cleared'}`,
            sortable: true
        }
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
        <DataTableExtensions {...tableData}>
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationServer
                paginationTotalRows={totalDocuments}
                paginationDefaultPage={currentPage}
                paginationPerPage={pageSize}
                onChangePage={handlePageChange}
                responsive
                striped
            />
        </DataTableExtensions>
    );
}

export default StaffOvertimeDataTable;