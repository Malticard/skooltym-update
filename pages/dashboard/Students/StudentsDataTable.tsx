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
const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function StudentsDataTable({ students, handleUpdates, addModalShow, setAddModalShow, streams, loadingClasses, updatePage, classes }: { addModalShow: boolean; handleUpdates: () => void; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, streams: Stream[]; loadingClasses: boolean; classes: SchoolClass[]; updatePage: (value: number) => void; students: StudentsModel; }) {

    const [data, setData] = React.useState<StudentResult[]>(students.results);
    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(students.currentPage || 1);
    const [pageSize] = React.useState(students.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(students.totalDocuments || 0);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    const [currentStudent, setCurrentStudent] = React.useState<any>({});
    // Update the data when the students prop changes
    const columns: any = [
        {
            name: "Student Profile".toLocaleUpperCase(),
            cell: (row: StudentResult) => (<img className='m-2 rounded-full w-[3em] h-[3em]' src={row.student_profile_pic} width={50} height={50} alt='' />),
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
        }, {
            name: "Class".toLocaleUpperCase(),
            selector: (row: StudentResult) => [row._class.class_name],
            sortable: true
        },

        {
            name: "is HalfDay".toLocaleUpperCase(),
            selector: (row: StudentResult) => [row.isHalfDay ? ' Yes' : 'No'],
            sortable: true,
        },
        {
            name: "is Dropped".toLocaleUpperCase(),
            selector: (row: StudentResult) => [row.isDropped ? ' Yes' : ' No'],
            sortable: true
        },

        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: StudentResult) => (
                <>
                    <Button variant="primary" className='mx-1' size="sm" onClick={() => handleEdit(row)}><IconEdit className='text-sm w-5 h-5' /></Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(row)}><IconTrash className='text-sm w-5 h-5' /></Button>
                </>
            ),
            ignoreRowClick: true,
            button: true,
        }
    ];
    // Handle the "Edit" button click
    const handleEdit = (student: any) => {
        setCurrentStudent({
            _id: student._id,
            student_fname: student.student_fname,
            student_lname: student.student_lname,
            other_name: student.other_name,
            student_gender: student.student_gender,
            student_profile_pic: student.student_profile_pic,
            _class: student._class.class_name,
            stream: student.stream.stream_name,
            isVanStudent: student.isVanStudent,
            isHalfDay: student.isHalfDay,
        });
        setEditModalShow(true);  // Show the edit modal
    };
    // Handle the "Delete" button click
    const handleDelete = (data: StudentResult) => {
        setDeleteModalShow(true)
        setCurrentStudent(data);
    };
    // handle saving
    const handleSave = (dat: StudentResult) => {
        console.log("Save the changes for student", dat);
        setAddModalShow(false);
        setData([dat, ...data]);
    };
    // Handle saving the edited student (you can call an API here)
    const handleSaveEdit = () => {
        console.log("Save the changes for student", currentStudent);
        setEditModalShow(false);
        handleUpdates();
        // window.location.reload();

    }; // Handle saving the edited student (you can call an API here)
    const handleSaveDelete = () => {
        setDeleting(true);
        // console.log("Save the changes for student", currentStudent);
        deleteStudentData(currentStudent?._id as string).then((res) => {
            // Remove the student from the list
            setDeleteModalShow(false);
            setDeleting(false);
            handleUpdates();
        }).catch((err) => {
            setDeleting(false);
            console.log("error data", err);
            setDeleteModalShow(false);

        });

    };
    // Function to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };
    const tableDatas = {
        columns,
        data,
    };
    return (
        <>
            <DataTableExtensions {...tableDatas} >
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={handlePageChange}
                />
            </DataTableExtensions>
            {/* Modal for editing student */}
            <EditStudent classes={classes} streams={streams} loadingClasses={loadingClasses} editModalShow={editModalShow} studentData={currentStudent} setStudentData={setCurrentStudent} setEditModalShow={setEditModalShow} handleSaveEdit={handleSaveEdit} />
            {/* modal to handle deleting */}
            <DeleteStudent deleteModalShow={deleteModalShow} deleting={deleting} currentStudent={currentStudent} setDeleteModalShow={setDeleteModalShow} handleSaveDelete={handleSaveDelete} />
            {/* Student data */}
            <AddStudent loadingClasses={false} addModalShow={addModalShow} setAddModalShow={setAddModalShow} streams={streams} classes={classes} handleSave={handleSave} />
        </>
    );
}