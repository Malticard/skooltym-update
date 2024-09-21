import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchPickUps } from '@/utils/data_fetch';
import React from 'react';
import PickUpDataTable from './PickUpDataTable';
import LoaderComponent from '@/pages/components/LoaderComponent';

const PickUps = () => {
    const [pickUp, setPickUp] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        setLoading(true);
        // fetch data
        fetchPickUps().then((res) => {
            setLoading(false);
            setPickUp(res);
            console.log(res);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        })
    }, []);
    // on change of page
    const onChangePage = (page: number) => {
        fetchPickUps(page).then((res) => {
            setPickUp(res);
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }
    return (
        <>
            <Seo title="PickUps" />
            <PageHeader title="PickUps" item="Skooltym" active_item="PickUps" />
            {
                loading ? (
                    <LoaderComponent />
                ) : pickUp && (
                    <PickUpDataTable pickUpData={pickUp} updatePage={onChangePage} />
                )
            }
        </>
    );
};
PickUps.layout = "Contentlayout";
export default PickUps;