import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import EditStream from './models/EditStream';
import DeleteStream from './models/DeleteStream';
import { deleteStreamData } from '@/utils/data_fetch';
import AddStream from './models/AddStream';
import { PaginatedStreamResult, Stream } from '@/interfaces/StreamModel';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';


const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function StreamDataTable({ streamData, handleUpdates, addModalShow, setAddModalShow, updatePage }: { handleUpdates: () => void; addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, updatePage: (value: number) => void; streamData: PaginatedStreamResult; }) {
    const navigate = useRouter();
    const [data, setData] = React.useState<Stream[]>(streamData.results);
    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(streamData.currentPage || 1);
    const [pageSize] = React.useState(streamData.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(streamData.totalDocuments || 0);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentStream, setCurrentStream] = React.useState<Stream | null>(null);
    // Update the data when the students prop changes
    const columns: any = [
        {
            name: "Stream".toLocaleUpperCase(),
            selector: (row: Stream) => [row.stream_name],
            sortable: true
        },
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: Stream) => (
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
    const handleEdit = (student: Stream) => {
        setCurrentStream(student);
        setEditModalShow(true);  // Show the edit modal
    };
    // Handle the "Delete" button click
    const handleDelete = (data: Stream) => {
        setDeleteModalShow(true)
        setCurrentStream(data);

    };
    // handle saving
    const handleSave = (dat: Stream) => {
        toast.info("Save the changes for stream", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,

        });
        setAddModalShow(false);
        setData([dat, ...data]);
    };
    // Handle saving the edited student (you can call an API here)
    const handleSaveEdit = () => {
        console.log("Save the changes for student", currentStream);
        setEditModalShow(false);
        handleUpdates();
        // window.location.reload();

    }; // Handle saving the edited student (you can call an API here)
    const handleSaveDelete = () => {
        setDeleting(true);
        // console.log("Save the changes for student", currentStudent);
        deleteStreamData(currentStream?._id as string).then((res) => {
            // Remove the student from the list
            setDeleteModalShow(false);
            setDeleting(false);
            handleUpdates();
            // navigate.reload();
        }).catch((err) => {
            setDeleting(false);
            console.log("error data", err);
            setDeleteModalShow(false);
            handleUpdates();
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
            <EditStream editModalShow={editModalShow} currentStream={currentStream} setCurrentStream={setCurrentStream} setEditModalShow={setEditModalShow} handleSaveEdit={handleSaveEdit} />
            {/* modal to handle deleting */}
            <DeleteStream deleteModalShow={deleteModalShow} deleting={deleting} currentStream={currentStream} setDeleteModalShow={setDeleteModalShow} handleSaveDelete={handleSaveDelete} />
            {/* Student data */}
            <AddStream loadingClasses={false} addModalShow={addModalShow} setAddModalShow={setAddModalShow} handleSave={handleSave} />
        </>

    );
}