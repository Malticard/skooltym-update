import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchClasses, fetchStream } from '@/utils/data_fetch';
import React from 'react';
import ClassDataTable from './ClassDataTable';
import { ClassResponse } from '@/interfaces/ClassesModel';
import { Stream } from '@/interfaces/StreamModel';
import LoaderComponent from '@/pages/components/LoaderComponent';
const Classes = () => {
    const [classes, setClasses] = React.useState({} as ClassResponse);
    const [streams, setStreams] = React.useState<Stream[]>([]);
    const [loadingData, setLoadingData] = React.useState(false);
    const [addModalShow, setAddModalShow] = React.useState(false);
    React.useEffect(() => {
        setLoadingData(true);
        fetchClasses().then((res) => {
            setClasses(res)
            setLoadingData(false)
        }).catch((err) => {
            setLoadingData(false);
            console.log(err);
        });
        // streams
        fetchStream(1, 100).then((res) => {
            setStreams(res.results);
            setLoadingData(false);
        }).catch((err) => {
            console.log(err);
            setLoadingData(false);
        });
    }, []);
    // methods for change of page
    const onChangePage = (page: number) => {
        fetchClasses(page).then((res) => {
            setClasses(res);
            setLoadingData(false);
        }).catch((error) => {
            setLoadingData(false);
            // console.log(error);
        })
    }
    const onChangeRow = (page: number) => {
        fetchClasses(page).then((res) => {
            setClasses(res);
            setLoadingData(false);
        }).catch((error) => {
            setLoadingData(false);
            // console.log(error);
        })
    }
    return (
        <div>
            <Seo title='Classes' />
            <PageHeader title='Classes' item='Skooltym' active_item='Classes' buttonText='Add Class' onTap={() => setAddModalShow(true)} />
            {loadingData ? (<>
                <LoaderComponent />
            </>) : classes && streams && (<ClassDataTable streams={streams} addModalShow={addModalShow} setAddModalShow={setAddModalShow} loadingClasses={false} updatePage={onChangePage} classData={classes} updateRows={onChangePage} />)}
        </div>
    );
};
Classes.layout = "Contentlayout";
export default Classes;