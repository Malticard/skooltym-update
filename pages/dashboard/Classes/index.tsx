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
    const page = Number(router.query.page) || 1;

    const { data: classes, error: classError, mutate: mutateClasses, isValidating: isValidatingClasses } = useSWR(
        ['fetchClasses', page],
        () => fetchClasses(page),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0,
            dedupingInterval: 5000, // 5 seconds
            onError: (err) => console.error('Error fetching classes:', err)
        }
    );

    const { data: streams, error: streamError } = useSWR('streams', () => fetchStream(1, 100), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        dedupingInterval: 5000, // 5 seconds
        onError: (err) => console.error('Error fetching streams:', err)
    });

    React.useEffect(() => {
        if (!classes && !isValidatingClasses) {
            mutateClasses();
        }
    }, [classes, isValidatingClasses, mutateClasses]);

    const onChangePage = (newPage: number) => {
        router.push({ query: { ...router.query, page: newPage } }, undefined, { shallow: true });
    };

    const handleUpdates = async () => {
        const cls = await fetchClasses(page);
        mutateClasses(cls, true);
    };

    if (classError || streamError) {
        return <div>Error loading data: {classError?.message || streamError?.message}</div>;
    }

    return (
        <div>
            <Seo title='Classes' />
            <PageHeader
                title='Classes'
                item='Skooltym'
                active_item='Classes'
                buttonText='Add Class'
                onTap={() => setAddModalShow(true)}
            />
            {isValidatingClasses ? (
                <LoaderComponent />
            ) : (
                <ClassDataTable
                    loadingClasses={isValidatingClasses}
                    streams={streams?.results ?? []}
                    addModalShow={addModalShow}
                    setAddModalShow={setAddModalShow}
                    updatePage={onChangePage}
                    classData={classes as ClassResponse}
                    handleUpdates={handleUpdates}
                    updateRows={onChangePage}
                />
            )}
        </div>
    );
};

Classes.layout = "Contentlayout";
export default Classes;