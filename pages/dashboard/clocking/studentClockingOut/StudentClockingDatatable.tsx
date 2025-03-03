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

}
export default function StudentClockingDataTable({
    clockingData,
    updatePage,
    updateLimit,
}: StudentClockingDataTableProps) {
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
    const data = clockingData?.results ?? [];
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
                paginationTotalRows={clockingData?.total ?? 0}
                paginationDefaultPage={clockingData.page}
                paginationPerPage={clockingData.pages}
                persistTableHead
                onChangePage={(x, total) => updatePage(x)}
                onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                    updateLimit(currentRowsPerPage)
                }}
                noDataComponent={
                    <div className="p-4 text-center text-gray-500">
                        No clocking records found
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