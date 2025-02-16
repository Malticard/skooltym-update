import React from 'react'
import PageHeader from '@/shared/layout-components/page-header/page-header'
import Seo from '@/shared/layout-components/seo/seo';
import GuardianDataTable from './GuardiansDataTable';
import { fetchGuardians, fetchStudentsNoPaginate } from '@/utils/data_fetch';
import useSWR from 'swr';
import { exportGuardianRecords } from '@/utils/reports';


const Guardian = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const { data: guardians, error, mutate: mutateGuardians } = useSWR("fetchGuardians", async () => await fetchGuardians(page, limit));
    const { data: students, mutate: mutateStudent } = useSWR("students", async () => await fetchStudentsNoPaginate());
    const [addModalShow, setAddModalShow] = React.useState(false);

    // methods for change of page
    const onChangePage = async (page: number) => {
        setPage(page)
        const result = await fetchGuardians(page, limit);
        mutateGuardians(result);
    }
    // handle limit
    const onChangeLimit = async (newLimit: number) => {
        setLimit(newLimit)
        const result = await fetchGuardians(page, limit);
        mutateGuardians(result);
    }
    return (
        <div className='my-2'>
            <Seo title="Guardians" />
            <PageHeader
                title={`Guardians (${guardians?.totalDocuments})`}
                item="Skooltym"
                active_item="Guardians"
                buttonText="Add Guardian"
                upload
                typeOfUpload='guardian'
                onDownload={() => exportGuardianRecords()}
                onTap={() => {
                    setAddModalShow(true);
                }}
            />
            {/* <!-- Row --> */}
            {guardians && (<GuardianDataTable
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                students={students ?? []}
                updatePage={onChangePage}
                updateLimit={onChangeLimit}
                guardians={guardians}
            />)}
            {/* <!-- End Row --> */}
        </div>
    )
}

Guardian.layout = "Contentlayout"
export default Guardian