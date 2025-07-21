import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";

import AddPayment from '../Payments/modals/AddPayment';
import LiveImageComponent from '../components/LiveImageComponent';
import { OvertimeRecord, OvertimeResponse } from '@/interfaces/OvertimeModel';
import { AuthenticatedUserModel } from '@/interfaces/AuthenticatedUserModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), {
    ssr: false
});

interface PendingOvertimeIF {
    pendingData: OvertimeResponse;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}

export default function PendingDataTable({
    pendingData,
    updatePage,
    updateLimit,
}: PendingOvertimeIF) {
    // Initialize states with safe default values
    const [data, setData] = React.useState<OvertimeRecord[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [openAddPayment, setAddPayment] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);
    const [overtimeData, setOvertimeData] = React.useState<OvertimeRecord | null>(null); // Changed to null
    const [userData, setUserData] = React.useState({} as AuthenticatedUserModel);

    // Update state when pendingData changes
    React.useEffect(() => {
        if (pendingData) {
            setData(pendingData.results || []);
            setCurrentPage(pendingData.currentPage || 1);
            setPageSize(pendingData.pageSize || 10);
            setTotalDocuments(pendingData.totalDocuments || 0);
            // user data
            const user = JSON.parse(localStorage.getItem('skooltym_user') as string);
            setUserData(user);
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
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: OvertimeRecord) => (
                <button className='btn btn-primary' onClick={() => {
                    setOvertimeData(row);
                    setAddPayment(true);
                }}>Add Payment</button>
            ),
        }
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };
    (userData.role === 'Finance') && columns.push({
        name: "Actions".toLocaleUpperCase(),
        cell: (row: OvertimeRecord) => (
            <button className='btn btn-primary' onClick={() => {
                setOvertimeData(row);
                setAddPayment(true);
            }}>Add Payment</button>
        ),
    })
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

            {/* Modal for add a payment - Only render when overtimeData exists */}
            {openAddPayment && overtimeData && (
                <AddPayment
                    show={openAddPayment}
                    user={userData}
                    handleClose={() => setAddPayment(false)}
                    amount={`${overtimeData.overtime_charge || 0}`}
                    guardian={overtimeData.guardian?.guardian_fname || ''}
                    student={overtimeData.student?.student_fname || ''}
                    studentId={overtimeData.student?._id || ''}
                    guardianId={overtimeData.guardian?._id || ''}
                />
            )}
        </>
    );
}