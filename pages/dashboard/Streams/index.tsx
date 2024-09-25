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

    // Fetch streams with SWR and dynamic pagination
    const { data: streams, error, mutate: mutateStream } = useSWR(['fetchStream', page], () => fetchStream(page));
    // console.log(streams);
    // Handle page change for pagination
    const onChangePage = (newPage: number) => {
        setPage(newPage); // Set new page number
        mutateStream(); // Revalidate data on page change
    };
    const updates = async () => {
        const streams = fetchStream();
        mutateStream(streams, false)
    }

    // if (streamLoading) return <LoaderComponent />;
    if (error) return <div>Error loading streams</div>;

    return (
        <div>
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
                    streamData={streams}
                    handleUpdates={updates}
                />
            )}
        </div>
    );
};

Streams.layout = "Contentlayout";
export default Streams;
