import Seo from '@/shared/layout-components/seo/seo';
import { getStaffLateRecords } from '@/utils/clocking';
import React from 'react';
import useSWR from 'swr';
import LateRecordsDataTable from './LateRecordsDataTable';
import PageHeader from '@/shared/layout-components/page-header/page-header';

const LateRecordsPage = () => {
    const [page, setPage] = React.useState(1);
    // fetching staff late records
    const { data: lateRecords, error, isValidating } = useSWR('staff_late_records', () => getStaffLateRecords(page));
    return (
        <div>
            <Seo title="Late Records" />
            <PageHeader title="Late Records" item="Staff HR" active_item='Late Records' />
            {lateRecords && <LateRecordsDataTable pendingData={lateRecords} updatePage={(page: number) => setPage(page)} />}
        </div>
    );
};
LateRecordsPage.layout = "Contentlayout";
export default LateRecordsPage;