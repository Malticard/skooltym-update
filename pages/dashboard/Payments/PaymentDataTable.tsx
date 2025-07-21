import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";

import AddPayment from './modals/AddPayment';
import LiveImageComponent from '../components/LiveImageComponent';
import { OvertimeRecord, OvertimeResponse } from '@/interfaces/OvertimeModel';

const DataTableExtensions: any = dynamic(() =>
    import('react-data-table-component-extensions'),
    { ssr: false }
);

interface PaymentDataTableProps {
    clearedData: OvertimeResponse
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}

export default function PaymentDataTable({
    clearedData,
    updateLimit,
    updatePage
}: PaymentDataTableProps) {
    const [data, setData] = React.useState<OvertimeRecord[]>([]);
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
            cell: (row: OvertimeRecord) => (
                <LiveImageComponent url={row.student.student_profile_pic} />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) =>
                `${row.student.student_fname} ${row.student.student_lname}`,
            sortable: true,
        },
        {
            name: "Guardian".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) =>
                `${row.guardian.guardian_fname} ${row.guardian.guardian_lname}`,
            sortable: true,
        },
        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) => `UGX ${row.overtime_charge.toLocaleString()}`,
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
                    persistTableHead
                />
            </DataTableExtensions>
        </div>
    );
}