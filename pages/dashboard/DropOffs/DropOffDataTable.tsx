import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { DropoffRecord, DropoffRecordsResponse } from '@/interfaces/DropOff';
import moment from 'moment';
import LiveImageComponent from '../components/LiveImageComponent';

interface DataTableExtensionsProps {
    columns: any[];
    data: any[];
    exportHeaders?: boolean;
    filter?: boolean;
    print?: boolean;
    export?: boolean;
    children?: React.ReactNode;
}

const DataTableExtensions = dynamic<DataTableExtensionsProps>(
    () => import('react-data-table-component-extensions'),
    { ssr: false }
);

interface DropOffDataTableProps {
    dropOffData: DropoffRecordsResponse | null;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    isLoading?: boolean;
}

export default function DropOffDataTable({
    dropOffData,
    updatePage, 
    updateLimit,
    isLoading = false
}: DropOffDataTableProps) {
    // Use useMemo for derived state to avoid unnecessary re-renders
    const data = React.useMemo(() => {
        return dropOffData?.results || [];
    }, [dropOffData?.results]);

    const currentPage = React.useMemo(() => {
        return dropOffData?.currentPage || 1;
    }, [dropOffData?.currentPage]);

    const pageSize = React.useMemo(() => {
        return dropOffData?.pageSize || 10;
    }, [dropOffData?.pageSize]);

    const totalDocuments = React.useMemo(() => {
        return dropOffData?.totalDocuments || 0;
    }, [dropOffData?.totalDocuments]);

    const columns = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            cell: (row: DropoffRecord) => (
                <LiveImageComponent url={row.student_name.student_profile_pic} />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: DropoffRecord) =>
                `${row.student_name.student_fname} ${row.student_name.student_lname}`,
            sortable: true
        },
        {
            name: "Dropped by".toLocaleUpperCase(),
            selector: (row: DropoffRecord) =>
                row.dropped_by
                    ? `${row.dropped_by.guardian_fname} ${row.dropped_by.guardian_lname}`
                    : 'N/A',
            sortable: true
        },
        {
            name: "Cleared by".toLocaleUpperCase(),
            selector: (row: DropoffRecord) =>
                `${row.authorized_by.staff_fname} ${row.authorized_by.staff_lname}`,
            sortable: true
        },
        {
            name: "DropOff time".toLocaleUpperCase(),
            selector: (row: DropoffRecord) => moment(row.drop_off_time).format("hh:mm:ss a"),
            sortable: true,
            right: true
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

    const tableData: DataTableExtensionsProps = {
        columns,
        data,
        filter: true,
        export: true,
        print: true,
        exportHeaders: true,
    };

    return (
        <div className="space-y-4">
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
                                Loading drop-off records...
                            </div>
                        </div>
                    }
                    disabled={isLoading}
                    responsive
                    striped
                    persistTableHead
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No drop-off records found"}
                        </div>
                    }

                />
            </DataTableExtensions>
        </div>
    );
}