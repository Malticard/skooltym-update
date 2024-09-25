import React from 'react';
import LoaderComponent from '@/pages/components/LoaderComponent';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchPayments } from '@/utils/data_fetch';
import PaymentDataTable from './PaymentDataTable';
import useSWR from 'swr';

const Payments = () => {
    const [page, setPage] = React.useState(1);
    // payment modal
    const [openAddPayment, setOpenAddPayment] = React.useState(false);
    // Using SWR to handle data fetching
    const { data: cleared, error, isValidating } = useSWR([page], () => fetchPayments(page), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        dedupingInterval: 5000,
        onError: (err) => console.error('Error fetching Payments:', err)
    });

    // Handle page change for pagination
    const onChangePage = (newPage: number) => {
        setPage(newPage); // SWR will refetch when page changes
    };

    if (isValidating) return <LoaderComponent />;
    if (error) return <div>Error loading Payments: {error.message}</div>;

    return (
        <div>
            <Seo title="Payments" />
            <PageHeader title="Payments" item="Skooltym" active_item="Payments" buttonText='Add Payment' onTap={() => setOpenAddPayment(true)} />

            {cleared && (
                <PaymentDataTable clearedData={cleared} setOpenAddPayment={setOpenAddPayment} openPaymentModal={openAddPayment} updatePage={onChangePage} />
            )}
        </div>
    );
};

Payments.layout = "Contentlayout";
export default Payments;
