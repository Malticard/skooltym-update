import React from 'react'
import PageHeader from '@/shared/layout-components/page-header/page-header'
import Seo from '@/shared/layout-components/seo/seo';
import GuardianDataTable from './GuardiansDataTable';
import { fetchGuardians, fetchGuardianStudents, fetchStudentsNoPaginate } from '@/utils/data_fetch';
import useSWR from 'swr';
import { exportGuardianRecords } from '@/utils/reports';
import LoaderComponent from '@/pages/components/LoaderComponent';


const Guardian = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const { data: guardians, isValidating, isLoading, mutate: mutateGuardians } = useSWR(
        [page, limit], 
        () => fetchGuardians(page, limit), 
        {
            refreshInterval: 0, // Disable polling as we'll use WebSocket
            revalidateOnFocus: true, // Still revalidate on focus
            dedupingInterval: 2000, // Prevent duplicate requests
        }
    );
    const { data: students } = useSWR("students", async () => await fetchStudentsNoPaginate());
    // fetch guardian students
    const { data: guardianStudents } = useSWR("guardianStudents", async () => await fetchGuardianStudents());
    const [addModalShow, setAddModalShow] = React.useState(false);
    if (isLoading) {
        // return <LoaderComponent />
        return
    }
    // methods for change of page
    const onChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidating) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidating]);
    const handleUpdatesSync = React.useCallback(() => {
        mutateGuardians(); // Re-fetch data after update
    }, [mutateGuardians]);
    // handle limit
    const onChangeLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isValidating) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isValidating]);

    return (
        <div className='my-2'>
            <Seo title="Guardians" />
            <PageHeader
                title={`Guardians (${guardians?.totalDocuments ?? 0})`}
                item="Skooltym"
                active_item="Guardians"
                buttonText="Add Guardian"
                upload
                typeOfUpload='guardian'
                onDownload={() => exportGuardianRecords()}
                onTap={() => {
                    setAddModalShow(true);
                }}
                dataTour='add-guardian'
            />
            {/* <!-- Row --> */}
            <GuardianDataTable
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                guardianStudents={guardianStudents}
                students={students ?? []}
                handleSync={handleUpdatesSync}
                updatePage={onChangePage}
                updateLimit={onChangeLimit}
                guardians={guardians || null}
                isLoading={isValidating}
            />
            {/* <!-- End Row --> */}
        </div>
    )
}

Guardian.layout = "Contentlayout"
export default Guardian