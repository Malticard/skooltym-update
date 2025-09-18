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
import { mutate } from 'swr';

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
    streamData: PaginatedStreamResult | null;
    addModalShow: boolean;
    setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>;
    updatePage: (value: number) => void;
    updateLimit: (value: number) => void;
    handleUpdates: () => void;
    isLoading?: boolean;
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
    handleUpdates,
    isLoading = false
}: StreamDataTableProps) {
    const router = useRouter();

    // Use useMemo for derived state to avoid unnecessary re-renders
    const data = React.useMemo(() => {
        return streamData?.results || [];
    }, [streamData?.results]);

    const currentPage = React.useMemo(() => {
        return streamData?.currentPage || 1;
    }, [streamData?.currentPage]);

    const pageSize = React.useMemo(() => {
        return streamData?.pageSize || 10;
    }, [streamData?.pageSize]);

    const totalDocuments = React.useMemo(() => {
        return streamData?.totalDocuments || 0;
    }, [streamData?.totalDocuments]);

    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [currentStream, setCurrentStream] = React.useState<Stream | null>(null);

    const handleEdit = (stream: Stream) => {
        setCurrentStream(stream);
        setEditModalShow(true);
    };

    const handleDelete = (stream: Stream) => {
        setCurrentStream(stream);
        setDeleteModalShow(true);
    };

    const handleSave = (newStream: Stream) => {
        setAddModalShow(false);
        mutate("fetchStreams");
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
            mutate("fetchStreams");
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
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    progressPending={isLoading}
                    progressComponent={
                        <div className="p-4 text-center">
                            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white transition ease-in-out duration-150">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading streams...
                            </div>
                        </div>
                    }
                    disabled={isLoading}
                    responsive
                    striped
                    fixedHeader
                    persistTableHead
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            {isLoading ? "Loading..." : "No streams found"}
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