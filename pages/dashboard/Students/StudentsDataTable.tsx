import { StudentResult, StudentsModel } from '@/interfaces/StudentsModel';
import React from 'react';
import DataTable from 'react-data-table-component';
import { Badge, Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import EditStudent from './models/EditStudent';
import DeleteStudent from './models/DeleteStudent';
import { SchoolClass } from '@/interfaces/ClassModel';
import { Stream } from '@/interfaces/StreamModel';
import AddStudent from './models/AddStudent';
import { deleteStudentData } from '@/utils/data_fetch';
import LiveImageComponent from '../components/LiveImageComponent';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function StudentsDataTable({
    students = { results: [], currentPage: 1, pageSize: 10, totalDocuments: 0, totalPages: 0 }, // Add default value
    handleUpdates,
    addModalShow,
    setAddModalShow,
    updatePage,
    updateLimit,
    classes = [] // Add default value
}: {
    students?: StudentsModel; // Make optional
    handleUpdates: () => void;
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    classes: SchoolClass[];
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}) {
    const [data, setData] = React.useState<StudentResult[]>(students?.results || []);
    const [editModalShow, setEditModalShow] = React.useState(false);
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
            // allowOverflow: true,
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
            cell: (row: StudentResult) => (
                <>
                    {row.isHalfDay ? <Badge bg='primary'>Half Day</Badge> : <Badge bg='secondary'>Full Day</Badge>}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {row.isVanStudent && <Badge bg='success'>Van</Badge>}
                </>),
            sortable: true,
        },
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: StudentResult) => (
                <>
                    <Button
                        variant="outline-primary"
                        className='mx-1'
                        size="sm"
                        onClick={() => handleEdit(row)}
                        disabled={deleting}
                    >
                        <IconEdit className='text-sm w-5 h-5' />
                    </Button>
                    <Button
                        variant="outline-danger"
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
        setEditModalShow(true);
    };

    const handleDelete = (data: StudentResult) => {
        setDeleteModalShow(true);
        setCurrentStudent(data);
    };

    const handleSave = (dat: StudentResult) => {
        setAddModalShow(false);
        setData([dat, ...data]);
        mutate("fetchStudents");
    };

    const handleSaveEdit = () => {
        setEditModalShow(false);
        toast.success("Student data updated successfully");
        mutate("fetchStudents");
    };

    const handleSaveDelete = async () => {
        setDeleting(true);
        setError(null);

        try {
            await deleteStudentData(currentStudent?._id as string);
            setDeleteModalShow(false);
            toast.success("Student deleted successfully");
            mutate("fetchStudents");
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while deleting the student');
            toast.error("Error deleting student");
        } finally {
            setDeleting(false);
        }
    };

    const handlePageChange = (page: number) => {
        // setCurrentPage(page);
        updatePage(page);
        mutate("fetchStudents");
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
                    paginationServer
                    paginationTotalRows={students.totalDocuments}
                    paginationDefaultPage={students.currentPage}
                    paginationPerPage={students.pageSize}
                    paginationRowsPerPageOptions={[5, 10, 15, 30, 50, 100]}
                    onChangePage={(page, total) => handlePageChange(page)}
                    onChangeRowsPerPage={(page, rows) => updateLimit(page)}
                    progressPending={deleting}
                    persistTableHead
                />
            </DataTableExtensions>

            <EditStudent
                classes={classes}

                editModalShow={editModalShow}
                studentData={currentStudent}
                setStudentData={setCurrentStudent}
                setEditModalShow={setEditModalShow}
                handleSaveEdit={handleSaveEdit}
            />

            <DeleteStudent
                deleteModalShow={deleteModalShow}
                deleting={deleting}
                currentStudent={currentStudent}
                setDeleteModalShow={setDeleteModalShow}
                handleSaveDelete={handleSaveDelete}
            />

            <AddStudent
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                classes={classes}
                handleSave={handleSave}
            />
        </>
    );
}