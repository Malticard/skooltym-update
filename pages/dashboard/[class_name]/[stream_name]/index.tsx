import { StudentsModel } from '@/interfaces/StudentsModel';
import { fetchStudentsInStream } from '@/utils/helpers';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import StudentsInStreamTable from './StudentsInStreamTable';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import Link from 'next/link';
import useSWR from 'swr';
import LoaderComponent from '@/pages/components/LoaderComponent';
const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

const StreamStudents = () => {

    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(5);
    const { data: students, error, isLoading, mutate } = useSWR("fetchStudentsInStream", () => fetchStudentsInStream(stream_name as string, page, limit));

    const param = useParams();
    const queryParams = useSearchParams();
    const stream_name = param?.stream_name;

    return (
        <div>
            <PageHeader link title="Stream Students">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link href='/dashboard/'>Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link href={`/dashboard/${param?.class_name}?class=${queryParams.get('c')}`}>{queryParams.get('c')} Streams</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Stream Students</li>
                </ol>
            </PageHeader>
            <Seo title="Stream Students" />

            {/* <h2>Stream Students {stream_name}</h2> */}
            {isLoading ? (<>
                <LoaderComponent />
            </>) : (<StudentsInStreamTable
                students={students}
                updateLimit={
                    (limit) => setLimit(limit)
                }
                handleUpdates={() => { }}
                updatePage={(value: number) => {
                    setPage(value);
                }}
            />)}
        </div>
    );
};
StreamStudents.layout = "Contentlayout";
export default StreamStudents;