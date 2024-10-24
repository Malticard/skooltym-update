import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { studentClockingIn } from '@/utils/clocking';
import useSWR from 'swr';
import React from 'react';
import StudentClockingDataTable from './StudentClockingDatatable';
import { StudentClockingResponse } from '@/interfaces/StudentClockingModel';
import LoaderComponent from '@/pages/components/LoaderComponent';

// Fetcher function to get student clocking data
const fetchStudentClocking = () => studentClockingIn().then(res => res);

const StudentClockingPage = () => {
    // Using SWR with automatic revalidation for student clocking data
    const { data: clockingData, error: clockingError, isValidating: isClockingLoading, mutate: mutateClockingData } = useSWR<StudentClockingResponse>(
        'fetchStudentClocking',
        fetchStudentClocking,
        {
            // revalidateOnFocus: false,
            // revalidateOnReconnect: false,
            // refreshInterval: 0,
            // dedupingInterval: 500, // 5 
            onError: (err) => console.error('Error fetching student clocking data:', err)
        }
    );

    // // Handle loading state
    // if (isClockingLoading) {
    //     return (
    //         <div>
    //             <LoaderComponent />
    //         </div>
    //     );
    // }

    // Handle error state
    if (clockingError) {
        return <div>Error loading student clocking data</div>;
    }
    // function to handle mutating staff clocking
    const handleChange = async (page: number) => {
        const clock = await studentClockingIn(page)
        mutateClockingData(clock)
    }
    return (
        <>
            <Seo title="Student Clocking In" />
            <PageHeader
                title="Students"
                item="Skooltym"
                active_item="Student Clocking"
            />
            <StudentClockingDataTable
                updatePage={handleChange}
                clockingData={clockingData}
            />
        </>
    );
};

StudentClockingPage.layout = "Contentlayout";
export default StudentClockingPage;
