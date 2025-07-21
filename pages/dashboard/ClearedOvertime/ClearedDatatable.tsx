import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";

import LiveImageComponent from '../components/LiveImageComponent';
import { OvertimeRecord, OvertimeResponse } from '@/interfaces/OvertimeModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

interface ClearedDataTableProps {
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    clearedData?: OvertimeResponse; // Made optional to handle undefined case
}

export default function ClearedDataTable({ clearedData, updatePage, updateLimit }: ClearedDataTableProps) {
    // Provide default values when clearedData is undefined
    const defaultData: OvertimeResponse = {
        results: [],
        currentPage: 1,
        pageSize: 10,
        totalDocuments: 0,
        totalPages: 0
    };

    // Use nullish coalescing to handle undefined clearedData
    const safeData = clearedData ?? defaultData;

    const [data, setData] = React.useState<OvertimeRecord[]>(safeData.results);
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
            // selector: (row: OvertimeRecord) => row.student?.studentProfilePic ?? '',
            cell: (row: OvertimeRecord) => (
                <LiveImageComponent url={row.student?.student_profile_pic} />
            ),
            ignoreRowClick: true,
            sortable: true
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) =>
                `${row.student?.student_fname ?? ''} ${row.student?.student_lname ?? ''}`,
            sortable: true
        },
        {
            name: "Guardian".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) =>
                `${row.guardian?.guardian_fname ?? ''} ${row.guardian?.guardian_lname ?? ''}`,
            sortable: true
        },
        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) => `UGX ${row.overtime_charge ?? 0}`,
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
                    fixedHeader
                    striped
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={(page, total) => handlePageChange(page)}
                    onChangeRowsPerPage={(limit, rows) => updateLimit(limit)}
                    noDataComponent={<div className="p-4">No records found</div>}
                />
            </DataTableExtensions>
        </div>
    );
}