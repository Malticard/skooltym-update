import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchClearedOvertime } from '@/utils/data_fetch';
import React from 'react';
import ClearedDataTable from './ClearedDatatable';
import DateFilterComponent, { DateFilterIF } from '../components/DateFilterComponent';
import useSWR from 'swr';
import { exportClearedRecords } from '@/utils/reports';

const ClearedOvertime = () => {

    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [dataChange, setDataChange] = React.useState<DateFilterIF>({ startDate: "", endDate: "" })
    // load data
    const { data: cleared, mutate, error } = useSWR([page, limit, dataChange.startDate, dataChange.endDate], async () => await fetchClearedOvertime(page, limit, dataChange.startDate, dataChange.endDate));
    // on change of page
    const onChangePage = (page: number) => {
        setPage(page);
        const result = fetchClearedOvertime(page, limit, dataChange.startDate, dataChange.endDate);
        mutate(result);
    }
    // handle limit change
    const onChangeLimit = async (lm: number) => {
        setLimit(lm);
        const result = await fetchClearedOvertime(page, limit, dataChange.startDate, dataChange.endDate);
        mutate(result);
    }
    // handle date change 
    const handleDateChange = async (data: DateFilterIF) => {
        setDataChange(data)
        const result = await fetchClearedOvertime(page, limit, data.startDate, data.endDate);
        mutate(result);
    }
    return (
        <div className='my-2'>
            <Seo title="Cleared Overtime" />
            <div className="flex sm:flex-row flex-col w-4/5 justify-center">
                <PageHeader
                    title={`Cleared Overtime (${cleared?.totalDocuments ?? 0})`}
                    item="Skooltym"
                    // upload
                    // onDownload={() => exportClearedRecords()}
                    active_item="Cleared Overtime"
                />
                <DateFilterComponent enableActions exportData={() => exportClearedRecords(dataChange.startDate, dataChange.endDate)} handleFilter={handleDateChange} />
            </div>


            {
                cleared && (
                    <ClearedDataTable
                        clearedData={cleared}
                        updatePage={onChangePage}
                        updateLimit={onChangeLimit}
                    />
                )
            }
        </div>
    );
};
ClearedOvertime.layout = "Contentlayout";
export default ClearedOvertime;