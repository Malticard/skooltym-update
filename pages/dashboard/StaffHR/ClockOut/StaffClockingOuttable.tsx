import React from 'react';
import DataTable from 'react-data-table-component';
import dynamic from "next/dynamic";
import { StaffClockingResponse, StaffClockingResult } from '@/interfaces/StaffClockingModel';
import moment from 'moment';
import LiveImageComponent from '../../components/LiveImageComponent';
import { Badge, Button, Container, Modal } from 'react-bootstrap';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

interface StaffClockingOutDataTableProps {
    clockingData: StaffClockingResponse | null;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    isLoading?: boolean;
}

export default function StaffClockingOutDataTable({
    clockingData,
    updatePage,
    updateLimit,
    isLoading = false
}: StaffClockingOutDataTableProps) {
    // Use useMemo for derived state to avoid unnecessary re-renders
    const data = React.useMemo(() => {
        return clockingData?.results || [];
    }, [clockingData?.results]);

    const currentPage = React.useMemo(() => {
        return clockingData?.page || 1;
    }, [clockingData?.page]);

    const pageSize = React.useMemo(() => {
        return clockingData?.limit || 10;
    }, [clockingData?.limit]);

    const totalDocuments = React.useMemo(() => {
        return clockingData?.total || 0;
    }, [clockingData?.total]);

    const [clockOutReason, setClockOutReason] = React.useState<string>("");
    const [reasonModel, showReasonModel] = React.useState<boolean>(false);

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
        }, {
            name: "clocked reason".toLocaleUpperCase(),
            sortable: true,
            cell: (row: StaffClockingResult) => (
                <>
                    {
                        row.clock_out_with_reason ? <Button onClick={() => { showReasonModel(true), setClockOutReason(row.clock_out_reason) }} variant='outline-success'>View Reason</Button> : <Badge bg="danger">No</Badge>
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


    interface StaffDetailsComponentIF {
        reason: string;
        showStaffReason: boolean;
        setStaffReason: React.Dispatch<React.SetStateAction<boolean>>;
    }

    const StaffClockOutReasonComponent: React.FC<StaffDetailsComponentIF> = ({
        reason,
        setStaffReason,
        showStaffReason,
    }) => {
        return (
            <Modal
                show={showStaffReason}
                onHide={() => setStaffReason(false)}
                size="lg"
                centered
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Reason for clocking out.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className='p-5'>
                        {reason}
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setStaffReason(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
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
                                Loading staff clock-out records...
                            </div>
                        </div>
                    }
                    disabled={isLoading}
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No clock-out records found"}
                        </div>
                    }
                    persistTableHead
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
            {/* model for showing staff clocking reason */}
            <StaffClockOutReasonComponent reason={clockOutReason} showStaffReason={reasonModel} setStaffReason={showReasonModel} />
        </div>
    );
}