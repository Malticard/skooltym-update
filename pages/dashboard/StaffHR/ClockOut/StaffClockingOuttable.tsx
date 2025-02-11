import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { StaffClockingResponse, StaffClockingResult } from '@/interfaces/StaffClockingModel';
import moment from 'moment';
import LiveImageComponent from '../../components/LiveImageComponent';
import { Badge } from 'react-bootstrap';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

// interface StaffClockingResponse {
//     results: StaffClockingResult[];
//     page: number;
//     pageSize: number;
//     totalDocuments: number;
// }

interface StaffClockingOutDataTableProps {
    clockingData: StaffClockingResponse;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}

export default function StaffClockingOutDataTable({
    clockingData,
    updatePage,
    updateLimit,
}: StaffClockingOutDataTableProps) {
    // Provide default values when clockingData is undefined
    const defaultData: StaffClockingResponse = {
        results: [],
        page: 1,
        limit: 10,
        total: 0
    };

    // Use nullish coalescing to handle undefined clockingData
    const safeData = clockingData ?? defaultData;

    const [data, setData] = React.useState<StaffClockingResult[]>(safeData.results);
    const [currentPage, setCurrentPage] = React.useState(safeData.page);
    const [pageSize] = React.useState(safeData.limit);
    const [totalDocuments, setTotalDocuments] = React.useState(safeData.total);

    // Update state when clockingData changes
    React.useEffect(() => {
        if (clockingData) {
            setData(clockingData.results);
            setCurrentPage(clockingData.page);
            setTotalDocuments(clockingData.total);
        }
    }, [clockingData]);

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
            name: "Staff ID".toLocaleUpperCase(),
            cell: (row: StaffClockingResult) => (
                <div className="flex items-center justify-center">
                    <LiveImageComponent url={row.staff.staff_profilePic} />
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Staff".toLocaleUpperCase(),
            selector: (row: StaffClockingResult) => {
                const firstName = row.staff?.staff_fname ?? '';
                const lastName = row.staff?.staff_lname ?? '';
                return `${firstName} ${lastName}`.trim() || 'N/A';
            },
            sortable: true
        },
        {
            name: "LATE".toLocaleUpperCase(),
            sortable: true,
            cell: (row: StaffClockingResult) => (
                <>
                    {
                        row.late ? <Badge bg="danger">LATE</Badge> : <Badge bg='success'>ON TIME</Badge>
                    }
                </>
            )
        },
        {
            name: "Clock Out".toLocaleUpperCase(),
            selector: (row: StaffClockingResult) => formatTime(row.clock_out),
            sortable: true,
            cell: (row: StaffClockingResult) => (
                <span className={`${row.clock_out ? 'text-gray-900' : 'text-gray-500 italic'}`}>
                    {formatTime(row.clock_out)}
                </span>
            )
        },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };

    const tableData = {
        columns,
        data,
    };

    return (
        <div className="w-full">
            <DataTableExtensions {...tableData}>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={(page, total) => handlePageChange(page)}
                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                        updateLimit(currentRowsPerPage);
                    }}
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No clock-out records found
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
                                paddingLeft: '8px',
                                paddingRight: '8px',
                            },
                        },
                    }}
                />
            </DataTableExtensions>
        </div>
    );
}