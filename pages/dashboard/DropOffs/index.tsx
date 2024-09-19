import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import React from 'react';

const ClearedOvertime = () => {

    return (
        <>
            <Seo title="Cleared Overtime" />
            <PageHeader title="Cleared Overtime" item="Ecommerce" active_item="Add Product" />

        </>
    );
};
ClearedOvertime.layout = "Contentlayout";
export default ClearedOvertime;