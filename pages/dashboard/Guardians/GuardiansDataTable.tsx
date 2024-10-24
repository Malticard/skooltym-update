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

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function GuardianDataTable({ guardians, addModalShow, students, setAddModalShow, loadingClasses, updatePage }: { students: StudentsNotPaginated[], addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, loadingClasses: boolean; updatePage: (value: number) => void; guardians: GuardianResponse; }) {

    const [data, setData] = React.useState<Guardian[]>(guardians.results);
    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(guardians.currentPage || 1);
    const [pageSize] = React.useState(guardians.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(guardians.totalDocuments || 0);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentGuardian, setCurrentGuardian] = React.useState<Guardian | null>(null);
    // Update the data when the students prop changes
    const columns: any = [
        {
            name: "Guardian Profile".toLocaleUpperCase(),
            cell: (row: Guardian) => (<img className='m-2 rounded-full w-[3em] h-[3em]' src={row.guardian_profile_pic} width={50} height={50} alt='' />),
            ignoreRowClick: true,
            allowoverflow: true,
        },
        {
            name: "First Name".toLocaleUpperCase(),
            selector: (row: Guardian) => [row.guardian_fname],
            sortable: true
        },
        {
            name: "Last Name".toLocaleUpperCase(),
            selector: (row: Guardian) => [row.guardian_lname],
            sortable: true
        }, {
            name: "Relationship".toLocaleUpperCase(),
            selector: (row: Guardian) => [row.relationship],
            sortable: true
        },
        {
            name: "Contact".toLocaleUpperCase(),
            selector: (row: Guardian) => [row.guardian_contact],
            sortable: true
        },
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: Guardian) => (
                <>
                    <Button variant="primary" className='mx-1' size="sm" onClick={() => handleEdit(row)}><IconEdit className='text-sm w-5 h-5' /></Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(row)}><IconTrash className='text-sm w-5 h-5' /></Button>
                </>
            ),
            ignoreRowClick: true,
            button: "true",
        }
    ];
    // Handle the "Edit" button click
    const handleEdit = (student: Guardian) => {
        setCurrentGuardian(student);
        setEditModalShow(true);  // Show the edit modal
    };
    // Handle the "Delete" button click
    const handleDelete = (data: Guardian) => {
        setDeleteModalShow(true)
        setCurrentGuardian(data);
    };
    // handle saving
    const handleSave = (dat: Guardian) => {
        console.log("Save the changes for student", dat);
        setAddModalShow(false);
        setData([dat, ...data]);
    };
    // Handle saving the edited student (you can call an API here)
    const handleSaveEdit = () => {
        console.log("Save the changes for student", currentGuardian);
        setEditModalShow(false);
        // window.location.reload();

    }; // Handle saving the edited student (you can call an API here)
    const handleSaveDelete = () => {
        setDeleting(true);
        // console.log("Save the changes for student", currentStudent);
        deleteGuardianData(currentGuardian?._id as string).then((res) => {
            // Remove the student from the list
            setDeleteModalShow(false);
            setDeleting(false);
            window.location.reload();
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
            <EditGuardian students={students} loadingClasses={loadingClasses} editModalShow={editModalShow} currentGuardian={currentGuardian} setCurrentGuardian={setCurrentGuardian} setEditModalShow={setEditModalShow} handleSaveEdit={handleSaveEdit} />
            {/* modal to handle deleting */}
            <DeleteStudent deleteModalShow={deleteModalShow} deleting={deleting} currentGuardian={currentGuardian} setDeleteModalShow={setDeleteModalShow} handleSaveDelete={handleSaveDelete} />
            {/* Student data */}
            <AddGuardian loadingClasses={false} addModalShow={addModalShow} setAddModalShow={setAddModalShow} handleSave={handleSave} students={students} />
        </>

    );
}