import { StudentsModel } from '@/interfaces/StudentsModel';
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import { data } from '@/shared/data/crypto-currencies/transcationdetails';
import { fetchStudentsInStream } from '@/utils/helpers';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React from 'react';
import StudentsInStreamTable from './StudentsInStreamTable';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import Link from 'next/link';
const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

const StreamStudents = () => {
    const param = useParams();
    const stream_name = param?.stream_name;
    const [data, setData] = React.useState<StudentsModel>({} as StudentsModel);
    React.useEffect(() => {
        if (stream_name) {
            console.log(stream_name);
            fetchStudentsInStream(stream_name as string).then((res) => {
                console.log(res);
                setData(res);
            })
        }
    }, []);

    return (
        <div>
            <PageHeader link title="Stream Students">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link href='/dashboard/'>Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link href={`/dashboard/${param?.class_name}`}>{param?.class_name} Streams</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Stream Students</li>
                </ol>
            </PageHeader>
            <Seo title="Stream Students" />

            {/* <h2>Stream Students {stream_name}</h2> */}
            <StudentsInStreamTable
                students={data}
                handleUpdates={() => { }}
                addModalShow={false}
                setAddModalShow={(value: React.SetStateAction<boolean>) => { }}
                streams={[]} loadingClasses={false}
                classes={[]}
                updatePage={(value: number) => { }}
            />
        </div>
    );
};
StreamStudents.layout = "Contentlayout";
export default StreamStudents;