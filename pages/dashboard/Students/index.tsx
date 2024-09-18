import React from 'react'
import PageHeader from '@/shared/layout-components/page-header/page-header'
import "react-data-table-component-extensions/dist/index.css";
import Seo from '@/shared/layout-components/seo/seo';
import { useRouter } from 'next/navigation';
import { fetchClasses, fetchStream, fetchStudents } from '@/utils/data_fetch';
import { StudentsDataTable } from './StudentsDataTable';
import { StudentsModel } from '@/interfaces/StudentsModel';
import { SchoolClass } from '@/interfaces/ClassModel';
import { Stream } from '@/interfaces/StreamModel';
const Orders = () => {
    const router = useRouter();
    const [students, setStudents] = React.useState<StudentsModel>(null as unknown as StudentsModel);
    const [loadingData, setLoadingData] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [classes, setClasses] = React.useState<SchoolClass[]>([]);
    const [streams, setStreams] = React.useState<Stream[]>([]);
    const [addModalShow, setAddModalShow] = React.useState(false);
    // load data
    React.useEffect(() => {
        setLoadingData(true);
        fetchStudents().then((res) => {
            setStudents(res);
            setLoadingData(false);
        }).catch((err) => {
            setLoadingData(false);
        });
        // fetching classes
        fetchClasses(1, 30).then((res) => {
            setClasses(res.results)
            // res.results.map((res) => console.log(res._id));
            setLoading(false)
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
        // fetching stream
        fetchStream().then((res) => {
            setStreams(res.results);
            setLoadingData(false);
        })
    }, []);
    // methods for change of page
    const onChangePage = (page: number) => {
        setLoading(true);
        fetchStudents(page).then((res) => {
            setStudents(res);
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }
    return (
        <>
            <Seo title="Students" />
            <PageHeader
                title="Students"
                item="Skooltym"
                active_item="Students"
                buttonText="Add Student"
                onTap={() => {
                    setAddModalShow(true);
                }}
            />
            {/* data table */}
            {
                loadingData ? <div className="text-center">Loading...</div> : students && (<StudentsDataTable streams={streams} addModalShow={addModalShow} setAddModalShow={setAddModalShow} loadingClasses={loading} classes={classes} updatePage={onChangePage} students={students} />)
            }

            {/* end of data table */}
        </>
    )
}

Orders.layout = "Contentlayout"


export default Orders


