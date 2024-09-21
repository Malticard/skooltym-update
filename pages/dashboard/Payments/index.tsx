import LoaderComponent from '@/pages/components/LoaderComponent';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchPayments } from '@/utils/data_fetch';
import React from 'react';
import PaymentDataTable from './PaymentDataTable';

const Payments = () => {
    const [cleared, setCleared] = React.useState({} as any);
    const [loading, setLoading] = React.useState(false);
    // load data
    React.useEffect(() => {
        setLoading(true);
        fetchPayments().then((res) => {
            setCleared(res);
            setLoading(false);
        }).then((err) => {
            console.log(err);
            setLoading(false);
        });
    }, []);
    // on change of page
    const onChangePage = (page: number) => {
        // fetchClearedOvertime(page).then((res) => {
        //     setCleared(res);
        //     setLoading(false);
        // }).catch((error) => {
        //     setLoading(false);
        //     console.log(error);
        // })
    }
    return (
        <div>
            <Seo title='Payments' />
            <PageHeader title='Payments' item='Skooltym' active_item='Payments' />

            {
                loading ? (
                    <LoaderComponent />
                ) : cleared && (
                    <PaymentDataTable clearedData={cleared} updatePage={onChangePage} />
                )
            }
        </div>


    );
};
Payments.layout = "Contentlayout";
export default Payments;