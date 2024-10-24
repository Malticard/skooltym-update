import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { StudentClockingResult } from '@/interfaces/StudentClockingModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function StudentClockingDataTable({ clockingData, updatePage }: { updatePage: (value: number) => void; clockingData: any; }) {
    const [data, setData] = React.useState<any[]>(clockingData?.results ?? []);

    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(clockingData?.page || 1);
    const [pageSize] = React.useState(clockingData?.limit || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(clockingData?.total || 0);

    // Update the data when the clockingData prop changes
    React.useEffect(() => {
        if (clockingData.results) {
            setData(clockingData.results);
            setTotalDocuments(clockingData.total);
        }
    }, [clockingData]);

    const columns: any = [
        {
            name: "Student ID".toLocaleUpperCase(),
            cell: (row: StudentClockingResult) => (
                <>
                    <img className='m-2 rounded-full w-[3em] h-[3em]' width={80} height={80} src={row.student.student_profile_pic} alt='student picture' />
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: StudentClockingResult) => `${row.student.student_fname} ${row.student.student_lname}`,
            sortable: true
        },
        {
            name: "Clock In".toLocaleUpperCase(),
            selector: (row: StudentClockingResult) => row.clock_in,
            sortable: true
        },
        // {
        //     name: "Clock Out".toLocaleUpperCase(),
        //     selector: (row: StudentClockingResult) => row.clock_out || 'N/A',
        //     sortable: true
        // },
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
            <DataTableExtensions {...tableDatas}>
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
