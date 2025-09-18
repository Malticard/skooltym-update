import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import EditClass from './models/EditClass';
import DeleteClass from './models/DeleteClass';
import { deleteClassData } from '@/utils/data_fetch';
import { ClassResponse, SchoolClass } from '@/interfaces/ClassesModel';
import { Stream } from '@/interfaces/StreamModel';
import AddClass from './models/AddClass';
import { mutate } from 'swr';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

interface ClassDataTableProps {
    classData: ClassResponse | null;
    handleUpdates: () => void;
    streams: Stream[];
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    loadingClasses: boolean;
    updatePage: (value: number) => void;
    updateRows: (value: number) => void;
    isLoading?: boolean;
}

export default function ClassDataTable({
    classData,
    handleUpdates,
    addModalShow,
    streams,
    setAddModalShow,
    loadingClasses,
    updatePage,
    updateRows,
    isLoading = false
}: ClassDataTableProps) {
    // Use useMemo for derived state to avoid unnecessary re-renders
    const data = React.useMemo(() => {
        return classData?.results || [];
    }, [classData?.results]);

    const currentPage = React.useMemo(() => {
        return classData?.currentPage || 1;
    }, [classData?.currentPage]);

    const pageSize = React.useMemo(() => {
        return classData?.pageSize || 10;
    }, [classData?.pageSize]);

    const totalDocuments = React.useMemo(() => {
        return classData?.totalDocuments || 0;
    }, [classData?.totalDocuments]);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentClass, setCurrentClass] = React.useState<SchoolClass>({} as SchoolClass);


    const columns = [
        {
            name: "Class".toLocaleUpperCase(),
            selector: (row: SchoolClass) => row.class_name ?? '',
            sortable: true
        },
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: SchoolClass) => (
                <div className="flex gap-1">
                    <Button
                        variant="outline-primary"
                        className="mx-1"
                        size="sm"
                        onClick={() => handleEdit(row)}
                    >
                        <IconEdit className="text-sm w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(row)}
                    >
                        <IconTrash className="text-sm w-5 h-5" />
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
        }
    ];

    const handleEdit = (classItem: SchoolClass) => {
        setCurrentClass(classItem);
        setEditModalShow(true);
    };

    const handleDelete = (classItem: SchoolClass) => {
        setDeleteModalShow(true);
        setCurrentClass(classItem);
    };

    const handleSave = (newClass: SchoolClass) => {
        setAddModalShow(false);
        mutate("fetchClasses");
    };

    const handleSaveEdit = () => {
        setEditModalShow(false);

        mutate("fetchClasses");
    };

    const handleSaveDelete = async () => {
        if (!currentClass?._id) return;

        setDeleting(true);
        try {
            await deleteClassData(currentClass._id);
            setDeleteModalShow(false);
            mutate("fetchClasses");
        } catch (error) {
            console.error("Error deleting class:", error);
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
            updateRows(newPerPage);
        }
    }, [pageSize, updateRows, isLoading]);

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
                                Loading classes...
                            </div>
                        </div>
                    }
                    disabled={isLoading}
                    paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                    paginationComponentOptions={{
                        noRowsPerPage: false,
                        rowsPerPageText: 'Rows per page:',
                        rangeSeparatorText: 'of',
                        selectAllRowsItem: true,
                        selectAllRowsItemText: 'All',
                    }}
                    persistTableHead
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No classes found"}
                        </div>
                    }
                />
            </DataTableExtensions>

            <EditClass
                streams={streams}
                loadingClasses={loadingClasses}
                editModalShow={editModalShow}
                currentClass={currentClass}
                setCurrentClass={setCurrentClass}
                setEditModalShow={setEditModalShow}
                handleSaveEdit={handleSaveEdit}
            />

            <DeleteClass
                deleteModalShow={deleteModalShow}
                deleting={deleting}
                currentClass={currentClass}
                setDeleteModalShow={setDeleteModalShow}
                handleSaveDelete={handleSaveDelete}
            />

            <AddClass
                loadingClasses={false}
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                handleSave={handleSave}
                streams={streams}
            />
        </div>
    );
}