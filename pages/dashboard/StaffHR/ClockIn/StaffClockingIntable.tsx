import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { StaffClockingResponse, StaffClockingResult } from '@/interfaces/StaffClockingModel';
import moment from 'moment';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });



interface StaffClockingInDataTableProps {
    clockingData: StaffClockingResponse;
    updatePage: (value: number) => void;
}

export default function StaffClockingInDataTable({
    clockingData,
    updatePage
}: StaffClockingInDataTableProps) {
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

    const columns = [
        {
            name: "Staff ID".toLocaleUpperCase(),
            cell: (row: StaffClockingResult) => (
                <div className="flex items-center justify-center">
                    <img
                        className="m-2 rounded-full w-12 h-12 object-cover"
                        width={48}
                        height={48}
                        src={row.staff?.staff_profilePic ?? '/placeholder-avatar.jpg'}
                        alt={`${row.staff?.staff_fname ?? 'Staff'} profile picture`}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-avatar.jpg';
                        }}
                    />
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
            selector: (row: StaffClockingResult) => row.late?.toString() ?? 'N/A',
            sortable: true,
            cell: (row: StaffClockingResult) => (
                <span className={`px-2 py-1 rounded-full text-sm ${row.late ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {row.late ? 'Yes' : 'No'}
                </span>
            )
        },
        {
            name: "Clock In".toLocaleUpperCase(),
            selector: (row: StaffClockingResult) => {
                if (!row.clock_in) return 'N/A';
                try {
                    return moment(row.clock_in).format("hh:mm:ss a");
                } catch (error) {
                    console.error('Error formatting date:', error);
                    return 'Invalid Date';
                }
            },
            sortable: true,
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

    if (!clockingData) {
        return <div className="p-4 text-center">Loading...</div>;
    }

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
                    onChangePage={handlePageChange}
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No clocking records found
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