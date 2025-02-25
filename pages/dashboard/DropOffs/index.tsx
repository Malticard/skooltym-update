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
    const { data: dropOffs, error, isValidating, mutate } = useSWR([page, rowsPerPage, dateChange.startDate, dateChange.endDate], async () => await fetchDropOffs(page, rowsPerPage, dateChange.startDate, dateChange.endDate));

    // Handle page change
    const onChangePage = async (newPage: number) => {
        setPage(newPage); // SWR will automatically refetch when the page changes
        const result = await fetchDropOffs(page, rowsPerPage, dateChange.startDate, dateChange.endDate);
        mutate(result);
    };

    // Handle rows per page change
    const onChangeRowsPerPage = async (lm: number) => {
        setRowsPerPage(lm); // SWR will automatically refetch when rowsPerPage changes
        const result = await fetchDropOffs(page, rowsPerPage, dateChange.startDate, dateChange.endDate);
        mutate(result);
    };
    // Handle date change
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data)
        const result = await fetchDropOffs(page, rowsPerPage, data.startDate, data.endDate);
        mutate(result);
    }

    if (error) return <div>Error loading drop-offs: {error.message}</div>;

    return (
        <div className='my-2'>
            <Seo title="All Time Drop Offs" />
            <div className='flex sm:flex-row flex-col w-4/5 justify-between'>
                <PageHeader title={`All Time Drop Offs (${dropOffs?.totalDocuments ?? 0})`} item="Skooltym" active_item="Drop Offs" />
                <DateFilterComponent enableActions exportData={() => exportDropOffRecords()} handleFilter={handleDateChange} />
            </div>
            {dropOffs && (
                <DropOffDataTable
                    dropOffData={dropOffs}
                    updateLimit={onChangeRowsPerPage}
                    updatePage={onChangePage}
                // updateRows={onChangeRowsPerPage}
                />
            )}
        </div>
    );
};

DropOffs.layout = "Contentlayout";
export default DropOffs;
