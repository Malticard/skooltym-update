import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { StudentClockingResponse, StudentClockingResult } from '@/interfaces/StudentClockingModel';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import DateFilterComponent from '../../components/DateFilterComponent';
import LiveImageComponent from '../../components/LiveImageComponent';


const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

interface StudentClockingDataTableProps {
    clockingData: StudentClockingResponse;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}

export default function StudentClockingDataTable({
    clockingData,
    updatePage,
    updateLimit
}: StudentClockingDataTableProps) {
    // Provide default values when clockingData is undefined
    const defaultData: StudentClockingResponse = {
        results: [],
        page: 1,
        pages: 0,
        limit: 10,
        total: 0
    };

    // Use nullish coalescing to handle undefined clockingData
    const safeData = clockingData ?? defaultData;

    const [data, setData] = React.useState<StudentClockingResult[]>(safeData.results);
    const [currentPage, setCurrentPage] = React.useState(safeData.page);
    const [pageSize] = React.useState(safeData.limit);
    const [totalDocuments, setTotalDocuments] = React.useState(safeData.total);

    // Update state when clockingData changes
    React.useEffect(() => {
        if (clockingData) {
            setData(clockingData.results ?? []);
            setCurrentPage(clockingData.page ?? 1);
            setTotalDocuments(clockingData.total ?? 0);
        }
    }, [clockingData]);

    const formatTime = (time: string | Date | null | undefined): string => {
        if (!time) return 'N/A';
        try {
            return moment(time).format('Do MMM YYYY - HH:mm A');
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Invalid Time';
        }
    };

    const columns = [
        {
            name: "Student ID".toLocaleUpperCase(),
            cell: (row: StudentClockingResult) => (
                <LiveImageComponent url={row.student?.student_profile_pic} />
            ),
            ignoreRowClick: true,
            // allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: StudentClockingResult) => {
                const firstName = row.student?.student_fname ?? '';
                const lastName = row.student?.student_lname ?? '';
                return `${firstName} ${lastName}`.trim() || 'N/A';
            },
            sortable: true,
            cell: (row: StudentClockingResult) => (
                <div className="font-medium">
                    {`${row.student?.student_fname ?? ''} ${row.student?.student_lname ?? ''}`}
                </div>
            )
        },
        {
            name: "Clock In".toLocaleUpperCase(),
            selector: (row: StudentClockingResult) => formatTime(row.clock_in),
            sortable: true,
            // cell: (row: StudentClockingResult) => (
            //     <div className="font-medium">
            //         {formatTime(row.clock_in)}
            //     </div>
            // )
        },
    ];

    const tableData = {
        columns,
        data,
    };

    return (
        <>
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
                    onChangePage={(x, total) => {
                        updatePage(x);
                        setCurrentPage(x);
                    }}
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
        </>
    );
}