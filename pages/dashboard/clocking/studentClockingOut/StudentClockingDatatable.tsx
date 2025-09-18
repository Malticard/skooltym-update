import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { StudentClockingResult } from '@/interfaces/StudentClockingModel';
import LiveImageComponent from '../../components/LiveImageComponent';
import moment from 'moment';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), {
    ssr: false
});
interface StudentClockingDataTableProps {
    updateLimit: (value: number) => void;
    updatePage: (value: number) => void;
    clockingData: any;
    isLoading?: boolean;
}
export default function StudentClockingDataTable({
    clockingData,
    updatePage,
    updateLimit,
    isLoading = false
}: StudentClockingDataTableProps) {
    // Use useMemo for derived state to avoid unnecessary re-renders
    const data = React.useMemo(() => {
        return clockingData?.results || [];
    }, [clockingData?.results]);

    const currentPage = React.useMemo(() => {
        return clockingData?.page || 1;
    }, [clockingData?.page]);

    const pageSize = React.useMemo(() => {
        return clockingData?.limit || 10;
    }, [clockingData?.limit]);

    const totalDocuments = React.useMemo(() => {
        return clockingData?.total || 0;
    }, [clockingData?.total]);
    const formatTime = (time: string | Date | null | undefined): string => {
        if (!time) return 'N/A';
        try {
            return moment(time).format('ll - hh:mm A').toUpperCase();
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Invalid Time';
        }
    };

    const columns = [
        {
            name: "Student ID".toLocaleUpperCase(),
            cell: (row: StudentClockingResult) => (
                <LiveImageComponent url={row.student.student_profile_pic} />
            ),
            ignoreRowClick: true,
            // allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: StudentClockingResult) =>
                `${row.student.student_fname} ${row.student.student_lname}`,
            sortable: true
        },
        {
            name: "Clock Out".toLocaleUpperCase(),
            selector: (row: StudentClockingResult) => formatTime(row.clock_out),
            sortable: true
        },
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
        <DataTableExtensions {...tableData}>
            <DataTable
                columns={columns}
                data={data}
                pagination
                fixedHeader
                paginationServer
                paginationTotalRows={totalDocuments}
                paginationDefaultPage={currentPage}
                paginationPerPage={pageSize}
                persistTableHead
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
                            Loading student clock-out records...
                        </div>
                    </div>
                }
                disabled={isLoading}
                noDataComponent={
                    <div className="p-4 text-center text-gray-500">
                        {isLoading ? "Loading..." : "No clocking records found"}
                    </div>
                }
                customStyles={{
                    rows: {
                        style: {
                            minHeight: '72px',
                        },
                    },
                    headCells: {
                        style: {
                            paddingLeft: '8px',
                            paddingRight: '8px',
                            fontWeight: 'bold',
                        },
                    },
                    cells: {
                        style: {
                            paddingLeft: '2px',
                            paddingRight: '2px',
                        },
                    },
                }}
            />
        </DataTableExtensions>
    );
}