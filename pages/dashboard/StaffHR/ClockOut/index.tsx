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
    const { data: clockingData, error: clockingError, mutate: mutateClockingData } = useSWR<StaffClockingResponse>(
        'fetchStaffClocking',
        async () => await staffClockingOut(page, limit, dateChange.startDate, dateChange.endDate),

    );

    // Handle error state
    if (clockingError) {
        return <div>Error loading staff clocking data</div>;
    }
    // function to handle mutating staff clocking
    const handleChangePage = async (page: number) => {
        const clock = await staffClockingOut(page)
        mutateClockingData(clock)
    }
    // handle change limit
    const handleChangeLimit = async (lm: number) => {
        const clock = await staffClockingOut(page)
        mutateClockingData(clock)
    }
    // handle date change
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data)
        const clock = await staffClockingOut(page, limit, data.startDate, data.endDate);
        mutateClockingData(clock);
    }

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
                    exportData={() => exportStaffClockOutRecords()}
                    handleFilter={handleDateChange} />
            </div>

            {
                clockingData && (
                    <StaffClockingOutDataTable
                        updatePage={handleChangePage}
                        updateLimit={handleChangeLimit}
                        clockingData={clockingData}
                    />
                )
            }

        </div>
    );
};

StaffClockingPage.layout = "Contentlayout";
export default StaffClockingPage;
