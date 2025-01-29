import Seo from '@/shared/layout-components/seo/seo';
import { getStaffLateRecords } from '@/utils/clocking';
import React from 'react';
import useSWR from 'swr';
import LateRecordsDataTable from './LateRecordsDataTable';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import LoaderComponent from '@/pages/components/LoaderComponent';
import DateFilterComponent, { DateFilterIF } from '../../components/DateFilterComponent';
import { exportStaffLateRecords } from '@/utils/reports';

const LateRecordsPage = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" });
    // fetching staff late records
    const { data: lateRecords, error, isValidating, mutate } = useSWR('staff_late_records', async () => await getStaffLateRecords(page));
    // handle page change
    const handleChangePage = async (page: number) => {
        setPage(page);
        const late = await getStaffLateRecords(page, limit, dateChange.startDate, dateChange.endDate);
        mutate(late)
    }
    // handle limit change
    const handleChangeLimit = async (lm: number) => {
        setLimit(lm);
        const late = await getStaffLateRecords(page, limit, dateChange.startDate, dateChange.endDate);
        mutate(late)
    }
    // handle date change
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data)
        const late = await getStaffLateRecords(page, limit, data.startDate, data.endDate);
        mutate(late);
    }
    return (
        <div className='my-2'>
            <Seo title="Late Records" />
            <div className="flex sm:flex-row flex-col w-4/5 justify-between">
                <PageHeader
                    title="Late Records"
                    item="Staff HR"
                    upload
                    onDownload={() => exportStaffLateRecords()} active_item='Late Records' />
                <DateFilterComponent handleFilter={handleDateChange} />
            </div>

            {
                (lateRecords && <LateRecordsDataTable
                    pendingData={lateRecords}
                    updateLimit={handleChangeLimit}
                    updatePage={handleChangePage} />)
            }
        </div>
    );
};
LateRecordsPage.layout = "Contentlayout";
export default LateRecordsPage;