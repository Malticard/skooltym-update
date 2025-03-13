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
    // Using SWR to handle data fetching
    const { data: payments, error, isValidating, mutate } = useSWR([page, limit, dateChange.startDate, dateChange.endDate], () => fetchPayments(page));

    // Handle page change for pagination
    const onChangePage = (newPage: number) => {
        setPage(newPage); // SWR will refetch when page changes
        const result = fetchPayments(newPage, limit, dateChange.startDate, dateChange.endDate);
        mutate(result);
    };

    const onChangeLimit = async (newLimit: number) => {
        setLimit(newLimit);
        const result = await fetchPayments(page, limit, dateChange.startDate, dateChange.endDate)
        mutate(result);
    }
    // handle date 
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data)
        const result = await fetchPayments(page, limit, data.startDate, data.endDate);
        mutate(result);
    }
    if (error) return <div>Error loading Payments: {error.message}</div>;

    return (
        <div>
            <Seo title="Payments" />
            <PageHeader title={`Payments (${payments?.totalDocuments ?? 0})`} item="Skooltym" active_item="Payments" />
            <DateFilterComponent
                enableActions
                exportData={() => exportPaymentRecords(dateChange.startDate, dateChange.endDate)}
                handleFilter={handleDateChange} />
            {payments && (
                <PaymentDataTable
                    clearedData={payments}
                    updateLimit={onChangeLimit}
                    updatePage={onChangePage}
                />
            )}
        </div>
    );
};

Payments.layout = "Contentlayout";
export default Payments;
