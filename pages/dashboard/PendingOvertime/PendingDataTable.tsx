import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";

import AddPayment from '../Payments/modals/AddPayment';
import LiveImageComponent from '../components/LiveImageComponent';
import { OvertimeRecord, OvertimeResponse } from '@/interfaces/OvertimeModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), {
    ssr: false
});
interface PendingOvertimeIF {
    pendingData: OvertimeResponse;
    openAddPayment: boolean;
    setAddPayment: React.Dispatch<React.SetStateAction<boolean>>;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}
export default function PendingDataTable({
    pendingData,
    openAddPayment,
    setAddPayment,
    updatePage,
    updateLimit,
}: PendingOvertimeIF) {
    // Initialize states with safe default values
    const [data, setData] = React.useState<OvertimeRecord[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);

    // Update state when pendingData changes
    React.useEffect(() => {
        if (pendingData) {
            setData(pendingData.results || []);
            setCurrentPage(pendingData.currentPage || 1);
            setPageSize(pendingData.pageSize || 10);
            setTotalDocuments(pendingData.totalDocuments || 0);
        }
    }, [pendingData]);

    const columns = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            cell: (row: OvertimeRecord) => (
                <LiveImageComponent url={row.student?.student_profile_pic} />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) => `${row.student.student_fname} ${row.student.student_lname}`,
            sortable: true
        },
        {
            name: "Guardian".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) => `${row.guardian.guardian_fname} ${row.guardian.guardian_lname}`,
            sortable: true
        },
        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: OvertimeRecord) => `UGX ${row.overtime_charge ?? 0}`,
            sortable: true,
            right: true
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
        <>
            <DataTableExtensions {...tableData}>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={(page, tt) => handlePageChange(page)}
                    onChangeRowsPerPage={(lm, page) => updateLimit(lm)}
                    responsive
                    striped
                    persistTableHead
                    fixedHeader
                />

            </DataTableExtensions>
            {/* modal for add a payment */}
            <AddPayment
                show={openAddPayment}
                handleClose={() => setAddPayment(false)}
                amount={''}
                guardian={''}
                student={''}
                studentId={''}
                guardianId={''} />
        </>


    );
}