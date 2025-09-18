import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchClearedOvertime } from '@/utils/data_fetch';
import React from 'react';
import ClearedDataTable from './ClearedDatatable';
import DateFilterComponent, { DateFilterIF } from '../components/DateFilterComponent';
import useSWR from 'swr';
import { exportClearedRecords } from '@/utils/reports';

const ClearedOvertime = () => {

    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dataChange, setDataChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" })
    // Using SWR to handle data fetching with proper dependency array
    const { data: cleared, mutate, error, isValidating } = useSWR(
        [page, limit, dataChange.startDate, dataChange.endDate], 
        () => fetchClearedOvertime(page, limit, dataChange.startDate, dataChange.endDate)
    );
    // Handle page change for pagination
    const onChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidating) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidating]);
    // Handle limit change
    const onChangeLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isValidating) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isValidating]);
    // Handle date filter changes
    const handleDateChange = React.useCallback((data: DateFilterIF) => {
        if (data.startDate !== dataChange.startDate || data.endDate !== dataChange.endDate) {
            setDataChange(data);
            setPage(1); // Reset to first page when changing filters
        }
    }, [dataChange.startDate, dataChange.endDate]);
    return (
        <div className='my-2'>
            <Seo title="Cleared Overtime" />
            <div className="flex sm:flex-row flex-col w-4/5 justify-center">
                <PageHeader
                    title={`Cleared Overtime (${cleared?.totalDocuments ?? 0})`}
                    item="Skooltym"
                    // upload
                    // onDownload={() => exportClearedRecords()}
                    active_item="Cleared Overtime"
                />
                <DateFilterComponent enableActions exportData={() => exportClearedRecords(dataChange.startDate, dataChange.endDate)} handleFilter={handleDateChange} />
            </div>


            <ClearedDataTable
                clearedData={cleared || null}
                updatePage={onChangePage}
                updateLimit={onChangeLimit}
                isLoading={isValidating}
            />
        </div>
    );
};
ClearedOvertime.layout = "Contentlayout";
export default ClearedOvertime;