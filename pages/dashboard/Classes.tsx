import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import React from 'react';

const Classes = () => {
    return (
        <div>
            <Seo title='Classes' />
            <PageHeader title='Classes' item='Ecommerce' active_item='Classes' />
        </div>
    );
};
Classes.layout = "Contentlayout";
export default Classes;