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

// Fetcher function to get staff clocking data
// const fetchStaffClocking = () => staffClockingIn().then(res => res);

const StaffClockingPage = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" });
    // Using SWR with automatic revalidation for staff clocking data
    const { data: clockingData, error: clockingError, isValidating: isClockingLoading, mutate: mutateClockingData } = useSWR<StaffClockingResponse>(
        'fetchStaffClocking',
        async () => await staffClockingIn(page, limit, dateChange.startDate, dateChange.endDate),

    );

    // Handle error state
    if (clockingError) {
        return <div>Error loading staff clocking data</div>;
    }
    // function to handle mutating staff clocking
    const handleChangePage = async (page: number) => {
        setPage(page);
        const clock = await staffClockingIn(page, limit, dateChange.startDate, dateChange.endDate);
        mutateClockingData(clock)
    }
    // handle change limit
    const handleChangeLimit = async (lm: number) => {
        setLimit(lm);
        const clock = await staffClockingIn(page, limit, dateChange.startDate, dateChange.endDate);
        mutateClockingData(clock)
    }
    // handle date change
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data)
        const clock = await staffClockingIn(page, limit, data.startDate, data.endDate);
        mutateClockingData(clock);
    }

    return (
        <div className='my-2'>
            <Seo title="Staff Clocking" />
            <div className="flex sm:flex-row flex-col justify-between w-4/5">
                <PageHeader
                    title="Staff Clock In"
                    link
                >
                    <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
                    <li className='breadcrumb-item active'>Staff Clocking In</li>
                </PageHeader>
                <DateFilterComponent handleFilter={handleDateChange} />
            </div>

            {
                clockingData && (
                    <StaffClockingInDataTable
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
