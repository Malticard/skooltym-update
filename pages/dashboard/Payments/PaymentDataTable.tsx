import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic"
import LiveImageComponent from '../components/LiveImageComponent';
import { PaginatedResponse, Payment } from '@/interfaces/PaymentModel';


const DataTableExtensions: any = dynamic(() =>
    import('react-data-table-component-extensions'),
    { ssr: false }
);

interface PaymentDataTableProps {
    clearedData: PaginatedResponse | null;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    isLoading?: boolean;
}

export default function PaymentDataTable({
    clearedData,
    updateLimit,
    updatePage,
    isLoading = false
}: PaymentDataTableProps) {
    // Safely extract data from clearedData with proper defaults
    const data = React.useMemo(() => {
        return clearedData?.results || [];
    }, [clearedData?.results]);

    const currentPage = React.useMemo(() => {
        return clearedData?.currentPage || 1;
    }, [clearedData?.currentPage]);

    const pageSize = React.useMemo(() => {
        return clearedData?.pageSize || 10;
    }, [clearedData?.pageSize]);

    const totalDocuments = React.useMemo(() => {
        return clearedData?.totalDocuments || 0;
    }, [clearedData?.totalDocuments]);

    const columns = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            cell: (row: Payment) => (
                <LiveImageComponent url={row.student.student_profile_pic} />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: Payment) =>
                `${row.student.username}`,
            sortable: true,
        },
        {
            name: "Guardian".toLocaleUpperCase(),
            selector: (row: Payment) =>
                `${row.guardian.guardian_fname} ${row.guardian.guardian_lname}`,
            sortable: true,
        },
        {
            name: "Amount Paid".toLocaleUpperCase(),
            selector: (row: Payment) => `UGX ${row.paid_amount}`,
            sortable: true,
            right: true,
        },
        {
            name: "DATE",
            selector: (row: Payment) => new Date(row.createdAt).toLocaleDateString(),
            sortable: true
        }
    ];

    const handlePageChange = React.useCallback((page: number) => {
        if (page !== currentPage && !isLoading) {
            updatePage(page);
        }
    }, [currentPage, updatePage, isLoading]);

    const handleRowsPerPageChange = React.useCallback((newPerPage: number, _page: number) => {
        if (newPerPage !== pageSize && !isLoading) {
            updateLimit(newPerPage);
        }
    }, [pageSize, updateLimit, isLoading]);

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
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    progressPending={isLoading}
                    progressComponent={
                        <div className="p-4 text-center">
                            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white transition ease-in-out duration-150">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading payments...
                            </div>
                        </div>
                    }
                    disabled={isLoading}
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No payment records found"}
                        </div>
                    }
                    persistTableHead
                />
            </DataTableExtensions>
        </div>
    );
}