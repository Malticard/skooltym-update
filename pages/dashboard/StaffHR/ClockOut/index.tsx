import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { staffClockingOut } from '@/utils/clocking';
import useSWR from 'swr';
import React from 'react';
import StaffClockingOutDataTable from './StaffClockingOuttable';
import { StaffClockingResponse } from '@/interfaces/StaffClockingModel';
import DateFilterComponent, { DateFilterIF } from '../../components/DateFilterComponent';
import { exportStaffClockOutRecords } from '@/utils/reports';

// Fetcher function to get staff clocking data
const StaffClockingPage = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" });
    // Using SWR with automatic revalidation for staff clocking data
    const { data: clockingData, error: clockingError, isValidating, mutate: mutateClockingData } = useSWR<StaffClockingResponse>(
        [page, limit, dateChange.startDate, dateChange.endDate],
        () => staffClockingOut(page, limit, dateChange.startDate, dateChange.endDate),
    );

    // Handle error state
    if (clockingError) {
        return <div>Error loading staff clocking data</div>;
    }
    // function to handle mutating staff clocking
    const handleChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidating) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidating]);
    // handle change limit
    const handleChangeLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isValidating) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isValidating]);
    // handle date change
    const handleDateChange = React.useCallback((data: DateFilterIF) => {
        if (data.startDate !== dateChange.startDate || data.endDate !== dateChange.endDate) {
            setDateChange(data);
            setPage(1); // Reset to first page when changing filters
        }
    }, [dateChange.startDate, dateChange.endDate]);

    return (
        <div className='my-2'>
            <Seo title="Staff Clocking Out" />
            <div className="flex sm:flex-row flex-col justify-between w-4/5">
                <PageHeader
                    title={`Staff (${clockingData?.total ?? 0})`}
                    item="Dashboard"
                    // download
                    // onDownload={() => exportStaffClockOutRecords()}
                    active_item="Clocking Out"
                />
                <DateFilterComponent
                    enableActions
                    exportData={() => exportStaffClockOutRecords(dateChange.startDate, dateChange.endDate)}
                    handleFilter={handleDateChange} />
            </div>

            <StaffClockingOutDataTable
                updatePage={handleChangePage}
                updateLimit={handleChangeLimit}
                clockingData={clockingData || null}
                isLoading={isValidating}
            />

        </div>
    );
};

StaffClockingPage.layout = "Contentlayout";
export default StaffClockingPage;
