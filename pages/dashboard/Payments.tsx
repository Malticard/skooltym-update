import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import React from 'react';

const Payments = () => {
    return (
        <div>
            <Seo title='Payments' />
            <PageHeader title='Payments' item='Skooltym' active_item='Payments' />
        </div>
    );
};
Payments.layout = "Contentlayout";
export default Payments;