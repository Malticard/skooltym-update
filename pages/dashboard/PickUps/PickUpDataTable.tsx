import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { PickupRecord } from '@/interfaces/pickUp';
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

interface PickupResponse {
    results: PickupRecord[];
    currentPage: number;
    pageSize: number;
    totalDocuments: number;
}

interface PickUpDataTableProps {
    pickUpData: PickupResponse;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}

const DataTableExtensions = dynamic<DataTableExtensionsProps>(
    () => import('react-data-table-component-extensions'),
    { ssr: false }
);

export default function PickUpDataTable({
    pickUpData,
    updatePage,
    updateLimit
}: PickUpDataTableProps) {
    const [data, setData] = React.useState<PickupRecord[]>(pickUpData?.results);


    const columns = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            cell: (row: PickupRecord) => (
                <LiveImageComponent url={row.student_name.student_profile_pic} />
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
                    data={pickUpData?.results ?? []}
                    pagination
                    paginationServer
                    paginationTotalRows={pickUpData?.totalDocuments ?? 0}
                    paginationDefaultPage={pickUpData?.currentPage ?? 1}
                    paginationPerPage={pickUpData?.pageSize ?? 1}
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
                    onChangePage={(page, tt) => updatePage(page)}
                    onChangeRowsPerPage={(limit, tt) => updateLimit(limit)}
                    responsive
                    striped
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No pick-up records found
                        </div>
                    }
                    theme="default"
                    persistTableHead
                />
            </DataTableExtensions>
        </div>
    );
}