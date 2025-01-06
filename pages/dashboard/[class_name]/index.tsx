import { ClassDataModel } from '@/interfaces/ClassDataModel';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchDashBoardData } from '@/utils/data_fetch';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { Spinner, Table } from 'react-bootstrap';

const ClassData = () => {
    // loading class data
    const [classLoading, setClassLoading] = React.useState<boolean>(true);
    // class data
    const [classData, setClassData] = React.useState<ClassDataModel | undefined>(
        {} as ClassDataModel
    );
    // capture the class name
    const params = useParams();
    const class_name = params?.class_name; // Safely access class_name

    // return streams under this class
    React.useEffect(() => {
        fetchDashBoardData()
            .then((data) => {
                setClassLoading(false);
                if (class_name) {
                    const filteredData = data.filter((data) => data.class_name === class_name);
                    console.log(filteredData);
                    setClassData(filteredData.at(0));
                }
            })
            .catch((err) => {
                console.error(err);
                setClassLoading(false);
            });
    }, [class_name]);

    return (
        <>
            <PageHeader title={`${class_name} Streams`} link>
                <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{class_name} Streams</li>
            </PageHeader>
            <Seo title={`${class_name} Streams`} />
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
                                    {/* <th>Stream ID</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {classData?.class_streams?.map((data, index) => (
                                    <tr className='py-2' key={index}>
                                        <td>{index + 1}</td>
                                        <td className='cursor-pointer w-full'><Link className='w-full' suppressContentEditableWarning href={`/dashboard/${class_name}/${data._id}`}> {data.stream_name}  </Link></td>
                                        {/* <td>{data._id}</td> */}
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
