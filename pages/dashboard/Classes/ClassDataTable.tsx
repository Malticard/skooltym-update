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

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

interface ClassDataTableProps {
    classData: ClassResponse;
    handleUpdates: () => void;
    streams: Stream[];
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    loadingClasses: boolean;
    updatePage: (value: number) => void;
    updateRows: (value: number) => void;
}

export default function ClassDataTable({
    classData,
    handleUpdates,
    addModalShow,
    streams,
    setAddModalShow,
    loadingClasses,
    updatePage,
    updateRows
}: ClassDataTableProps) {
    // Provide default values when classData is undefined
    const defaultData: ClassResponse = {
        results: [],
        currentPage: 1,
        pageSize: 10,
        totalDocuments: 0,
        totalPages: 0
    };

    // Use nullish coalescing to handle undefined classData
    const safeData = classData ?? defaultData;

    const [data, setData] = React.useState<SchoolClass[]>(safeData.results);
    const [currentPage, setCurrentPage] = React.useState(safeData.currentPage);
    const [pageSize] = React.useState(safeData.pageSize);
    const [totalDocuments, setTotalDocuments] = React.useState(safeData.totalDocuments);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentClass, setCurrentClass] = React.useState<SchoolClass | null>(null);

    // Update state when classData changes
    React.useEffect(() => {
        if (classData) {
            setData(classData.results);
            setCurrentPage(classData.currentPage);
            setTotalDocuments(classData.totalDocuments);
        }
    }, [classData]);

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
                        variant="primary"
                        className="mx-1"
                        size="sm"
                        onClick={() => handleEdit(row)}
                    >
                        <IconEdit className="text-sm w-5 h-5" />
                    </Button>
                    <Button
                        variant="danger"
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
        setData(prevData => [newClass, ...prevData]);
        handleUpdates();
    };

    const handleSaveEdit = () => {
        setEditModalShow(false);
        handleUpdates();
    };

    const handleSaveDelete = async () => {
        if (!currentClass?._id) return;

        setDeleting(true);
        try {
            await deleteClassData(currentClass._id);
            setDeleteModalShow(false);
            handleUpdates();
        } catch (error) {
            console.error("Error deleting class:", error);
        } finally {
            setDeleting(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };

    const tableData = {
        columns,
        data,
    };

    if (loadingClasses) {
        return <div className="p-4 text-center">Loading...</div>;
    }

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
                    onChangeRowsPerPage={updateRows}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    paginationComponentOptions={{
                        noRowsPerPage: false,
                        rowsPerPageText: 'Rows per page:',
                        rangeSeparatorText: 'of',
                        selectAllRowsItem: true,
                        selectAllRowsItemText: 'All',
                    }}
                    noDataComponent={<div className="p-4">No classes found</div>}
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