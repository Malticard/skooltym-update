import React from 'react';
import { useRouter } from 'next/router';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchClasses, fetchStream } from '@/utils/data_fetch';
import ClassDataTable from './ClassDataTable';
import { ClassResponse } from '@/interfaces/ClassesModel';
import { Stream } from '@/interfaces/StreamModel';
import LoaderComponent from '@/pages/components/LoaderComponent';
import useSWR from 'swr';
const Classes = () => {
    const [addModalShow, setAddModalShow] = React.useState(false);
    const router = useRouter();
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const { data: classes, error: classError, mutate: mutateClasses, isValidating: isValidatingClasses } = useSWR(
        [page, limit],
        () => fetchClasses(page, limit),
    );

    const { data: streams, error: streamError } = useSWR('streams', async () => await fetchStream(1, 100));

    const onChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidatingClasses) {
            router.push({ query: { ...router.query, page: newPage } }, undefined, { shallow: true });
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidatingClasses, router]);

    const handleUpdates = React.useCallback(() => {
        mutateClasses(); // Re-fetch data after update
    }, [mutateClasses]);

    // handle updated limit
    const handleLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isValidatingClasses) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isValidatingClasses]);

    if (classError || streamError) {
        return <div>Error loading data: {classError?.message || streamError?.message}</div>;
    }

    return (
        <div className='my-2'>
            <Seo title='Classes' />
            <PageHeader
                title={`Classes (${classes?.totalDocuments ?? 0})`}
                item='Skooltym'
                active_item='Classes'
                buttonText='Add Class'
                onTap={() => setAddModalShow(true)}
                dataTour='add-class'
            />
            <ClassDataTable
                loadingClasses={false}
                streams={streams?.results ?? []}
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                updatePage={onChangePage}
                classData={classes || null}
                handleUpdates={handleUpdates}
                updateRows={handleLimit}
                isLoading={isValidatingClasses}
            />
        </div>
    );
};

Classes.layout = "Contentlayout";
export default Classes;