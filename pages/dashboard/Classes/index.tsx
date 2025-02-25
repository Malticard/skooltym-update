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
        "fetchClasses",
        async () => await fetchClasses(page, limit),
    );

    const { data: streams, error: streamError } = useSWR('streams', () => fetchStream(1, 1000));

    const onChangePage = async (newPage: number) => {
        router.push({ query: { ...router.query, page: newPage } }, undefined, { shallow: true });
        setPage(newPage);
        const result = await fetchClasses(newPage, limit);
        mutateClasses(result);
    };

    const handleUpdates = async () => {
        const cls = await fetchClasses(page, limit);
        mutateClasses(cls);
    };

    // handle updated limit
    const handleLimit = async (lm: number) => {
        setLimit(lm);
        const cls = await fetchClasses(page, limit);
        mutateClasses(cls);
    }

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
            />
            {classes && (
                <ClassDataTable
                    loadingClasses
                    streams={streams?.results ?? []}
                    addModalShow={addModalShow}
                    setAddModalShow={setAddModalShow}
                    updatePage={onChangePage}
                    classData={classes as ClassResponse}
                    handleUpdates={handleUpdates}
                    updateRows={handleLimit}
                />
            )}
        </div>
    );
};

Classes.layout = "Contentlayout";
export default Classes;