import { OvertimeModel } from '@/interfaces/OvertimeModel';
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
    // load data
    // payment modal
    const [openAddPayment, setOpenAddPayment] = React.useState(false);
    const { data: pending, mutate, error } = useSWR([page, limit, dateChange.startDate, dateChange.endDate], async () => await fetchSpecificOvertime(page, limit, dateChange.startDate, dateChange.endDate));
    // on change of page
    const onChangePage = (data: number) => {
        setPages(data);
        const result = fetchSpecificOvertime(page, limit, dateChange.startDate, dateChange.endDate)
        mutate(result);
    }
    const handleDateChange = async (data: DateFilterIF) => {
        setDateChange(data);
        const result = await fetchSpecificOvertime(page, limit, dateChange.startDate, dateChange.endDate)
        mutate(result);
    }
    const changeLimit = async (data: number) => {
        setLimit(data);
        const result = await fetchSpecificOvertime(page, limit, dateChange.startDate, dateChange.endDate)
        mutate(result);
    }
    React.useEffect(() => {
        const result = JSON.parse(localStorage.getItem("skooltym_user") as string) as AuthenticatedUserModel;
        setUser(result);
    }, []);
    return (
        <div className='my-2'>
            <Seo title="Pending Overtime" />
            {user.role == 'Admin' ? (<div className="flex sm:flex-row flex-col w-4/5 justify-between">
                <PageHeader
                    title="Pending Overtime"
                    item="Skooltym"
                    active_item="Pending Overtime"
                    buttonText={user.role == 'Admin' ? '' : 'Add Payment'}
                    onTap={() => setOpenAddPayment(true)}
                />
                <DateFilterComponent handleFilter={handleDateChange} />
            </div>) : (
                <>
                    <PageHeader
                        title={`Pending Overtime (${pending?.totalDocuments})`}
                        item="Skooltym"
                        active_item="Pending Overtime"
                        buttonText={user.role == 'Admin' ? '' : 'Add Payment'}
                        onTap={() => setOpenAddPayment(true)}
                    />
                    <DateFilterComponent handleFilter={handleDateChange} />
                </>
            )}


            {
                pending && (
                    <PendingDataTable
                        pendingData={pending}
                        openAddPayment={openAddPayment}
                        setAddPayment={setOpenAddPayment}
                        updatePage={onChangePage}
                        updateLimit={changeLimit}
                    />
                )
            }
        </div>
    );
};
PendingOvertime.layout = "Contentlayout";
export default PendingOvertime;