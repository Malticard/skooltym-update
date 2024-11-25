import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { OvertimeModel, Overtimes } from '@/interfaces/OvertimeModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

interface ClearedDataTableProps {
    updatePage: (value: number) => void;
    clearedData?: OvertimeModel; // Made optional to handle undefined case
}

export default function ClearedDataTable({ clearedData, updatePage }: ClearedDataTableProps) {
    // Provide default values when clearedData is undefined
    const defaultData: OvertimeModel = {
        results: [],
        currentPage: 1,
        pageSize: 10,
        totalDocuments: 0,
        totalPages: 0
    };

    // Use nullish coalescing to handle undefined clearedData
    const safeData = clearedData ?? defaultData;

    const [data, setData] = React.useState<Overtimes[]>(safeData.results);
    const [currentPage, setCurrentPage] = React.useState(safeData.currentPage);
    const [pageSize] = React.useState(safeData.pageSize);
    const [totalDocuments, setTotalDocuments] = React.useState(safeData.totalDocuments);

    // Update state when clearedData changes
    React.useEffect(() => {
        if (clearedData) {
            setData(clearedData.results);
            setCurrentPage(clearedData.currentPage);
            setTotalDocuments(clearedData.totalDocuments);
        }
    }, [clearedData]);

    const columns = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            selector: (row: Overtimes) => row.student?.studentProfilePic ?? '',
            sortable: true
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: Overtimes) =>
                `${row.student?.studentFname ?? ''} ${row.student?.studentLname ?? ''}`,
            sortable: true
        },
        {
            name: "Guardian".toLocaleUpperCase(),
            selector: (row: Overtimes) =>
                `${row.guardian?.guardianFname ?? ''} ${row.guardian?.guardianLname ?? ''}`,
            sortable: true
        },
        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: Overtimes) => `UGX ${row.overtimeCharge ?? 0}`,
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

    // Add loading state when data is not available
    if (!clearedData) {
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
                    noDataComponent={<div className="p-4">No records found</div>}
                />
            </DataTableExtensions>
        </div>
    );
}