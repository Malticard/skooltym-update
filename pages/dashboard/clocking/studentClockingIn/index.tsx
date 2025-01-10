import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { studentClockingIn } from '@/utils/clocking';
import useSWR from 'swr';
import React from 'react';
import StudentClockingDataTable from './StudentClockingDatatable';
import { StudentClockingResponse } from '@/interfaces/StudentClockingModel';
import DateFilterComponent, { DateFilterIF } from '../../components/DateFilterComponent';

// Fetcher function to get student clocking data

const StudentClockingPage = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" });

    // Using SWR with automatic revalidation for student clocking data
    const { data: clockingData, error: clockingError, isValidating: isClockingLoading, mutate: mutateClockingData } = useSWR<StudentClockingResponse>(
        'fetchStudentClocking',
        async () => await studentClockingIn(page, limit, dateChange.startDate, dateChange.endDate),

    );
    // Handle error state
    if (clockingError) {
        return <div>Error loading student clocking data</div>;
    }
    // function to handle mutating staff clocking
    const handleChangePage = async (page: number) => {
        setPage(page);
        const clock = await studentClockingIn(page, limit, dateChange.startDate, dateChange.endDate);
        mutateClockingData(clock)
    }

    const handleChangeLimit = async (lm: number) => {
        setLimit(lm);
        const clock = await studentClockingIn(page, limit, dateChange.startDate, dateChange.endDate);
        mutateClockingData(clock)
    }
    // handleDate change
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data)
        const clock = await studentClockingIn(page, limit, data.startDate, data.endDate);
        mutateClockingData(clock)
    }
    return (
        <div className='my-2'>
            <Seo title="Student Clocking In" />
            <div className="flex sm:flex-row flex-col justify-between w-4/5">
                <PageHeader
                    title="Clock In"
                    item="Dashboard"
                    active_item="Student Clocking In"
                />
                <DateFilterComponent handleFilter={handleDateChange} />
            </div>
            {clockingData && (<StudentClockingDataTable
                updatePage={handleChangePage}
                updateLimit={handleChangeLimit}
                clockingData={clockingData}
            />)}
        </div>
    );
};
StudentClockingPage.layout = "Contentlayout";
export default StudentClockingPage;
