import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import DeleteStudent from './models/DeleteGuardian';
import { deleteGuardianData } from '@/utils/data_fetch';
import { StudentsNotPaginated } from '@/interfaces/StudentsNonPaginated';
import { Guardian, GuardianResponse } from '@/interfaces/GuardiansModel';
import EditGuardian from './models/EditGuardian';
import AddGuardian from './models/AddGuardian';

// Define proper types for DataTableExtensions
interface DataTableExtensionsProps {
    columns: any[];
    data: any[];
    exportHeaders?: boolean;
    filter?: boolean;
    print?: boolean;
    export?: boolean;
    children?: React.ReactNode;
}

const DataTableExtensions = dynamic<DataTableExtensionsProps>(
    () => import('react-data-table-component-extensions'),
    { ssr: false }
);

interface GuardianDataTableProps {
    guardians: GuardianResponse;
    students: StudentsNotPaginated[];
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    loadingClasses: boolean;
    updatePage: (value: number) => void;
}

export default function GuardianDataTable({
    guardians,
    students,
    addModalShow,
    setAddModalShow,
    loadingClasses,
    updatePage
}: GuardianDataTableProps) {
    const [data, setData] = React.useState<Guardian[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentGuardian, setCurrentGuardian] = React.useState<Guardian | null>(null);

    React.useEffect(() => {
        if (guardians) {
            setData(guardians.results || []);
            setCurrentPage(guardians.currentPage || 1);
            setPageSize(guardians.pageSize || 10);
            setTotalDocuments(guardians.totalDocuments || 0);
        }
    }, [guardians]);

    const handleEdit = (guardian: Guardian) => {
        setCurrentGuardian(guardian);
        setEditModalShow(true);
    };

    const handleDelete = (guardian: Guardian) => {
        setCurrentGuardian(guardian);
        setDeleteModalShow(true);
    };

    const handleSave = (newGuardian: Guardian) => {
        setData(prevData => [newGuardian, ...prevData]);
        setAddModalShow(false);
    };

    const handleSaveEdit = () => {
        setEditModalShow(false);
    };

    const handleSaveDelete = async () => {
        if (!currentGuardian?._id) return;

        setDeleting(true);
        try {
            await deleteGuardianData(currentGuardian._id);
            setDeleteModalShow(false);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting guardian:", error);
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
            name: "Guardian Profile".toLocaleUpperCase(),
            cell: (row: Guardian) => (
                <img
                    className="rounded-full w-12 h-12 object-cover"
                    src={row.guardian_profile_pic}
                    alt={`${row.guardian_fname}'s profile`}
                    width={48}
                    height={48}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "First Name".toLocaleUpperCase(),
            selector: (row: Guardian) => row.guardian_fname,
            sortable: true
        },
        {
            name: "Last Name".toLocaleUpperCase(),
            selector: (row: Guardian) => row.guardian_lname,
            sortable: true
        },
        {
            name: "Relationship".toLocaleUpperCase(),
            selector: (row: Guardian) => row.relationship,
            sortable: true
        },
        {
            name: "Contact".toLocaleUpperCase(),
            selector: (row: Guardian) => "0" + row.guardian_contact,
            sortable: true
        },
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: Guardian) => (
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
        exportHeaders: true,
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
                    highlightOnHover
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No guardians found
                        </div>
                    }
                />
            </DataTableExtensions>

            <EditGuardian
                students={students}
                loadingClasses={loadingClasses}
                editModalShow={editModalShow}
                currentGuardian={currentGuardian}
                setCurrentGuardian={setCurrentGuardian}
                setEditModalShow={setEditModalShow}
                handleSaveEdit={handleSaveEdit}
            />

            <DeleteStudent
                deleteModalShow={deleteModalShow}
                deleting={deleting}
                currentGuardian={currentGuardian}
                setDeleteModalShow={setDeleteModalShow}
                handleSaveDelete={handleSaveDelete}
            />

            <AddGuardian
                students={students}
                loadingClasses={loadingClasses}
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                handleSave={handleSave}
            />
        </div>
    );
}