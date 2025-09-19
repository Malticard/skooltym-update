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
    pendingData: OvertimeResponse | null;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    isLoading?: boolean;
}

export default function PendingDataTable({
    pendingData,
    updatePage,
    updateLimit,
    isLoading = false
}: PendingOvertimeIF) {
    // Use useMemo for derived state to avoid unnecessary re-renders
    const data = React.useMemo(() => {
        return pendingData?.results || [];
    }, [pendingData?.results]);

    const currentPage = React.useMemo(() => {
        return pendingData?.currentPage || 1;
    }, [pendingData?.currentPage]);

    const pageSize = React.useMemo(() => {
        return pendingData?.pageSize || 10;
    }, [pendingData?.pageSize]);

    const totalDocuments = React.useMemo(() => {
        return pendingData?.totalDocuments || 0;
    }, [pendingData?.totalDocuments]);

    const [openAddPayment, setAddPayment] = React.useState(false);
    const [overtimeData, setOvertimeData] = React.useState<OvertimeRecord | null>(null);
    const [userData, setUserData] = React.useState({} as AuthenticatedUserModel);

    // Load user data on mount
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('skooltym_user') as string);
        setUserData(user);
    }, []);

    const columns: any[] = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            cell: (row: OvertimeRecord) => (
                <LiveImageComponent url={row.student?.student_profile_pic ?? ''} />
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
            right: false
        },
        {
            name: "DATE",
            selector: (row: OvertimeRecord) => new Date(row.createdAt).toLocaleDateString(),
            sortable: true
        }
        // {
        //     name: "Actions".toLocaleUpperCase(),
        //     cell: (row: OvertimeRecord) => (
        //         <button className='btn btn-primary' onClick={() => {
        //             setOvertimeData(row);
        //             setAddPayment(true);
        //         }}>Add Payment</button>
        //     ),
        // }
    ];

    const handlePageChange = React.useCallback((page: number) => {
        if (page !== currentPage && !isLoading) {
            updatePage(page);
        }
    }, [currentPage, updatePage, isLoading]);

    const handleRowsPerPageChange = React.useCallback((newPerPage: number, _page: number) => {
        if (newPerPage !== pageSize && !isLoading) {
            updateLimit(newPerPage);
        }
    }, [pageSize, updateLimit, isLoading]);
    if (userData.role === 'Finance') {
        columns.push({
            name: "Actions".toLocaleUpperCase(),
            cell: (row: OvertimeRecord) => (
                <button className='btn btn-primary' onClick={() => {
                    setOvertimeData(row);
                    setAddPayment(true);
                }}>Add Payment</button>
            ),
        })
    }
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
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    progressPending={isLoading}
                    progressComponent={
                        <div className="p-4 text-center">
                            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white transition ease-in-out duration-150">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading pending overtime...
                            </div>
                        </div>
                    }
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No pending overtime records found"}
                        </div>
                    }
                    disabled={isLoading}
                    responsive
                    striped
                    persistTableHead
                    fixedHeader
                />
            </DataTableExtensions>

            {/* Modal for add a payment - Only render when overtimeData exists */}
            {openAddPayment && overtimeData && (
                <AddPayment
                    overtime={overtimeData._id}
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