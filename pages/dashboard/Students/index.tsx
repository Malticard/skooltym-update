import React from 'react'

import PageHeader from '@/shared/layout-components/page-header/page-header'
import "react-data-table-component-extensions/dist/index.css";
import Seo from '@/shared/layout-components/seo/seo';
import { BasicDatatable } from '@/shared/data/table/data-tables';
import { useRouter } from 'next/navigation';
const Orders = () => {
    const router = useRouter();
    return (
        <>
            <Seo title="Students" />
            <PageHeader
                title="Students"
                item="Skooltym"
                active_item="Students"
                buttonText="Add Student"
                onTap={() => {
                    router.push(`/dashboard/Students/AddStudent`);
                }}
            />
            {/* data table */}
            <BasicDatatable />
            {/* end of data table */}
        </>
    )
}

Orders.layout = "Contentlayout"


export default Orders


