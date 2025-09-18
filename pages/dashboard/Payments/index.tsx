import React from 'react';
import LoaderComponent from '@/pages/components/LoaderComponent';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchPayments } from '@/utils/data_fetch';
import PaymentDataTable from './PaymentDataTable';
import useSWR from 'swr';
import DateFilterComponent, { DateFilterIF } from '../components/DateFilterComponent';
import { exportPaymentRecords } from '@/utils/reports';

const Payments = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" });
    // Using SWR to handle data fetching with proper dependency array
    const { data: payments, error, isValidating, mutate } = useSWR(
        [page, limit, dateChange.startDate, dateChange.endDate], 
        () => fetchPayments(page, limit, dateChange.startDate, dateChange.endDate)
    );

    // Handle page change for pagination
    const onChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidating) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidating]);

    const onChangeLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isValidating) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isValidating]);
    // Handle date filter changes
    const handleDateChange = React.useCallback((data: DateFilterIF) => {
        if (data.startDate !== dateChange.startDate || data.endDate !== dateChange.endDate) {
            setDateChange(data);
            setPage(1); // Reset to first page when changing filters
        }
    }, [dateChange.startDate, dateChange.endDate]);
    if (error) return <div>Error loading Payments: {error.message}</div>;

    return (
        <div>
            <Seo title="Payments" />
            <PageHeader title={`Payments (${payments?.totalDocuments ?? 0})`} item="Skooltym" active_item="Payments" />
            <DateFilterComponent
                enableActions
                exportData={() => exportPaymentRecords(dateChange.startDate, dateChange.endDate)}
                handleFilter={handleDateChange} />
            <PaymentDataTable
                clearedData={payments || null}
                updateLimit={onChangeLimit}
                updatePage={onChangePage}
                isLoading={isValidating}
            />
        </div>
    );
};

Payments.layout = "Contentlayout";
export default Payments;
