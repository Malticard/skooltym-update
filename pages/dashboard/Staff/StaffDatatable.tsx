import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import EditStaff from './models/EditStaff';
import DeleteStudent from './models/DeleteStudent';
import { deleteStaffData } from '@/utils/data_fetch';
import { Staff, StaffResponse } from '@/interfaces/StaffModel';
import { Role } from '@/interfaces/RolesModel';
import AddStaff from './models/AddStaff';

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
    handleUpdates
}: StaffDataTableProps) {
    const [data, setData] = React.useState<Staff[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentStaff, setCurrentStaff] = React.useState<Staff | null>(null);

    React.useEffect(() => {
        if (staff) {
            setData(staff.results || []);
            setCurrentPage(staff.currentPage || 1);
            setPageSize(staff.pageSize || 10);
            setTotalDocuments(staff.totalDocuments || 0);
        }
    }, [staff]);

    const handleEdit = (staffMember: Staff) => {
        setCurrentStaff(staffMember);
        setEditModalShow(true);
    };

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
                <img
                    className="rounded-full w-12 h-12 object-cover"
                    src={row.staff_profilePic}
                    alt={`${row.staff_fname}'s profile`}
                    width={48}
                    height={48}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "First Name".toLocaleUpperCase(),
            selector: (row: Staff) => row.staff_fname,
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
                <div className="flex space-x-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEdit(row)}
                        className="flex items-center"
                    >
                        <IconEdit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="danger"
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
        <div className="space-y-4">
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
                    responsive
                    striped
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No staff records found
                        </div>
                    }
                    progressPending={!data.length}
                    progressComponent={
                        <div className="p-4 text-center text-gray-500">
                            Loading staff records...
                        </div>
                    }
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
        </div>
    );
}