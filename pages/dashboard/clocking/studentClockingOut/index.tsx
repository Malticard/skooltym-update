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
        'studentClockingOut',
        async () => await studentClockingOut(page, limit, dateChange.startDate, dateChange.endDate),
    );

    // Handle error state
    if (clockingError) {
        return <div className='alert alert-danger'>Error loading student clocking data</div>;
    }
    // function to handle mutating staff clocking
    const handleChangePage = async (newPage: number) => {
        setPage(newPage);
        const clock = await studentClockingOut(page, limit, dateChange.startDate, dateChange.endDate);
        mutateClockingData(clock)
    }

    const handleChangeLimit = async (lm: number) => {
        // console.log("current page", page, "rows per page", limit)
        setLimit(lm);
        const clock = await studentClockingOut(page, limit, dateChange.startDate, dateChange.endDate);
        mutateClockingData(clock)
    }
    // handleDate change
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data)
        const clock = await studentClockingOut(page, limit, data.startDate, data.endDate);
        mutateClockingData(clock)
    }
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
                    exportData={() => exportStudentClockOutRecords()}
                    enableActions
                    handleFilter={handleDateChange}
                />
            </div>

            {clockingData && (<StudentClockingDataTable
                updateLimit={handleChangeLimit}
                updatePage={handleChangePage}
                clockingData={clockingData}
            />)}
        </div>
    );
};

StudentClockingPage.layout = "Contentlayout";
export default StudentClockingPage;
