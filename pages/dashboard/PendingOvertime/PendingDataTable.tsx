import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import { deleteStreamData } from '@/utils/data_fetch';
import { OvertimeModel, Overtimes } from '@/interfaces/OvertimeModel';



const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), { ssr: false });

export default function PendingDataTable({ pendingData, updatePage }: { updatePage: (value: number) => void; pendingData: OvertimeModel; }) {
    const [data, setData] = React.useState<Overtimes[]>(pendingData.results);
    // State to hold pagination details
    const [currentPage, setCurrentPage] = React.useState(pendingData.currentPage || 1);
    const [pageSize] = React.useState(pendingData.pageSize || 10);
    const [totalDocuments, setTotalDocuments] = React.useState(pendingData.totalDocuments || 0);
    // Update the data when the students prop changes
    const columns: any = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            selector: (row: Overtimes) => [row.student.studentProfilePic],
            sortable: true
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: Overtimes) => [`${row.student.studentFname} ${row.student.studentLname}`],
            sortable: true
        },
        {
            name: "Guardian".toLocaleUpperCase(),
            selector: (row: Overtimes) => [`${row.guardian.guardianFname} ${row.guardian.guardianLname}`],
            sortable: true
        },
        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: Overtimes) => [`UGX ${row.overtimeCharge}`],
            sortable: true
        },
    ];

    // Function to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };
    const tableDatas = {
        columns,
        data,
    };
    return (
        <>
            <DataTableExtensions {...tableDatas} >
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    paginationServer
                    paginationTotalRows={totalDocuments}
                    paginationDefaultPage={currentPage}
                    paginationPerPage={pageSize}
                    onChangePage={handlePageChange}
                />
            </DataTableExtensions>
        </>

    );
}