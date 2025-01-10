import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import { StaffLatePaginatedResponse, StaffLateResult } from '@/interfaces/StaffLateInterface';
import LiveImageComponent from '../../components/LiveImageComponent';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), {
    ssr: false
});
interface LateRecordsIR {
    pendingData: StaffLatePaginatedResponse | undefined;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}
const LateRecordsDataTable: React.FC<LateRecordsIR> = ({ pendingData, updatePage, updateLimit }) => {
    // Initialize states with safe default values
    const [data, setData] = React.useState<StaffLateResult[]>([]);
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
            selector: (row: StaffLateResult) => `${row.time_in}`,
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
            selector: (row: StaffLateResult) => `${row.status === 1 ? 'Paid' : 'Unpaid'}`,
            sortable: true,
        }, {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: StaffLateResult) => (
                <div className="flex items-center space-x-2">
                    <Button variant="outline-primary" size="sm">
                        <IconEdit className="w-5 h-5" />
                    </Button>
                    <Button variant="outline-danger" size="sm">
                        <IconTrash className="w-5 h-5" />
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
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
                onChangePage={(page, total) => handlePageChange(page)}
                onChangeRowsPerPage={(currentRowsPerPage, currentPage) => updateLimit(currentRowsPerPage)}
                responsive
                striped
            />
        </DataTableExtensions>
    );
}

export default LateRecordsDataTable;
