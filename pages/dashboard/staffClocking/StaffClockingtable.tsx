import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { StaffClockingResult } from '@/interfaces/StaffClockingModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function StaffClockingDataTable({ clockingData, updatePage }: { updatePage: (value: number) => void; clockingData: any; }) {
    const [data, setData] = React.useState<any[]>(clockingData.results);
    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(clockingData.currentPage || 1);
    const [pageSize] = React.useState(clockingData.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(clockingData.totalDocuments || 0);
    // Update the data when the students prop changes
    const columns: any = [
        {
            name: "Staff ID".toLocaleUpperCase(),
            ceil: (row: StaffClockingResult) => (
                <>
                    <img className='m-2 rounded-full w-[3em] h-[3em]' width={80} height={80} src={row.staff.staff_profilePic} alt='staff picture' />
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Staff".toLocaleUpperCase(),
            selector: (row: StaffClockingResult) => [`${row.staff.staff_fname} ${row.staff.staff_lname}`],
            sortable: true
        },
        {
            name: "Clock In".toLocaleUpperCase(),
            selector: (row: StaffClockingResult) => [`${row.clock_in}`],
            sortable: true
        }, {
            name: "Clock Out".toLocaleUpperCase(),
            selector: (row: StaffClockingResult) => [`${row.clock_out}` || 'N/A'],
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