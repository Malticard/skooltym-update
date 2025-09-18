import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchSpecificOvertime } from '@/utils/data_fetch';
import React from 'react';
import PendingDataTable from './PendingDataTable';
import DateFilterComponent, { DateFilterIF } from '../components/DateFilterComponent';
import useSWR from 'swr';
import { AuthenticatedUserModel } from '@/interfaces/AuthenticatedUserModel';

const PendingOvertime = () => {
    const [page, setPages] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [user, setUser] = React.useState<AuthenticatedUserModel>({} as AuthenticatedUserModel)
    const [dateChange, setDateChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" })
    // Using SWR to handle data fetching with proper dependency array
    const { data: pending, mutate, error, isValidating } = useSWR(
        [page, limit, dateChange.startDate, dateChange.endDate], 
        () => fetchSpecificOvertime(page, limit, dateChange.startDate, dateChange.endDate)
    );
    // Handle page change for pagination
    const onChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidating) {
            setPages(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidating]);
    const handleDateChange = React.useCallback((data: DateFilterIF) => {
        if (data.startDate !== dateChange.startDate || data.endDate !== dateChange.endDate) {
            setDateChange(data);
            setPages(1); // Reset to first page when changing filters
        }
    }, [dateChange.startDate, dateChange.endDate]);
    const changeLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isValidating) {
            setLimit(newLimit);
            setPages(1); // Reset to first page when changing limit
        }
    }, [limit, isValidating]);
    React.useEffect(() => {
        const result = JSON.parse(localStorage.getItem("skooltym_user") as string) as AuthenticatedUserModel;
        setUser(result);
    }, []);
    return (
        <div className='my-2'>
            <Seo title="Pending Overtime" />
            {user.role == 'Admin' ? (<div className="flex sm:flex-row flex-col w-4/5 justify-between">
                <PageHeader
                    title={`Pending Overtime (${pending?.totalDocuments})`}
                    item="Skooltym"
                    active_item="Pending Overtime"
                />
                <DateFilterComponent
                    enableActions

                    handleFilter={handleDateChange} />
            </div>) : (
                <>
                    <PageHeader
                        title={`Pending Overtime (${pending?.totalDocuments ?? 0})`}
                        item="Skooltym"
                        active_item="Pending Overtime"
                    />
                    <DateFilterComponent handleFilter={handleDateChange} />
                </>
            )}


            <PendingDataTable
                pendingData={pending || null}
                updatePage={onChangePage}
                updateLimit={changeLimit}
                isLoading={isValidating}
            />
        </div>
    );
};
PendingOvertime.layout = "Contentlayout";
export default PendingOvertime;