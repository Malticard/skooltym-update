import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { OvertimeModel, Overtimes } from '@/interfaces/OvertimeModel';
import AddPayment from './modals/AddPayment';
import LiveImageComponent from '../components/LiveImageComponent';

const DataTableExtensions: any = dynamic(() =>
    import('react-data-table-component-extensions'),
    { ssr: false }
);

interface PaymentDataTableProps {
    clearedData: OvertimeModel;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}

export default function PaymentDataTable({
    clearedData,
    updateLimit,
    updatePage
}: PaymentDataTableProps) {
    const [data, setData] = React.useState<Overtimes[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);

    // Update state when clearedData changes
    React.useEffect(() => {
        if (clearedData) {
            setData(clearedData.results || []);
            setCurrentPage(clearedData.currentPage || 1);
            setPageSize(clearedData.pageSize || 10);
            setTotalDocuments(clearedData.totalDocuments || 0);
        }
    }, [clearedData]);

    const columns = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            cell: (row: Overtimes) => (
                <LiveImageComponent url={row.student.studentProfilePic} />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: Overtimes) =>
                `${row.student.studentFname} ${row.student.studentLname}`,
            sortable: true,
        },
        {
            name: "Guardian".toLocaleUpperCase(),
            selector: (row: Overtimes) =>
                `${row.guardian.guardianFname} ${row.guardian.guardianLname}`,
            sortable: true,
        },
        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: Overtimes) => `UGX ${row.overtimeCharge.toLocaleString()}`,
            sortable: true,
            right: true,
        },
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
        <div className="space-y-4">
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
                    onChangeRowsPerPage={(limit, page) => updateLimit(limit)}
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No payment records found
                        </div>
                    }
                />
            </DataTableExtensions>
        </div>
    );
}