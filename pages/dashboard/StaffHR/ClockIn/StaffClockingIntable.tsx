import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { StaffClockingResponse, StaffClockingResult } from '@/interfaces/StaffClockingModel';
import moment from 'moment';
import LiveImageComponent from '../../components/LiveImageComponent';
import { Badge, Form } from 'react-bootstrap';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });



interface StaffClockingInDataTableProps {
    clockingData: StaffClockingResponse;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}

export default function StaffClockingInDataTable({
    clockingData,
    updatePage,
    updateLimit,
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
    // React.useEffect(() => {
    //     if (clockingData) {
    //         setData(clockingData.results);
    //         setCurrentPage(clockingData.page);
    //         setTotalDocuments(clockingData.total);
    //     }
    // }, [clockingData]);

    const columns = [
        {
            name: "Staff ID".toLocaleUpperCase(),
            cell: (row: StaffClockingResult) => (
                <>
                    <LiveImageComponent url={row.staff?.staff_profilePic} />
                </>

            ),
            ignoreRowClick: true,

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
            name: "STATUS".toLocaleUpperCase(),
            selector: (row: StaffClockingResult) => row.late?.toString() ?? 'N/A',
            sortable: true,
            cell: (row: StaffClockingResult) => (
                <>
                    {row.late ? <Badge bg="danger">LATE</Badge> :
                        <Badge bg="success">ON TIME</Badge>}
                </>
            )
        },
        {
            name: "Clock In".toLocaleUpperCase(),
            selector: (row: StaffClockingResult) => {
                if (!row.clock_in) return 'N/A';
                try {
                    return moment(row.clock_in).format("ll hh:mm a").toLocaleUpperCase();
                } catch (error) {
                    console.error('Error formatting date:', error);
                    return 'Invalid Date';
                }
            },
            sortable: true,
        },
    ];

    const tableData = {
        columns,
        data,
    };

    if (!clockingData) {
        return <div className="p-4 text-center">Loading...</div>;
    }
    const headerFilters = React.useMemo(() => {
        // const [searchResult, setSearchResult] = React.useState("")
        const handleSearch = (result: string) => {
            console.log(result)
        }
        return (
            <>
                <Form.Group className='mt-4'>
                    <Form.Control className='w-full sm:w-96' type='search' onChange={(e) => handleSearch(e.target.value)} placeholder='Search by name' />
                </Form.Group>
            </>
        )
    }
        , []);

    return (
        <>
            <DataTableExtensions {...tableData}>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    fixedHeader
                    fixedHeaderScrollHeight="400px"
                    paginationTotalRows={clockingData.total}
                    paginationDefaultPage={clockingData.page}
                    paginationPerPage={clockingData.limit}
                    onChangePage={(page, total) => updatePage(page)}
                    keyField='id'
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No clocking records found
                        </div>
                    }
                    onChangeRowsPerPage={(limit, tc) => {
                        updateLimit(limit);
                    }}
                />
            </DataTableExtensions>
        </>
    );
}