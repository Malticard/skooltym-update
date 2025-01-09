import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { studentClockingIn } from '@/utils/clocking';
import useSWR from 'swr';
import React from 'react';
import StudentClockingDataTable from './StudentClockingDatatable';
import { StudentClockingResponse } from '@/interfaces/StudentClockingModel';
import LoaderComponent from '@/pages/components/LoaderComponent';

// Fetcher function to get student clocking data

const StudentClockingPage = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    // Using SWR with automatic revalidation for student clocking data
    const { data: clockingData, error: clockingError, isValidating: isClockingLoading, mutate: mutateClockingData } = useSWR<StudentClockingResponse>(
        'fetchStudentClocking',
        () => studentClockingIn(page, limit),

    );
    // Handle error state
    if (clockingError) {
        return <div>Error loading student clocking data</div>;
    }
    // function to handle mutating staff clocking
    const handleChangePage = async (page: number) => {
        console.log("current page", page, "rows per page", limit)
        setPage(page);
        const clock = await studentClockingIn(page, limit);
        mutateClockingData(clock)
    }

    const handleChangeLimit = async (lm: number) => {
        console.log("current page", page, "rows per page", limit)
        setLimit(lm);
        const clock = await studentClockingIn(page, limit);
        mutateClockingData(clock)
    }
    return (
        <div className='ml-5 my-4'>
            <Seo title="Student Clocking In" />
            <PageHeader
                title="Students"
                item="Skooltym"
                active_item="Student Clocking"
            />
            <StudentClockingDataTable
                updatePage={handleChangePage}
                updateLimit={handleChangeLimit}
                clockingData={clockingData || { results: [], limit: 0, page: 0, pages: 0, total: 0 }}
            />
        </div>
    );
};
StudentClockingPage.layout = "Contentlayout";
export default StudentClockingPage;
