import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchStream } from '@/utils/data_fetch';
import StreamDataTable from './StreamDataTable';
import LoaderComponent from '@/pages/components/LoaderComponent';
import useSWR from 'swr';

const Streams = () => {
    const [addModalShow, setAddModalShow] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);


    // Fetch streams with SWR and dynamic pagination
    const { data: streams, error, mutate: mutateStream, isValidating } = useSWR(
        [page, limit], 
        () => fetchStream(page, limit)
    );
    // console.log(streams);
    // Handle page change for pagination
    const onChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidating) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidating]);
    const updates = React.useCallback(() => {
        mutateStream(); // Re-fetch data after update
    }, [mutateStream]);
    // handle updated limit
    const updateLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isValidating) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isValidating]);
    // if (streamLoading) return <LoaderComponent />;
    if (error) return <div>Error loading streams</div>;

    return (
        <div className='my-2'>
            <Seo title='Streams' />

            <PageHeader
                title={`Streams (${streams?.totalDocuments ?? 0})`}
                item='Skooltym'
                active_item='Streams'
                buttonText='Add Stream'
                onTap={() => setAddModalShow(true)}
                dataTour='add-stream'
            />
            {/* <b>{}</b> */}
            <StreamDataTable
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                updatePage={onChangePage}
                updateLimit={updateLimit}
                streamData={streams || null}
                handleUpdates={updates}
                isLoading={isValidating}
            />
        </div>
    );
};

Streams.layout = "Contentlayout";
export default Streams;
