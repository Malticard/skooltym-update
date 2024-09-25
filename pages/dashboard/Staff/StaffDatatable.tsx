import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import EditStaff from './models/EditStaff';
import DeleteStudent from './models/DeleteStudent';
import { deleteStaffData } from '@/utils/data_fetch';
import { Staff, StaffResponse } from '@/interfaces/StaffModel';
import { Role } from '@/interfaces/RolesModel';
import AddStaff from './models/AddStaff';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function StaffDataTable({ staff, handleUpdates, addModalShow, roles, setAddModalShow, loadingClasses, updatePage }: { handleUpdates: () => void; roles: Role[], addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, loadingClasses: boolean; updatePage: (value: number) => void; staff: StaffResponse; }) {
    const [data, setData] = React.useState<Staff[]>(staff.results);
    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(staff.currentPage || 1);
    const [pageSize] = React.useState(staff.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(staff.totalDocuments || 0);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    const [currentStaff, setCurrentStaff] = React.useState<Staff>({} as Staff);

    // Update the data when the students prop changes
    const columns: any = [
        {
            name: "Staff Profile".toLocaleUpperCase(),
            cell: (row: Staff) => (<img className='m-2 rounded-full w-[3em] h-[3em]' src={row.staff_profilePic} width={50} height={50} alt='' />),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "First Name".toLocaleUpperCase(),
            selector: (row: Staff) => [row.staff_fname],
            sortable: true
        },
        {
            name: "Last Name".toLocaleUpperCase(),
            selector: (row: Staff) => [row.staff_lname],
            sortable: true
        }, {
            name: "role".toLocaleUpperCase(),
            selector: (row: Staff) => [row.staff_role.role_type],
            sortable: true
        },
        {
            name: "staff contact".toLocaleUpperCase(),
            selector: (row: Staff) => [row.staff_contact],
            sortable: true
        },
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: Staff) => (
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
    const handleEdit = (staff: Staff) => {
        setCurrentStaff(
            staff
        );
        setEditModalShow(true);  // Show the edit modal
    };
    // Handle the "Delete" button click
    const handleDelete = (data: Staff) => {
        setDeleteModalShow(true)
        setCurrentStaff(data);
    };
    // handle saving
    const handleSave = (dat: Staff) => {
        // console.log("Save the changes for student", dat);
        setAddModalShow(false);
        setData([dat, ...data]);
        // handleUpdates();
    };
    // Handle saving the edited student (you can call an API here)
    const handleSaveEdit = () => {
        console.log("Save the changes for student", currentStaff);
        setEditModalShow(false);
        handleUpdates();

    }; // Handle saving the edited student (you can call an API here)
    const handleSaveDelete = () => {
        setDeleting(true);
        // console.log("Save the changes for student", currentStudent);
        deleteStaffData(currentStaff?._id as string).then((res) => {
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
            <EditStaff roles={roles} loadingClasses={loadingClasses} editModalShow={editModalShow} currentStaff={currentStaff} setCurrentStaff={setCurrentStaff} setEditModalShow={setEditModalShow} handleSaveEdit={handleSaveEdit} />
            {/* modal to handle deleting */}
            <DeleteStudent deleteModalShow={deleteModalShow} deleting={deleting} currentStaff={currentStaff} setDeleteModalShow={setDeleteModalShow} handleSaveDelete={handleSaveDelete} />
            {/* Student data */}
            <AddStaff loadingClasses={false} addModalShow={addModalShow} setAddModalShow={setAddModalShow} handleSave={handleSave} roles={roles} />
        </>

    );
}