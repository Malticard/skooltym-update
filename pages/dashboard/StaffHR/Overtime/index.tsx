import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import React from 'react';
import StaffOvertimeDataTable from './StaffOvertimeDataTable';
import useSWR, { mutate } from 'swr';
import { getStaffOvertimes } from '@/utils/clocking';

const StaffOvertime = () => {
    const [page, setPage] = React.useState(1);
    const { data, isLoading, error } = useSWR('staff_overtime', () => getStaffOvertimes(page));
    const handlePageChange = (page: number) => {
        setPage(page);
        mutate('staff_overtime', getStaffOvertimes(page));
    }
    return (
        <div>
            <Seo title="Staff Overtime" />
            <PageHeader title="Staff Overtime" item="Dashboard" active_item='Staff Overtime' />
            <StaffOvertimeDataTable pendingData={data} updatePage={handlePageChange} />
        </div>
    );
};
StaffOvertime.layout = "Contentlayout";
export default StaffOvertime;