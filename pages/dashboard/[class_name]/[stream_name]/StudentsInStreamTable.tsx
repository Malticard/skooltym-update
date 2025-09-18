import { StudentResult, StudentsModel } from '@/interfaces/StudentsModel';
import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
// import EditStudent from './models/EditStudent';
import { SchoolClass } from '@/interfaces/ClassModel';
import { Stream } from '@/interfaces/StreamModel';

import { deleteStudentData } from '@/utils/data_fetch';
import DeleteStudent from '../../Students/models/DeleteStudent';
import LiveImageComponent from '../../components/LiveImageComponent';
const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function StudentsInStreamTable({
    students = { results: [], currentPage: 1, pageSize: 10, totalDocuments: 0, totalPages: 0 }, // Add default value
    handleUpdates,
    updatePage,
    updateLimit,
    isLoading = false
}: {
    students?: StudentsModel; // Make optional
    handleUpdates: () => void;
    updateLimit: (value: number) => void;
    updatePage: (value: number) => void;
    isLoading?: boolean;
}) {
    // Use useMemo for derived state to avoid unnecessary re-renders
    const data = React.useMemo(() => {
        return students?.results || [];
    }, [students?.results]);

    const currentPage = React.useMemo(() => {
        return students?.currentPage || 1;
    }, [students?.currentPage]);

    const pageSize = React.useMemo(() => {
        return students?.pageSize || 10;
    }, [students?.pageSize]);

    const totalDocuments = React.useMemo(() => {
        return students?.totalDocuments || 0;
    }, [students?.totalDocuments]);
    // const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [currentStudent, setCurrentStudent] = React.useState<any>({});


    const columns: any = [
        {
            name: "Student Profile".toLocaleUpperCase(),
            cell: (row: StudentResult) => (
                <LiveImageComponent url={row.student_profile_pic} />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "First Name".toLocaleUpperCase(),
            selector: (row: StudentResult) => [row.student_fname],
            sortable: true
        },
        {
            name: "Last Name".toLocaleUpperCase(),
            selector: (row: StudentResult) => [row.student_lname],
            sortable: true
        },
        {
            name: "Class".toLocaleUpperCase(),
            selector: (row: StudentResult) => [row._class?.class_name || 'N/A'],
            sortable: true
        },
        {
            name: "Nature".toLocaleUpperCase(),
            selector: (row: StudentResult) => [row.isHalfDay ? 'Half Day Student' : 'Full Day Student'],
            sortable: true,
        },
        // {
        //     name: "is Dropped".toLocaleUpperCase(),
        //     selector: (row: StudentResult) => [row.isDropped ? 'Yes' : 'No'],
        //     sortable: true
        // },
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: StudentResult) => (
                <>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(row)}
                        disabled={deleting}
                    >
                        <IconTrash className='text-sm w-5 h-5' />
                    </Button>
                </>
            ),
            ignoreRowClick: true,
            button: true,
        }
    ];

    const handleEdit = (student: StudentResult) => {
        setCurrentStudent({
            _id: student._id,
            student_fname: student.student_fname,
            student_lname: student.student_lname,
            other_name: student.other_name,
            student_gender: student.student_gender,
            student_profile_pic: student.student_profile_pic,
            _class: student._class?.class_name,
            stream: student.stream?.stream_name,
            isVanStudent: student.isVanStudent,
            isHalfDay: student.isHalfDay,
        });
        // setEditModalShow(true);
    };

    const handleDelete = (data: StudentResult) => {
        setDeleteModalShow(true);
        setCurrentStudent(data);
    };

    const handleSave = (dat: StudentResult) => {
        handleUpdates();
    };

    const handleSaveEdit = () => {
        // setEditModalShow(false);
        handleUpdates();
    };

    const handleSaveDelete = async () => {
        setDeleting(true);
        setError(null);

        try {
            await deleteStudentData(currentStudent?._id as string);
            setDeleteModalShow(false);
            handleUpdates();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while deleting the student');
            console.error("Error deleting student:", err);
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

    if (error) {
        return (
            <div className="text-red-500 p-4 text-center">
                Error: {error}
                <Button
                    variant="link"
                    className="ml-2"
                    onClick={() => setError(null)}
                >
                    Dismiss
                </Button>
            </div>
        );
    }

    const tableDatas = {
        columns,
        data,
    };

    return (
        <>
            <DataTableExtensions {...tableDatas}>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    pointerOnHover
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    progressPending={isLoading || deleting}
                    progressComponent={
                        <div className="p-4 text-center">
                            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white transition ease-in-out duration-150">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading students...
                            </div>
                        </div>
                    }
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No student records found"}
                        </div>
                    }
                    disabled={isLoading || deleting}
                    persistTableHead
                />
            </DataTableExtensions>


            <DeleteStudent
                deleteModalShow={deleteModalShow}
                deleting={deleting}
                currentStudent={currentStudent}
                setDeleteModalShow={setDeleteModalShow}
                handleSaveDelete={handleSaveDelete}
            />

        </>
    );
}