import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchPickUps } from '@/utils/data_fetch';
import PickUpDataTable from './PickUpDataTable';
import LoaderComponent from '@/pages/components/LoaderComponent';
import useSWR from 'swr';
import DateFilterComponent, { DateFilterIF } from '../components/DateFilterComponent';
import { exportPickUpRecords } from '@/utils/reports';

const PickUps = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({
        startDate: "",
        endDate: ""
    });

    // Use SWR for data fetching
    const { data: pickUp, error, isValidating, mutate } = useSWR(
        [page, limit, dateChange.startDate, dateChange.endDate], 
        () => fetchPickUps(page, limit, dateChange.startDate, dateChange.endDate)
    );

    // Handle page change
    const onChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidating) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidating]);
    // handle limit change
    const onChangeLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isValidating) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isValidating]);
    console.log(pickUp);
    // handle date change
    const handleDateChange = React.useCallback((data: DateFilterIF) => {
        if (data.startDate !== dateChange.startDate || data.endDate !== dateChange.endDate) {
            setDateChange(data);
            setPage(1); // Reset to first page when changing filters
        }
    }, [dateChange.startDate, dateChange.endDate]);

    if (error) return <div>Error loading PickUps: {error.message}</div>;

    return (
        <div className='my-2'>
            <Seo title="PickUps" />
            <div className="flex sm:flex-row flex-col w-4/5 justify-center">
                <PageHeader title={`PickUps (${pickUp?.totalDocuments ?? 0})`} item="Skooltym" active_item="PickUps" />
                <DateFilterComponent
                    enableActions
                    exportData={(data) => exportPickUpRecords(dateChange.startDate, dateChange.endDate)}
                    handleFilter={handleDateChange} />
            </div>
            <PickUpDataTable
                pickUpData={pickUp || null}
                updatePage={onChangePage}
                updateLimit={onChangeLimit}
                isLoading={isValidating}
            />

        </div>
    );
};

PickUps.layout = "Contentlayout";
export default PickUps;
