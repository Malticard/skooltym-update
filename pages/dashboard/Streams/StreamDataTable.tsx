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

interface DataTableExtensionsProps {
    columns: any[];
    data: any[];
    exportHeaders?: boolean;
    filter?: boolean;
    print?: boolean;
    export?: boolean;
    children?: React.ReactNode;
}

interface StreamDataTableProps {
    streamData: PaginatedStreamResult;
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    handleUpdates: () => void;
}

const DataTableExtensions = dynamic<DataTableExtensionsProps>(
    () => import('react-data-table-component-extensions'),
    { ssr: false }
);

export default function StreamDataTable({
    streamData,
    addModalShow,
    setAddModalShow,
    updatePage,
    updateLimit,
    handleUpdates
}: StreamDataTableProps) {
    const router = useRouter();

    const [data, setData] = React.useState<Stream[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);
    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentStream, setCurrentStream] = React.useState<Stream | null>(null);

    React.useEffect(() => {
        if (streamData) {
            setData(streamData.results || []);
            setCurrentPage(streamData.currentPage || 1);
            setPageSize(streamData.pageSize || 10);
            setTotalDocuments(streamData.totalDocuments || 0);
        }
    }, [streamData]);

    const handleEdit = (stream: Stream) => {
        setCurrentStream(stream);
        setEditModalShow(true);
    };

    const handleDelete = (stream: Stream) => {
        setCurrentStream(stream);
        setDeleteModalShow(true);
    };

    const handleSave = (newStream: Stream) => {
        setData(prevData => [newStream, ...prevData]);
        setAddModalShow(false);
        toast.success("Stream added successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const handleSaveEdit = () => {
        setEditModalShow(false);
        handleUpdates();
        toast.success("Stream updated successfully", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    const handleSaveDelete = async () => {
        if (!currentStream?._id) return;

        setDeleting(true);
        try {
            await deleteStreamData(currentStream._id);
            setDeleteModalShow(false);
            handleUpdates();
            toast.success("Stream deleted successfully", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error deleting stream:", error);
            toast.error("Failed to delete stream", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setDeleting(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };

    const columns = [
        {
            name: "Stream".toLocaleUpperCase(),
            selector: (row: Stream) => row.stream_name,
            sortable: true
        },
        {
            name: "Actions".toLocaleUpperCase(),
            cell: (row: Stream) => (
                <div className="flex space-x-2">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(row)}
                        className="flex items-center"
                    >
                        <IconEdit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(row)}
                        className="flex items-center"
                    >
                        <IconTrash className="w-4 h-4" />
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        }
    ];

    const tableData: DataTableExtensionsProps = {
        columns,
        data,
        filter: true,
        export: true,
        print: true,
        exportHeaders: true
    };

    return (
        <>
            <DataTableExtensions {...tableData}>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={(page, tt) => handlePageChange(page)}
                    onChangeRowsPerPage={(limit, page) => updateLimit(limit)}
                    responsive
                    striped
                    fixedHeader
                    persistTableHead
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No streams found
                        </div>
                    }

                />
            </DataTableExtensions>

            <EditStream
                editModalShow={editModalShow}
                currentStream={currentStream}
                setCurrentStream={setCurrentStream}
                setEditModalShow={setEditModalShow}
                handleSaveEdit={handleSaveEdit}
            />

            <DeleteStream
                deleteModalShow={deleteModalShow}
                deleting={deleting}
                currentStream={currentStream}
                setDeleteModalShow={setDeleteModalShow}
                handleSaveDelete={handleSaveDelete}
            />

            <AddStream
                loadingClasses={false}
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                handleSave={handleSave}
            />
        </>
    );
}