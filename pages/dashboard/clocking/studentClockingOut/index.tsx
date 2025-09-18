import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { studentClockingOut } from '@/utils/clocking';
import useSWR from 'swr';
import React from 'react';
import StudentClockingDataTable from './StudentClockingDatatable';
import { StudentClockingResponse } from '@/interfaces/StudentClockingModel';
import LoaderComponent from '@/pages/components/LoaderComponent';
import DateFilterComponent, { DateFilterIF } from '../../components/DateFilterComponent';
import { exportStudentClockOutRecords } from '@/utils/reports';

const StudentClockingPage = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" });

    // Using SWR with automatic revalidation for student clocking data
    const { data: clockingData, error: clockingError, isValidating: isClockingLoading, mutate: mutateClockingData } = useSWR<StudentClockingResponse>(
        [page, limit, dateChange.startDate, dateChange.endDate],
        () => studentClockingOut(page, limit, dateChange.startDate, dateChange.endDate),
    );

    // Handle error state
    if (clockingError) {
        return <div className='alert alert-danger'>Error loading student clocking data</div>;
    }
    // function to handle mutating student clocking
    const handleChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isClockingLoading) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isClockingLoading]);

    const handleChangeLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isClockingLoading) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isClockingLoading]);
    // handleDate change
    const handleDateChange = React.useCallback((data: DateFilterIF) => {
        if (data.startDate !== dateChange.startDate || data.endDate !== dateChange.endDate) {
            setDateChange(data);
            setPage(1); // Reset to first page when changing filters
        }
    }, [dateChange.startDate, dateChange.endDate]);
    return (
        <div className='my-2'>
            <Seo title="Student Clock Out" />
            <div className="flex sm:flex-row flex-col justify-between w-4/5" >
                <PageHeader
                    title={`Clock Out (${clockingData?.total ?? 0})`}
                    item="Skooltym"
                    active_item="Student Clocking"
                />
                <DateFilterComponent
                    exportData={() => exportStudentClockOutRecords(dateChange.startDate, dateChange.endDate)}
                    enableActions
                    handleFilter={handleDateChange}
                />
            </div>

            <StudentClockingDataTable
                updateLimit={handleChangeLimit}
                updatePage={handleChangePage}
                clockingData={clockingData || null}
                isLoading={isClockingLoading}
            />
        </div>
    );
};

StudentClockingPage.layout = "Contentlayout";
export default StudentClockingPage;
