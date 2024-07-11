import React from 'react'

import PageHeader from '@/shared/layout-components/page-header/page-header'
import "react-data-table-component-extensions/dist/index.css";
import Seo from '@/shared/layout-components/seo/seo';
import { BasicDatatable, Hoverdatatable } from '@/shared/data/table/data-tables';
const Orders = () => {

    return (
        <>
            <Seo title="Students" />
            <PageHeader
                title="Students"
                item="Skooltym"
                active_item="Students"
                buttonText="Add Student"
                onTap={() => {
                    alert(`Student`);
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


