import React from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
import dynamic from "next/dynamic";
import { IconEdit, IconTrash } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import { deleteStreamData } from '@/utils/data_fetch';
import { OvertimeModel, Overtimes } from '@/interfaces/OvertimeModel';

const DataTableExtensions: any = dynamic(() => import('react-data-table-component-extensions'), {
    ssr: false
});

export default function PendingDataTable({
    pendingData,
    updatePage
}: {
    updatePage: (value: number) => void;
    pendingData: OvertimeModel;
}) {
    // Initialize states with safe default values
    const [data, setData] = React.useState<Overtimes[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalDocuments, setTotalDocuments] = React.useState(0);

    // Update state when pendingData changes
    React.useEffect(() => {
        if (pendingData) {
            setData(pendingData.results || []);
            setCurrentPage(pendingData.currentPage || 1);
            setPageSize(pendingData.pageSize || 10);
            setTotalDocuments(pendingData.totalDocuments || 0);
        }
    }, [pendingData]);

    const columns = [
        {
            name: "Student Picture".toLocaleUpperCase(),
            cell: (row: Overtimes) => (
                <img
                    className="rounded-full w-12 h-12 object-cover"
                    src={row.student.studentProfilePic}
                    alt={`${row.student.studentFname}'s picture`}
                    width={48}
                    height={48}
                />
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
        {
            name: "Student".toLocaleUpperCase(),
            selector: (row: Overtimes) => `${row.student.studentFname} ${row.student.studentLname}`,
            sortable: true
        },
        {
            name: "Guardian".toLocaleUpperCase(),
            selector: (row: Overtimes) => `${row.guardian.guardianFname} ${row.guardian.guardianLname}`,
            sortable: true
        },
        {
            name: "Overtime Charge".toLocaleUpperCase(),
            selector: (row: Overtimes) => `UGX ${row.overtimeCharge.toLocaleString()}`,
            sortable: true,
            right: true
        },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updatePage(page);
    };

    const tableData = {
        columns,
        data,
    };

    return (
        <DataTableExtensions {...tableData}>
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationServer
                paginationTotalRows={totalDocuments}
                paginationDefaultPage={currentPage}
                paginationPerPage={pageSize}
                onChangePage={handlePageChange}
                responsive
                striped
                highlightOnHover
            />
        </DataTableExtensions>
    );
}