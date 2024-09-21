import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { DropoffRecord, DropoffRecordsResponse } from '@/interfaces/DropOff';
const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function DropOffDataTable({ dropOffData, updatePage }: { updatePage: (value: number) => void; dropOffData: DropoffRecordsResponse; }) {
    const [data, setData] = React.useState<any[]>(dropOffData.results);
    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(dropOffData.currentPage || 1);
    const [pageSize] = React.useState(dropOffData.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(dropOffData.totalDocuments || 0);
    // Update the data when the students prop changes
    const columns: any = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            ceil: (row: DropoffRecord) => (
                <>
                    <img className='m-2 rounded-full w-[3em] h-[3em]' width={80} height={80} src={row.student_name.student_profile_pic} />
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: DropoffRecord) => [`${row.student_name.student_fname} ${row.student_name.student_lname}`],
            sortable: true
        },
        {
            name: "Dropped by".toLocaleUpperCase(),
            selector: (row: DropoffRecord) => [`${row.dropped_by?.guardian_fname} ${row.dropped_by?.guardian_lname}`],
            sortable: true
        }, {
            name: "Cleared by".toLocaleUpperCase(),
            selector: (row: DropoffRecord) => [`${row.authorized_by.staff_fname} ${row.authorized_by?.staff_lname}`],
            sortable: true
        },
        {
            name: "DropOff time".toLocaleUpperCase(),
            selector: (row: DropoffRecord) => [`${row.drop_off_time}`],
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