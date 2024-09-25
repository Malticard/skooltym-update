import React from 'react';
import LoaderComponent from '@/pages/components/LoaderComponent';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import DropOffDataTable from './DropOffDataTable';
import { fetchDropOffs } from '@/utils/data_fetch';
import useSWR from 'swr';

const DropOffs = () => {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Use SWR for fetching drop-offs with dynamic pagination
    const { data: dropOffs, error, isValidating } = useSWR([page, rowsPerPage], () => fetchDropOffs(page, rowsPerPage), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        dedupingInterval: 5000,
        onError: (err) => console.error('Error fetching drop-offs:', err)
    });

    // Handle page change
    const onChangePage = (newPage: number) => {
        setPage(newPage); // SWR will automatically refetch when the page changes
    };

    // Handle rows per page change
    const onChangeRowsPerPage = (newPage: number, newRowsPerPage: number) => {
        setPage(newPage);
        setRowsPerPage(newRowsPerPage); // SWR will automatically refetch when rowsPerPage changes
    };

    if (isValidating) return <LoaderComponent />;
    if (error) return <div>Error loading drop-offs: {error.message}</div>;

    return (
        <>
            <Seo title="DropOffs" />
            <PageHeader title="Drop Offs" item="Skooltym" active_item="Drop Offs" />
            {dropOffs && (
                <DropOffDataTable
                    dropOffData={dropOffs}
                    updatePage={onChangePage}
                // updateRows={onChangeRowsPerPage}
                />
            )}
        </>
    );
};

DropOffs.layout = "Contentlayout";
export default DropOffs;
