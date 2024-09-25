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

export default function ClassDataTable({ classData, handleUpdates, addModalShow, streams, setAddModalShow, loadingClasses, updatePage, updateRows }: { handleUpdates: () => void; streams: Stream[], addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, loadingClasses: boolean; updatePage: (value: number) => void; updateRows: (value: number) => void; classData: ClassResponse; }) {
    console.log(classData.results)
    const [data, setData] = React.useState<SchoolClass[]>(classData.results);
    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(classData.currentPage || 1);
    const [pageSize] = React.useState(classData.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(classData.totalDocuments || 0);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentClass, setCurrentClass] = React.useState<SchoolClass | null>(null);
    // Update the data when the students prop changes
    const columns: any = [
        {
            name: "Class".toLocaleUpperCase(),
            selector: (row: SchoolClass) => [row.class_name],
            sortable: true
        },

        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: SchoolClass) => (
                <>
                    <Button variant="primary" className='mx-1' size="sm" onClick={() => handleEdit(row)}><IconEdit className='text-sm w-5 h-5' /></Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(row)}><IconTrash className='text-sm w-5 h-5' /></Button>
                </>
            ),
            ignoreRowClick: true,
            // button: true,
        }
    ];
    // Handle the "Edit" button click
    const handleEdit = (student: SchoolClass) => {
        setCurrentClass(student);
        setEditModalShow(true);  // Show the edit modal
    };
    // Handle the "Delete" button click
    const handleDelete = (data: SchoolClass) => {
        setDeleteModalShow(true)
        setCurrentClass(data);
    };
    // handle saving
    const handleSave = (dat: SchoolClass) => {
        console.log("Save the changes for student", dat);
        setAddModalShow(false);
        setData([dat, ...data]);
        handleUpdates();
    };
    // Handle saving the edited student (you can call an API here)
    const handleSaveEdit = () => {
        console.log("Save the changes for student", currentClass);
        setEditModalShow(false);
        handleUpdates();
        // window.location.reload();

    }; // Handle saving the edited student (you can call an API here)
    const handleSaveDelete = () => {
        setDeleting(true);
        // console.log("Save the changes for student", currentStudent);
        deleteClassData(currentClass?._id as string).then((res) => {
            // Remove the student from the list
            setDeleteModalShow(false);
            setDeleting(false);
            // window.location.reload();
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
                    paginationTotalRows={totalDocuments} // total records in the dataset
                    paginationDefaultPage={currentPage} // current page being viewed
                    paginationPerPage={pageSize} // number of records per page
                    onChangePage={handlePageChange} // handler to change pages
                    onChangeRowsPerPage={updateRows} // handler for changing rows per page
                    paginationRowsPerPageOptions={[10, 25, 50, 100]} // options for rows per page
                    paginationComponentOptions={{
                        noRowsPerPage: false, // to show rows per page selector
                        rowsPerPageText: 'Rows per page:', // customize label
                        rangeSeparatorText: 'of', // customize range text
                        selectAllRowsItem: true, // include "All" option
                        selectAllRowsItemText: 'All', // label for the "All" option
                    }}
                />

            </DataTableExtensions>
            {/* Modal for editing student */}
            <EditClass streams={streams} loadingClasses={loadingClasses} editModalShow={editModalShow} currentClass={currentClass} setCurrentClass={setCurrentClass} setEditModalShow={setEditModalShow} handleSaveEdit={handleSaveEdit} />
            {/* modal to handle deleting */}
            <DeleteClass deleteModalShow={deleteModalShow} deleting={deleting} currentClass={currentClass} setDeleteModalShow={setDeleteModalShow} handleSaveDelete={handleSaveDelete} />
            {/* Student data */}
            <AddClass loadingClasses={false} addModalShow={addModalShow} setAddModalShow={setAddModalShow} handleSave={handleSave} streams={streams} />
        </>

    );
}