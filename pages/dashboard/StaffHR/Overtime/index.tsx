import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import React from 'react';
import StaffOvertimeDataTable from './StaffOvertimeDataTable';
import useSWR, { mutate } from 'swr';
import { getStaffOvertimes } from '@/utils/clocking';
import DateFilterComponent, { DateFilterIF } from '../../components/DateFilterComponent';
import { exportStaffOvertimeRecords } from '@/utils/reports';

const StaffOvertime = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" });
    const { data, isLoading, error } = useSWR('staff_overtime', async () => await getStaffOvertimes(page, limit, dateChange.startDate, dateChange.endDate));
    const handlePageChange = async (page: number) => {
        setPage(page);
        mutate('staff_overtime', await getStaffOvertimes(page, limit, dateChange.startDate, dateChange.endDate));
    }
    // handle limit change
    const handleChangeLimit = async (lm: number) => {
        setLimit(lm);
        mutate('staff_overtime', await getStaffOvertimes(page, limit, dateChange.startDate, dateChange.endDate));
    }
    // handle date change
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data)
        mutate('staff_overtime', await getStaffOvertimes(page, limit, data.startDate, data.endDate));
    }
    // if (error) {
    //     return <div>Error loading staff overtime data {error}</div>;
    // }
    return (
        <div className='my-2'>
            <Seo title="Staff Overtime" />
            <div className="flex sm:flex-row flex-col w-4/5 justify-between">
                <PageHeader title={`Staff Overtime (${data?.total ?? 0})`}
                    // download
                    // onDownload={() => exportStaffOvertimeRecords()}
                    item="Dashboard" active_item='Staff Overtime' />
                <DateFilterComponent
                    enableActions
                    exportData={() => exportStaffOvertimeRecords(dateChange.startDate, dateChange.endDate)}
                    handleFilter={handleDateChange} />
            </div>

            {data && (<StaffOvertimeDataTable
                updateLimit={handleChangeLimit}
                pendingData={data}
                updatePage={handlePageChange}
            />)}
        </div>
    );
};
StaffOvertime.layout = "Contentlayout";
export default StaffOvertime;