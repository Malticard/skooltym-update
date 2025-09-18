import React from 'react';
import LoaderComponent from '@/pages/components/LoaderComponent';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import DropOffDataTable from './DropOffDataTable';
import { fetchDropOffs } from '@/utils/data_fetch';
import useSWR from 'swr';
import DateFilterComponent, { DateFilterIF } from '../components/DateFilterComponent';
import { exportDropOffRecords } from '@/utils/reports';

const DropOffs = () => {
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" });
    // Use SWR for fetching drop-offs with dynamic pagination
    const { data: dropOffs, error, isValidating, mutate } = useSWR(
        [page, rowsPerPage, dateChange.startDate, dateChange.endDate], 
        () => fetchDropOffs(page, rowsPerPage, dateChange.startDate, dateChange.endDate)
    );

    // Handle page change
    const onChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidating) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidating]);

    // Handle rows per page change
    const onChangeRowsPerPage = React.useCallback((newLimit: number) => {
        if (newLimit !== rowsPerPage && !isValidating) {
            setRowsPerPage(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [rowsPerPage, isValidating]);
    // Handle date change
    const handleDateChange = React.useCallback((data: DateFilterIF) => {
        if (data.startDate !== dateChange.startDate || data.endDate !== dateChange.endDate) {
            setDateChange(data);
            setPage(1); // Reset to first page when changing filters
        }
    }, [dateChange.startDate, dateChange.endDate]);

    if (error) return <div>Error loading drop-offs: {error.message}</div>;

    return (
        <div className='my-2'>
            <Seo title="All Time Drop Offs" />
            <div className='flex sm:flex-row flex-col w-4/5 justify-between'>
                <PageHeader title={`All Time Drop Offs (${dropOffs?.totalDocuments ?? 0})`} item="Skooltym" active_item="Drop Offs" />
                <DateFilterComponent enableActions exportData={(data) => exportDropOffRecords(dateChange.startDate, dateChange.endDate)} handleFilter={handleDateChange} />
            </div>
            <DropOffDataTable
                dropOffData={dropOffs || null}
                updateLimit={onChangeRowsPerPage}
                updatePage={onChangePage}
                isLoading={isValidating}
            />
        </div>
    );
};

DropOffs.layout = "Contentlayout";
export default DropOffs;
