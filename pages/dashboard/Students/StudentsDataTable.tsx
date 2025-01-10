import { StudentResult, StudentsModel } from '@/interfaces/StudentsModel';
import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import EditStudent from './models/EditStudent';
import DeleteStudent from './models/DeleteStudent';
import { SchoolClass } from '@/interfaces/ClassModel';
import { Stream } from '@/interfaces/StreamModel';
import AddStudent from './models/AddStudent';
import { deleteStudentData } from '@/utils/data_fetch';
import LiveImageComponent from '../components/LiveImageComponent';
const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function StudentsDataTable({
    students = { results: [], currentPage: 1, pageSize: 10, totalDocuments: 0, totalPages: 0 }, // Add default value
    handleUpdates,
    addModalShow,
    setAddModalShow,
    streams = [], // Add default value
    loadingClasses = false, // Add default value
    updatePage,
    updateLimit,
    classes = [] // Add default value
}: {
    students?: StudentsModel; // Make optional
    handleUpdates: () => void;
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    streams: Stream[];
    loadingClasses: boolean;
    classes: SchoolClass[];
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
}) {
    const [data, setData] = React.useState<StudentResult[]>(students?.results || []);
    const [currentPage, setCurrentPage] = React.useState(students?.currentPage || 1);
    const [pageSize] = React.useState(students?.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(students?.totalDocuments || 0);
    const [editModalShow, setEditModalShow] = React.useState(false);
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
        handleUpdates();
    };

    const handleSaveEdit = () => {
        setEditModalShow(false);
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
                    noHeader={false}
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={(page, total) => handlePageChange(page)}
                    onChangeRowsPerPage={(page, rows) => updateLimit(page)}
                    progressPending={deleting}
                />
            </DataTableExtensions>

            <EditStudent
                classes={classes}
                streams={streams}
                loadingClasses={loadingClasses}
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
                loadingClasses={loadingClasses}
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                streams={streams}
                classes={classes}
                handleSave={handleSave}
            />
        </>
    );
}