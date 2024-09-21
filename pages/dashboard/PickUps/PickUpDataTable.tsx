import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { OvertimeModel, Overtimes } from '@/interfaces/OvertimeModel';
import { PickupRecord } from '@/interfaces/pickUp';
import moment from 'moment';
const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function PickUpDataTable({ pickUpData, updatePage }: { updatePage: (value: number) => void; pickUpData: any; }) {
    const [data, setData] = React.useState<any[]>(pickUpData.results);
    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(pickUpData.currentPage || 1);
    const [pageSize] = React.useState(pickUpData.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(pickUpData.totalDocuments || 0);
    // Update the data when the students prop changes
    const columns: any = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            ceil: (row: PickupRecord) => (
                <>
                    <img className='m-2 rounded-full w-[3em] h-[3em]' width={80} height={80} src={row.student_name.student_profile_pic} />
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: PickupRecord) => [`${row.student_name.student_fname} ${row.student_name.student_lname}`],
            sortable: true
        },
        {
            name: "Dropped by".toLocaleUpperCase(),
            selector: (row: PickupRecord) => [`${row.picked_by?.guardian_fname} ${row.picked_by?.guardian_lname}`],
            sortable: true
        }, {
            name: "Cleared by".toLocaleUpperCase(),
            selector: (row: PickupRecord) => [`${row.authorized_by.staff_fname} ${row.authorized_by?.staff_lname}`],
            sortable: true
        },
        {
            name: "DropOff time".toLocaleUpperCase(),
            selector: (row: PickupRecord) => [moment(row.pick_up_time).format('h:m:s a').toUpperCase()],
            sortable: true
        },
    ];

    // Function to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);

    };
    const tableDatas = {
        columns,
        data,
    };
    return (
        <>
            <DataTableExtensions {...tableDatas} >
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={handlePageChange}
                />
            </DataTableExtensions>
        </>

    );
}