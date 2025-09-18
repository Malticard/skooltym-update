import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";

import LiveImageComponent from '../components/LiveImageComponent';
import { OvertimeRecord, OvertimeResponse } from '@/interfaces/OvertimeModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

interface ClearedDataTableProps {
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    clearedData: OvertimeResponse | null;
    isLoading?: boolean;
}

export default function ClearedDataTable({ clearedData, updatePage, updateLimit, isLoading = false }: ClearedDataTableProps) {
    // Use useMemo for derived state to avoid unnecessary re-renders
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
            // selector: (row: OvertimeRecord) => row.student?.studentProfilePic ?? '',
            cell: (row: OvertimeRecord) => (
                <LiveImageComponent url={row.student?.student_profile_pic} />
            ),
            ignoreRowClick: true,
            sortable: true
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) =>
                `${row.student?.student_fname ?? ''} ${row.student?.student_lname ?? ''}`,
            sortable: true
        },
        {
            name: "Guardian".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) =>
                `${row.guardian?.guardian_fname ?? ''} ${row.guardian?.guardian_lname ?? ''}`,
            sortable: true
        },
        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) => `UGX ${row.overtime_charge ?? 0}`,
            sortable: true
        },
        {
            name: "DATE",
            selector: (row: OvertimeRecord) => new Date(row.createdAt).toLocaleDateString(),
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
        <div className="w-full">
            <DataTableExtensions {...tableData}>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    fixedHeader
                    striped
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    progressPending={isLoading}
                    progressComponent={
                        <div className="p-4 text-center">
                            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white transition ease-in-out duration-150">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading overtime records...
                            </div>
                        </div>
                    }
                    disabled={isLoading}
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No overtime records found"}
                        </div>
                    }
                />
            </DataTableExtensions>
        </div>
    );
}