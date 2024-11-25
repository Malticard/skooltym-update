import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { OvertimeModel, Overtimes } from '@/interfaces/OvertimeModel';
import { PickupRecord } from '@/interfaces/pickUp';
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

interface PickupResponse {
    results: PickupRecord[];
    currentPage: number;
    pageSize: number;
    totalDocuments: number;
}

interface PickUpDataTableProps {
    pickUpData: PickupResponse;
    updatePage: (value: number) => void;
}

const DataTableExtensions = dynamic<DataTableExtensionsProps>(
    () => import('react-data-table-component-extensions'),
    { ssr: false }
);

export default function PickUpDataTable({
    pickUpData,
    updatePage
}: PickUpDataTableProps) {
    const [data, setData] = React.useState<PickupRecord[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);

    React.useEffect(() => {
        if (pickUpData) {
            setData(pickUpData.results || []);
            setCurrentPage(pickUpData.currentPage || 1);
            setPageSize(pickUpData.pageSize || 10);
            setTotalDocuments(pickUpData.totalDocuments || 0);
        }
    }, [pickUpData]);

    const columns = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            cell: (row: PickupRecord) => (
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
            selector: (row: PickupRecord) =>
                `${row.student_name.student_fname} ${row.student_name.student_lname}`,
            sortable: true
        },
        {
            name: "Picked Up By".toLocaleUpperCase(),
            selector: (row: PickupRecord) =>
                row.picked_by
                    ? `${row.picked_by.guardian_fname} ${row.picked_by.guardian_lname}`
                    : 'N/A',
            sortable: true
        },
        {
            name: "Cleared By".toLocaleUpperCase(),
            selector: (row: PickupRecord) =>
                row.authorized_by
                    ? `${row.authorized_by.staff_fname} ${row.authorized_by.staff_lname}`
                    : 'N/A',
            sortable: true
        },
        {
            name: "Pick Up Time".toLocaleUpperCase(),
            cell: (row: PickupRecord) => (
                <div className="whitespace-nowrap">
                    {moment(row.pick_up_time).format('hh:mm:ss A')}
                </div>
            ),
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
        exportHeaders: true
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
                            No pick-up records found
                        </div>
                    }
                    progressPending={!data.length}
                    progressComponent={
                        <div className="p-4 text-center text-gray-500">
                            Loading records...
                        </div>
                    }
                    theme="default"
                    persistTableHead
                />
            </DataTableExtensions>
        </div>
    );
}