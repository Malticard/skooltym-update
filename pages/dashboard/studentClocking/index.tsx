import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { studentClocking } from '@/utils/clocking';
import useSWR from 'swr';
import React from 'react';
import StudentClockingDataTable from './StudentClockingDatatable';
import { StudentClockingResponse } from '@/interfaces/StudentClockingModel';
import LoaderComponent from '@/pages/components/LoaderComponent';

// Fetcher function to get student clocking data
const fetchStudentClocking = () => studentClocking().then(res => res);

const StudentClockingPage = () => {
    // Using SWR with additional configuration for student clocking data
    const { data: clockingData, error: clockingError, isValidating: isClockingLoading, mutate: mutateClockingData } = useSWR<StudentClockingResponse>(
        'fetchStudentClocking',
        fetchStudentClocking,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0,
            dedupingInterval: 5000, // Avoid re-fetching within 5 seconds
            onError: (err) => console.error('Error fetching student clocking data:', err)
        }
    );

    // Handle loading state
    if (isClockingLoading && !clockingData) {
        return <div>
            <LoaderComponent />
        </div>;
    }

    // Handle error state
    if (clockingError) {
        return <div>Error loading student clocking data</div>;
    }

    return (
        <>
            <Seo title="Student Clocking" />
            <PageHeader
                title="Students"
                item="Skooltym"
                active_item="Student Clocking"
            />
            <StudentClockingDataTable
                updatePage={(value: number): void => {
                    // Implement update page logic
                }}
                clockingData={clockingData}
            />
        </>
    );
};

StudentClockingPage.layout = "Contentlayout";
export default StudentClockingPage;
