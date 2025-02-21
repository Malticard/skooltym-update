import { ClassDataModel, ClassStream } from '@/interfaces/ClassDataModel';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchClassStreams } from '@/utils/data_fetch';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import { Spinner, Table } from 'react-bootstrap';

const ClassData = () => {
    // loading class data
    const [classLoading, setClassLoading] = React.useState<boolean>(true);
    // class data
    const [streams, setStreams] = React.useState<ClassStream[]>(
        []
    );
    // capture the class name
    const params = useParams();
    const queryParams = useSearchParams();
    const class_name = params?.class_name; // Safely access class_name

    // return streams under this class
    React.useEffect(() => {
        fetchClassStreams(class_name as string)
            .then((data) => {
                setClassLoading(false);
                if (data.status == 200) {
                    console.log(data.data)
                    setStreams(data.data);
                }
            })
            .catch((err) => {
                console.error(err);
                setClassLoading(false);
            });
    }, [class_name]);

    return (
        <>
            <PageHeader title={`${queryParams.get('class')} Streams`} link>
                <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{queryParams.get('class')} Streams</li>
            </PageHeader>
            <Seo title={`${queryParams.get('class')} Streams`} />
            <div className="container my-4">
                {classLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div>
                        <h2 className="mb-4">Class Streams</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Stream Name</th>
                                    <th> Number Of Students </th>
                                </tr>
                            </thead>
                            <tbody>
                                {streams?.map((data, index) => (
                                    <tr className='py-2' key={index}>
                                        <td>{index + 1}</td>
                                        <td className='cursor-pointer w-full'><Link className='w-full' suppressContentEditableWarning href={`/dashboard/${class_name}/${data._id}?c=${queryParams.get('class')}`}> {data.stream_name}  </Link></td>
                                        <td>{data.studentCount}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div >
        </>
    );
};

ClassData.layout = "Contentlayout"
export default ClassData;
