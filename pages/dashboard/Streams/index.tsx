import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchStream } from '@/utils/data_fetch';
import React from 'react';
import StreamDataTable from './StreamDataTable';
import { PaginatedStreamResult } from '@/interfaces/StreamModel';
import LoaderComponent from '@/pages/components/LoaderComponent';

const Streams = () => {
    const [streams, setStreams] = React.useState<PaginatedStreamResult>({} as PaginatedStreamResult);
    const [loadingData, setLoadingData] = React.useState(false);
    const [addModalShow, setAddModalShow] = React.useState(false);
    React.useEffect(() => {
        setLoadingData(true);
        // streams
        fetchStream().then((res) => {
            setStreams(res);
            setLoadingData(false);
        }).catch((err) => {
            console.log(err);
            setLoadingData(false);
        });
    }, []);

    // React.useEffect(() => {
    //     fetchStream().then((res) => {
    //         setStreams(res);
    //         console.log("querying..");
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    // })
    // methods for change of page
    const onChangePage = (page: number) => {
        fetchStream(page).then((res) => {
            setStreams(res);
            // setLoadingData(false);
        }).catch((error) => {
            // setLoadingData(false);
            console.log(error);
        })
    }
    return (
        <div>
            <Seo title='Streams' />
            <PageHeader title='Streams' item='Skooltym' active_item='Streams' buttonText='Add Stream' onTap={() => setAddModalShow(true)} />
            {loadingData ? (<>
                <LoaderComponent />
            </>) : (<StreamDataTable addModalShow={addModalShow} setAddModalShow={setAddModalShow} loadingClasses={false} updatePage={onChangePage} streamData={streams} />)}
        </div>
    );
};
Streams.layout = "Contentlayout";
export default Streams;