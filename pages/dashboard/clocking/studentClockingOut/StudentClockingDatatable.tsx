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
    const [data, setData] = React.useState<any[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);

    React.useEffect(() => {
        if (clockingData) {
            setData(clockingData.results || []);
            setCurrentPage(clockingData.page || 1);
            setPageSize(clockingData.limit || 10);
            setTotalDocuments(clockingData.total || 0);
        }
    }, [clockingData]);

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
            selector: (row: StudentClockingResult) => moment(row.clock_out).format('Do MMM YYYY -  hh:mm A') || 'N/A',
            sortable: true
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
                    handlePageChange(x);
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
    );
}