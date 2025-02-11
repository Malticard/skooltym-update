import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
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
    staff: StaffResponse;
    roles: Role[];
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    loadingClasses: boolean;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    handleUpdates: () => void;
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
    handleUpdates
}: StaffDataTableProps) {
    const defaultData: StaffResponse = {
        results: [],
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
        totalDocuments: 0
    };
    const setSData = staff ?? defaultData;
    const [data, setData] = React.useState<Staff[]>(setSData.results);
    const [currentPage, setCurrentPage] = React.useState(setSData.currentPage);
    const [pageSize, setPageSize] = React.useState(setSData.pageSize);
    const [totalDocuments, setTotalDocuments] = React.useState(setSData.totalDocuments);
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
        setData(prevData => [newStaff, ...prevData]);
        setAddModalShow(false);
    };

    const handleSaveEdit = () => {
        setEditModalShow(false);
        handleUpdates();
    };

    const handleSaveDelete = async () => {
        if (!currentStaff?._id) return;

        setDeleting(true);
        try {
            await deleteStaffData(currentStaff._id);
            setDeleteModalShow(false);
            handleUpdates();
            window.location.reload();
        } catch (error) {
            console.error("Error deleting staff:", error);
        } finally {
            setDeleting(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };

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
            selector: (row: Staff) => row.staff_role?.role_type || '',
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
                    onChangePage={(page, tt) => handlePageChange(page)}
                    onChangeRowsPerPage={(perPage, tt) => updateLimit(perPage)}
                    responsive
                    striped
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No staff records found
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