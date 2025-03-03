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
}: {
    students?: StudentsModel; // Make optional
    handleUpdates: () => void;
    updateLimit: (value: number) => void;
    updatePage: (value: number) => void;
}) {
    const [data, setData] = React.useState<StudentResult[]>(students?.results || []);
    const [currentPage, setCurrentPage] = React.useState(students?.currentPage || 1);
    const [pageSize] = React.useState(students?.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(students?.totalDocuments || 0);
    // const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [currentStudent, setCurrentStudent] = React.useState<any>({});

    // Update state when students prop changes
    React.useEffect(() => {
        if (students) {
            setData(students.results || []);
            setCurrentPage(students.currentPage || 1);
            setTotalDocuments(students.totalDocuments || 0);
        }
    }, [students]);

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

        setData([dat, ...data]);
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };

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
                    onChangePage={(page, total) => handlePageChange(page)}
                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                        updateLimit(currentRowsPerPage);
                    }}
                    progressPending={deleting}
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