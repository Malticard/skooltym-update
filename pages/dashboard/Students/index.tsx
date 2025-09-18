import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import "react-data-table-component-extensions/dist/index.css";
import Seo from '@/shared/layout-components/seo/seo';
import useSWR from 'swr';
import { fetchClasses, fetchStudents } from '@/utils/data_fetch';
import StudentsDataTable from './StudentsDataTable';
import { exportStudents } from '@/utils/reports';


const Orders = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [addModalShow, setAddModalShow] = React.useState(false);

    // Custom fetcher with dynamic arguments (e.g., page)
    const { data: students, error, mutate, isValidating } = useSWR(
        [page, limit], 
        () => fetchStudents(page, limit)
    );
    const { data: classes } = useSWR("fetchClasses", async () => await fetchClasses(1, 100));
    // Handle pagination changes
    const onChangePage = React.useCallback((newPage: number) => {
        if (newPage !== page && !isValidating) {
            setPage(newPage); // SWR will automatically refetch when dependencies change
        }
    }, [page, isValidating]);

    // Update student data and revalidate
    const handleUpdateStudent = React.useCallback(() => {
        mutate(); // Re-fetch data after update
    }, [mutate]);
    const onChangeLimit = React.useCallback((newLimit: number) => {
        if (newLimit !== limit && !isValidating) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when changing limit
        }
    }, [limit, isValidating]);

    return (
        <>
            <Seo title="Students & Reports" />
            <PageHeader
                title={`Students (${students?.totalDocuments ?? 0})`}
                item="Skooltym"
                active_item="Students"
                buttonText="Add Student"
                typeOfUpload='student'
                upload
                download
                onTap={() => setAddModalShow(true)}
                onDownload={() => exportStudents()}
                dataTour='add-student'
            />
            {/* Data Table */}
            <StudentsDataTable
                addModalShow={addModalShow}
                setAddModalShow={setAddModalShow}
                classes={classes?.results ?? []}
                updatePage={onChangePage}
                updateLimit={onChangeLimit}
                students={students}
                handleUpdates={handleUpdateStudent}
                isLoading={isValidating}
            />
        </>
    );
};

Orders.layout = "Contentlayout";

export default Orders;
