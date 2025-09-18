import React from 'react';
import DataTable from 'react-data-table-component';
import { Badge, Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconEye, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import EditStaff from './models/EditStaff';
import DeleteStudent from './models/DeleteStudent';
import { deleteStaffData } from '@/utils/data_fetch';
import { Staff, StaffResponse } from '@/interfaces/StaffModel';
import { Role } from '@/interfaces/RolesModel';
import AddStaff from './models/AddStaff';
import LiveImageComponent from '../components/LiveImageComponent';
import StaffDetailsComponent from './StaffDetailsComponent';
import { mutate } from 'swr';

interface DataTableExtensionsProps {
    columns: any[];
    data: any[];
    exportHeaders?: boolean;
    filter?: boolean;
    print?: boolean;
    export?: boolean;
    children?: React.ReactNode;
}

interface StaffDataTableProps {
    staff: StaffResponse | null;
    roles: Role[];
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    loadingClasses: boolean;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    handleUpdates: () => void;
    isLoading?: boolean;
}

const DataTableExtensions = dynamic<DataTableExtensionsProps>(
    () => import('react-data-table-component-extensions'),
    { ssr: false }
);

export default function StaffDataTable({
    staff,
    roles,
    addModalShow,
    setAddModalShow,
    loadingClasses,
    updatePage,
    updateLimit,
    handleUpdates,
    isLoading = false
}: StaffDataTableProps) {
    // Use useMemo for derived state to avoid unnecessary re-renders
    const data = React.useMemo(() => {
        return staff?.results || [];
    }, [staff?.results]);

    const currentPage = React.useMemo(() => {
        return staff?.currentPage || 1;
    }, [staff?.currentPage]);

    const pageSize = React.useMemo(() => {
        return staff?.pageSize || 10;
    }, [staff?.pageSize]);

    const totalDocuments = React.useMemo(() => {
        return staff?.totalDocuments || 0;
    }, [staff?.totalDocuments]);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentStaff, setCurrentStaff] = React.useState<Staff | null>(null);
    const [openStaffDetails, setOpenStaffDetails] = React.useState<boolean>(false);

    const handleEdit = (staffMember: Staff) => {
        setCurrentStaff(staffMember);
        setEditModalShow(true);
    };
    // handle viewing staff details
    const handleView = (staffMember: Staff) => {
        setCurrentStaff(staffMember);
        setOpenStaffDetails(true);

    }
    const handleDelete = (staffMember: Staff) => {
        setCurrentStaff(staffMember);
        setDeleteModalShow(true);
    };

    const handleSave = (newStaff: Staff) => {
        setAddModalShow(false);
        mutate("fetchStaff");
    };

    const handleSaveEdit = () => {
        setEditModalShow(false);
        mutate("fetchStaff");
    };

    const handleSaveDelete = async () => {
        if (!currentStaff?._id) return;

        setDeleting(true);
        try {
            await deleteStaffData(currentStaff._id);
            setDeleteModalShow(false);
            mutate("fetchStaff");
        } catch (error) {
            console.error("Error deleting staff:", error);
        } finally {
            setDeleting(false);
        }
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

    const columns = [
        {
            name: "Staff Profile".toLocaleUpperCase(),
            cell: (row: Staff) => (
                <LiveImageComponent url={row.staff_profilePic} />
            ),
            ignoreRowClick: true,
        },
        {
            name: "First Name".toLocaleUpperCase(),
            cell: (row: Staff) => (<>
                <span className='w-45'>{row.staff_fname}</span>
            </>),
            sortable: true
        },
        {
            name: "Last Name".toLocaleUpperCase(),
            selector: (row: Staff) => row.staff_lname,
            sortable: true
        },
        {
            name: "Role".toLocaleUpperCase(),
            cell: (row: Staff) => (<Badge bg='success'>{row.staff_role?.role_type || ''}</Badge>),
            sortable: true
        },
        {
            name: "Contact".toLocaleUpperCase(),
            selector: (row: Staff) => "0" + row.staff_contact,
            sortable: true
        },
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: Staff) => (
                <div className="flex flex-row justify-around items-center space-x-1">
                    {/* handle viewing */}
                    <Button variant='outline-info'
                        size="sm"
                        onClick={() => handleView(row)}
                        className="flex items-center">
                        <IconEye className="w-4 h-4" />
                    </Button>
                    {/* handle edit */}
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(row)}
                        className="flex items-center"
                    >
                        <IconEdit className="w-4 h-4" />
                    </Button>
                    {/* handle delete */}
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(row)}
                        className="flex items-center"
                    >
                        <IconTrash className="w-4 h-4" />
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            button: true,
        }
    ];

    const tableData: DataTableExtensionsProps = {
        columns,
        data,
        filter: true,
        export: true,
        print: true,
        exportHeaders: true
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
                                Loading staff...
                            </div>
                        </div>
                    }
                    disabled={isLoading}
                    responsive
                    striped
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No staff records found"}
                        </div>
                    }
                    customStyles={{
                        rows: {
                            style: {
                                minHeight: '10px',
                            },
                        },
                        headCells: {
                            style: {
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                fontWeight: 'light',
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

            {currentStaff && (
                <EditStaff
                    roles={roles}
                    loadingClasses={loadingClasses}
                    editModalShow={editModalShow}
                    currentStaff={currentStaff}
                    setCurrentStaff={setCurrentStaff}
                    setEditModalShow={setEditModalShow}
                    handleSaveEdit={handleSaveEdit}
                />
            )}

            <DeleteStudent
                deleteModalShow={deleteModalShow}
                deleting={deleting}
                currentStaff={currentStaff}
                setDeleteModalShow={setDeleteModalShow}
                handleSaveDelete={handleSaveDelete}
            />

            <AddStaff
                roles={roles}
                loadingClasses={loadingClasses}
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                handleSave={handleSave}
            />
            {/* staff details */}
            <StaffDetailsComponent staff={currentStaff} showStaffDetails={openStaffDetails} setStaffDetails={setOpenStaffDetails} />
        </>
    );
}