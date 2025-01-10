import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import "react-data-table-component-extensions/dist/index.css";
import Seo from '@/shared/layout-components/seo/seo';
import useSWR from 'swr';
import { fetchClasses, fetchStream, fetchStudents } from '@/utils/data_fetch';
import StudentsDataTable from './StudentsDataTable';


const Orders = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [addModalShow, setAddModalShow] = React.useState(false);

    // Custom fetcher with dynamic arguments (e.g., page)
    const { data: students, error, mutate } = useSWR("fetchStudents", () => fetchStudents(page, limit));
    const { data: classes } = useSWR("fetchClasses", async () => await fetchClasses(1, 100));
    const { data: streams } = useSWR("fetchStream", async () => await fetchStream(1, 100));
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
    const onChangeLimit = async (lm: number) => {
        setLimit(lm);
        const result = await fetchStudents(page, limit);
        mutate(result);
    }

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
                    streams={streams?.results ?? []}
                    addModalShow={addModalShow}
                    setAddModalShow={setAddModalShow}
                    loadingClasses={false}
                    classes={classes?.results ?? []}
                    updatePage={onChangePage}
                    updateLimit={onChangeLimit}
                    students={students}
                    handleUpdates={handleUpdateStudent} // Pass update function
                />
            )}
        </>
    );
};

Orders.layout = "Contentlayout";

export default Orders;
