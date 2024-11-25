import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { DropoffRecord, DropoffRecordsResponse } from '@/interfaces/DropOff';
import moment from 'moment';

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
    dropOffData: DropoffRecordsResponse;
    updatePage: (value: number) => void;
}

export default function DropOffDataTable({
    dropOffData,
    updatePage
}: DropOffDataTableProps) {
    const [data, setData] = React.useState<DropoffRecord[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);

    React.useEffect(() => {
        if (dropOffData) {
            setData(dropOffData.results || []);
            setCurrentPage(dropOffData.currentPage || 1);
            setPageSize(dropOffData.pageSize || 10);
            setTotalDocuments(dropOffData.totalDocuments || 0);
        }
    }, [dropOffData]);

    const columns = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            cell: (row: DropoffRecord) => (
                <img
                    className="rounded-full w-12 h-12 object-cover"
                    src={row.student_name.student_profile_pic}
                    alt={`${row.student_name.student_fname}'s profile`}
                    width={48}
                    height={48}
                />
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };

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
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={handlePageChange}
                    responsive
                    striped
                    highlightOnHover
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No drop-off records found
                        </div>
                    }
                    progressPending={!data.length}
                    progressComponent={
                        <div className="p-4 text-center text-gray-500">
                            Loading records...
                        </div>
                    }
                />
            </DataTableExtensions>
        </div>
    );
}