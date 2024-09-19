import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchClasses, fetchStream } from '@/utils/data_fetch';
import React from 'react';
import StreamDataTable from './StreamDataTable';
import { ClassResponse } from '@/interfaces/ClassesModel';
import { PaginatedStreamResult, Stream } from '@/interfaces/StreamModel';
import { IconLadder } from '@/public/assets/icon-fonts/tabler-icons/icons-react';

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
    // methods for change of page
    const onChangePage = (page: number) => {
        fetchStream(page).then((res) => {
            setStreams(res);
            setLoadingData(false);
        }).catch((error) => {
            setLoadingData(false);
            console.log(error);
        })
    }
    return (
        <div>
            <Seo title='Streams' />
            <PageHeader title='Streams' item='Skooltym' active_item='Streams' buttonText='Add Stream' onTap={() => setAddModalShow(true)} />
            {loadingData ? (<>
                <div>
                    <div className='flex justify-center items-center h-96'>
                        <div className='flex flex-col items-center'>
                            <IconLadder className='text-gray-900 w-16 h-16' />
                            <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900'></div>
                            <p className='text-gray-900 text-lg font-semibold mt-4'>Loading...</p>
                        </div>
                    </div>
                </div>
            </>) : streams && (<StreamDataTable addModalShow={addModalShow} setAddModalShow={setAddModalShow} loadingClasses={false} updatePage={onChangePage} streamData={streams} />)}
        </div>
    );
};
Streams.layout = "Contentlayout";
export default Streams;