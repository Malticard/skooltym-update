import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchPickUps } from '@/utils/data_fetch';
import PickUpDataTable from './PickUpDataTable';
import LoaderComponent from '@/pages/components/LoaderComponent';
import useSWR from 'swr';
import DateFilterComponent, { DateFilterIF } from '../components/DateFilterComponent';

const PickUps = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({
        startDate: "",
        endDate: ""
    });

    // Use SWR for data fetching
    const { data: pickUp, error, isValidating, mutate } = useSWR([page, limit, dateChange.endDate, dateChange.startDate], async () => await fetchPickUps(page, limit, dateChange.startDate, dateChange.endDate));

    // Handle page change
    const onChangePage = async (newPage: number) => {
        setPage(newPage); // SWR will refetch when page changes
        const result = await fetchPickUps(page, limit, dateChange.startDate, dateChange.endDate);
        mutate(result);
    };
    // handle limit change
    const onChangeLimit = async (lm: number) => {
        setLimit(lm);
        const result = await fetchPickUps(page, limit, dateChange.startDate, dateChange.endDate);
        mutate(result);
    };
    // handle date change
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data)
        const result = await fetchPickUps(page, limit, data.startDate, data.endDate);
        mutate(result);
    }

    if (error) return <div>Error loading PickUps: {error.message}</div>;

    return (
        <div className='my-2'>
            <Seo title="PickUps" />
            <div className="flex sm:flex-row flex-col w-4/5 justify-center">
                <PageHeader title="PickUps" item="Skooltym" active_item="PickUps" />
                <DateFilterComponent handleFilter={handleDateChange} />
            </div>
            {pickUp && (
                <PickUpDataTable
                    pickUpData={pickUp}
                    updatePage={onChangePage}
                    updateLimit={onChangeLimit}

                />
            )}
        </div>
    );
};

PickUps.layout = "Contentlayout";
export default PickUps;
