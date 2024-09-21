import { OvertimeModel } from '@/interfaces/OvertimeModel';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchClearedOvertime } from '@/utils/data_fetch';
import React from 'react';
import ClearedDataTable from './ClearedDatatable';
import LoaderComponent from '@/pages/components/LoaderComponent';

const ClearedOvertime = () => {
    const [cleared, setCleared] = React.useState({} as OvertimeModel);
    const [loading, setLoading] = React.useState(false);
    // load data
    React.useEffect(() => {
        setLoading(true);
        fetchClearedOvertime().then((res) => {
            setCleared(res);
            setLoading(false);
        }).then((err) => {
            console.log(err);
            setLoading(false);
        });
    }, []);
    // on change of page
    const onChangePage = (page: number) => {
        fetchClearedOvertime(page).then((res) => {
            setCleared(res);
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }
    return (
        <>
            <Seo title="Cleared Overtime" />
            <PageHeader title="Cleared Overtime" item="Skooltym" active_item="Cleared Overtime" />
            {
                loading ? (
                    <LoaderComponent />
                ) : cleared && (
                    <ClearedDataTable clearedData={cleared} updatePage={onChangePage} />
                )
            }
        </>
    );
};
ClearedOvertime.layout = "Contentlayout";
export default ClearedOvertime;