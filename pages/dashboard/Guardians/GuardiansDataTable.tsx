import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import DeleteStudent from './models/DeleteGuardian';
import { deleteGuardianData, fetchGuardianStudents } from '@/utils/data_fetch';
import { StudentsNotPaginated } from '@/interfaces/StudentsNonPaginated';
import { Guardian, GuardianResponse } from '@/interfaces/GuardiansModel';
import EditGuardian from './models/EditGuardian';
import AddGuardian from './models/AddGuardian';
import LiveImageComponent from '../components/LiveImageComponent';
import { GuardianStudent } from '@/interfaces/GuardianStudents';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

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
    guardians: GuardianResponse | null;
    students: StudentsNotPaginated[];
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    guardianStudents: GuardianStudent[] | undefined;
    handleSync: () => void;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    isLoading?: boolean;
}

export default function GuardianDataTable({
    guardians,
    students,
    addModalShow,
    guardianStudents,
    setAddModalShow,
    updatePage,
    updateLimit,
    handleSync,
    isLoading = false
}: GuardianDataTableProps) {
    // Use useMemo for derived state to avoid unnecessary re-renders
    const data = React.useMemo(() => {
        return guardians?.results || [];
    }, [guardians?.results]);

    const currentPage = React.useMemo(() => {
        return guardians?.currentPage || 1;
    }, [guardians?.currentPage]);

    const pageSize = React.useMemo(() => {
        return guardians?.pageSize || 10;
    }, [guardians?.pageSize]);

    const totalDocuments = React.useMemo(() => {
        return guardians?.totalDocuments || 0;
    }, [guardians?.totalDocuments]);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentGuardian, setCurrentGuardian] = React.useState<Guardian | null>(null);
    const [guardianStudent, setGuardianStudent] = React.useState<GuardianStudent[]>([]);
    const handleEdit = (guardian: Guardian) => {
        setCurrentGuardian(guardian);

        if (guardianStudents && guardianStudents !== undefined) {
            const results = guardianStudents.filter(student => student.guardian_id === guardian._id);
            // console.log(results);
            setGuardianStudent(results);
        }
        // console.log(guardianStudent);
        setEditModalShow(true);
    };

    const handleDelete = (guardian: Guardian) => {
        setCurrentGuardian(guardian);
        setDeleteModalShow(true);
    };

    const handleSave = (newGuardian: Guardian) => {
        mutate("fetchGuardians");
        setAddModalShow(false);
    };

    const handleSaveEdit = () => {
        setEditModalShow(false);
        mutate("fetchGuardians");
    };

    const handleSaveDelete = async () => {
        if (!currentGuardian?._id) return;

        setDeleting(true);
        try {
            await deleteGuardianData(currentGuardian._id);
            setDeleteModalShow(false);
            mutate("fetchGuardians");
            toast.success("Deleted guardian successfully");
        } catch (error) {
            console.error("Error deleting guardian:", error);
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

    const columns: any = [
        {
            name: "Guardian Profile".toLocaleUpperCase(),
            cell: (row: Guardian) => (
                <LiveImageComponent url={row.guardian_profile_pic} />
            ),
            ignoreRowClick: true,
            // allowOverflow: true,
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
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(row)}
                        className="flex items-center"
                    >
                        <IconEdit className="w-4 h-4" />
                    </Button>
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
            allowOverflow: true,
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
                                Loading guardians...
                            </div>
                        </div>
                    }
                    disabled={isLoading}
                    customStyles={
                        {
                            rows: {
                                style: {
                                    minHeight: '0px',
                                },
                            },
                            headCells: {
                                style: {
                                    paddingLeft: '8px',
                                    paddingRight: '8px',
                                    fontWeight: 'light',
                                },
                            },
                        }
                    }
                    persistTableHead
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No guardians found"}
                        </div>
                    }
                />
            </DataTableExtensions>

            <EditGuardian
                students={students}
                guardianStudent={guardianStudent}
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
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                handleSave={handleSave}
            />
        </>
    );
}