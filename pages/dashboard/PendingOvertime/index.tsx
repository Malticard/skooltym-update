import { OvertimeModel } from '@/interfaces/OvertimeModel';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchSpecificOvertime } from '@/utils/data_fetch';
import React from 'react';
import PendingDataTable from './PendingDataTable';
import LoaderComponent from '@/pages/components/LoaderComponent';

const PendingOvertime = () => {
    const [pending, setPending] = React.useState({} as OvertimeModel);
    const [loading, setLoading] = React.useState(false);
    // load data
    React.useEffect(() => {
        setLoading(true);
        fetchSpecificOvertime().then((res) => {
            setPending(res);
            setLoading(false);
        }).then((err) => {
            console.log(err);
            setLoading(false);
        });
    }, []);
    // on change of page
    const onChangePage = (page: number) => {
        fetchSpecificOvertime(page).then((res) => {
            setPending(res);
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }
    return (
        <>
            <Seo title="Pending Overtime" />
            <PageHeader title="Pending Overtime" item="Skooltym" active_item="Pending Overtime" />
            {
                loading ? (
                    <LoaderComponent />
                ) : pending && (
                    <PendingDataTable pendingData={pending} updatePage={onChangePage} />
                )
            }
        </>
    );
};
PendingOvertime.layout = "Contentlayout";
export default PendingOvertime;