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
    const { data: streams, error, mutate: mutateStream } = useSWR("fetchStream", () => fetchStream(page, limit));
    // console.log(streams);
    // Handle page change for pagination
    const onChangePage = async (newPage: number) => {
        setPage(newPage); // Set new page number
        const result = await fetchStream(newPage, limit);
        mutateStream(result); // Revalidate data on page change
    };
    const updates = async () => {
        const streams = await fetchStream(page, limit);
        mutateStream(streams);
    }
    // handle updated limit
    const updateLimit = async (lm: number) => {
        setLimit(lm);
        const streams = await fetchStream(page, limit);
        mutateStream(streams);
    }
    // if (streamLoading) return <LoaderComponent />;
    if (error) return <div>Error loading streams</div>;

    return (
        <div className='my-2'>
            <Seo title='Streams' />

            <PageHeader
                title='Streams'
                item='Skooltym'
                active_item='Streams'
                buttonText='Add Stream'
                onTap={() => setAddModalShow(true)}
            />
            {/* <b>{}</b> */}
            {!streams ? (<LoaderComponent />) : streams && (
                <StreamDataTable
                    addModalShow={addModalShow}
                    setAddModalShow={setAddModalShow}
                    updatePage={onChangePage}
                    updateLimit={updateLimit}
                    streamData={streams}
                    handleUpdates={updates}
                />
            )}
        </div>
    );
};

Streams.layout = "Contentlayout";
export default Streams;
