import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { staffClockingIn } from '@/utils/clocking';
import useSWR from 'swr';
import React from 'react';
import { StaffClockingResponse } from '@/interfaces/StaffClockingModel';
import { Row, Col } from 'react-bootstrap';
import LoaderComponent from '@/pages/components/LoaderComponent';
import StaffClockingInDataTable from './StaffClockingIntable';
import DateFilterComponent, { DateFilterIF } from '../../components/DateFilterComponent';
import Link from 'next/link';
import { exportStaffClockInRecords } from '@/utils/reports';

// Fetcher function to get staff clocking data
// const fetchStaffClocking = () => staffClockingIn().then(res => res);

const StaffClockingPage = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" });
    // Using SWR with automatic revalidation for staff clocking data
    const { data: clockingData, error: clockingError, isValidating: isClockingLoading, mutate: mutateClockingData } = useSWR<StaffClockingResponse>(
        [page, limit, dateChange.startDate, dateChange.endDate],
        () => staffClockingIn(page, limit, dateChange.startDate, dateChange.endDate),
    );

    // Handle error state
    if (clockingError) {
        return <div>Error loading staff clocking data</div>;
    }
    // function to handle mutating staff clocking
    const handleChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isClockingLoading) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isClockingLoading]);
    // handle change limit
    const handleChangeLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isClockingLoading) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isClockingLoading]);
    // handle date change
    const handleDateChange = React.useCallback((data: DateFilterIF) => {
        if (data.startDate !== dateChange.startDate || data.endDate !== dateChange.endDate) {
            setDateChange(data);
            setPage(1); // Reset to first page when changing filters
        }
    }, [dateChange.startDate, dateChange.endDate]);

    return (
        <div className='my-2'>
            <Seo title="Staff Clocking" />
            <div className="flex sm:flex-row flex-col justify-between w-4/5">
                <PageHeader
                    title={`Staff Clock In (${clockingData?.total ?? 0})`}
                    link
                >
                    <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
                    <li className='breadcrumb-item active'>Staff Clocking In</li>
                </PageHeader>
                <DateFilterComponent
                    enableActions
                    exportData={() => exportStaffClockInRecords(dateChange.startDate, dateChange.endDate)}
                    handleFilter={handleDateChange}
                />
            </div>

            <StaffClockingInDataTable
                updatePage={handleChangePage}
                updateLimit={handleChangeLimit}
                clockingData={clockingData || null}
                isLoading={isClockingLoading}
            />

        </div>
    );
};

StaffClockingPage.layout = "Contentlayout";
export default StaffClockingPage;
