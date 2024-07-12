import React from 'react'

import PageHeader from '@/shared/layout-components/page-header/page-header'
import "react-data-table-component-extensions/dist/index.css";
import Seo from '@/shared/layout-components/seo/seo';
import { BasicDatatable } from '@/shared/data/table/data-tables';
import { useRouter } from 'next/navigation';
const AddStudent = () => {
    const router = useRouter();
    return (
        <>
            <Seo title="Add Students" />
            <PageHeader
                title="Add Students"
                item="Skooltym"
                active_item="Students"
            />
            {/* data table */}

            {/* end of data table */}
        </>
    )
}

AddStudent.layout = "Contentlayout"


export default AddStudent;


