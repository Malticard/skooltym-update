import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchPickUps } from '@/utils/data_fetch';
import PickUpDataTable from './PickUpDataTable';
import LoaderComponent from '@/pages/components/LoaderComponent';
import useSWR from 'swr';

const PickUps = () => {
    const [page, setPage] = React.useState(1);

    // Use SWR for data fetching
    const { data: pickUp, error, isValidating } = useSWR([page], () => fetchPickUps(page), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        dedupingInterval: 5000,
        onError: (err) => console.error('Error fetching PickUps:', err)
    });

    // Handle page change
    const onChangePage = (newPage: number) => {
        setPage(newPage); // SWR will refetch when page changes
    };

    if (isValidating) return <LoaderComponent />;
    if (error) return <div>Error loading PickUps: {error.message}</div>;

    return (
        <>
            <Seo title="PickUps" />
            <PageHeader title="PickUps" item="Skooltym" active_item="PickUps" />
            {pickUp && (
                <PickUpDataTable
                    pickUpData={pickUp}
                    updatePage={onChangePage}
                />
            )}
        </>
    );
};

PickUps.layout = "Contentlayout";
export default PickUps;
