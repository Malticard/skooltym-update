import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import "react-data-table-component-extensions/dist/index.css";
import Seo from '@/shared/layout-components/seo/seo';
import useSWR from 'swr';
import { fetchClasses, fetchStream, fetchStudents } from '@/utils/data_fetch';
import StudentsDataTable from './StudentsDataTable';
import { StudentsModel } from '@/interfaces/StudentsModel';
import { SchoolClass } from '@/interfaces/ClassModel';
import { Stream } from '@/interfaces/StreamModel';
import LoaderComponent from '@/pages/components/LoaderComponent';
import AppUrls from '@/utils/apis';

const Orders = () => {
    const [page, setPage] = React.useState(1);
    const [classes, setClasses] = React.useState<SchoolClass[]>([]);
    const [streams, setStreams] = React.useState<Stream[]>([]);
    const [addModalShow, setAddModalShow] = React.useState(false);

    // Custom fetcher with dynamic arguments (e.g., page)
    const { data: students, error, isValidating, mutate } = useSWR([AppUrls.students, page], () => fetchStudents(page));

    // Fetch static data once for classes and streams
    React.useEffect(() => {
        const fetchStaticData = async () => {
            try {
                const classRes = await fetchClasses(1, 100);
                const streamRes = await fetchStream();
                setClasses(classRes.results);
                setStreams(streamRes.results);
            } catch (error) {
                console.error("Error fetching static data:", error);
            }
        };
        fetchStaticData();
    }, []);

    // Handle pagination changes
    const onChangePage = (newPage: number) => {
        setPage(newPage); // Update the page state, SWR will re-fetch the data for the new page
    };

    // Update student data and revalidate
    const handleUpdateStudent = async () => {
        try {
            await fetchStudents();
            mutate(fetchStudents()); // Re-fetch data after update
        } catch (error) {
            console.error("Error updating student:", error);
        }
    };

    if (isValidating) {
        return <LoaderComponent />;
    }
    //  return <LoaderComponent />;

    return (
        <>
            <Seo title="Students" />
            <PageHeader
                title="Students"
                item="Skooltym"
                active_item="Students"
                buttonText="Add Student"
                onTap={() => setAddModalShow(true)}
            />
            {/* Data Table */}
            {students && (
                <StudentsDataTable
                    streams={streams}
                    addModalShow={addModalShow}
                    setAddModalShow={setAddModalShow}
                    loadingClasses={isValidating}
                    classes={classes}
                    updatePage={onChangePage}
                    students={students}
                    handleUpdates={handleUpdateStudent} // Pass update function
                />
            )}
        </>
    );
};

Orders.layout = "Contentlayout";

export default Orders;
