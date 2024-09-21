import LoaderComponent from '@/pages/components/LoaderComponent';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { fetchDropOffs } from '@/utils/data_fetch';
import DropOffDataTable from './DropOffDataTable';
import React from 'react';
import { DropoffRecordsResponse } from '@/interfaces/DropOff';

const DropOffs = () => {
    const [dropOffs, setDropOffs] = React.useState<DropoffRecordsResponse>({} as DropoffRecordsResponse);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        setLoading(!loading);
        fetchDropOffs().then((res) => {
            setLoading(false);
            setDropOffs(res);
        }).catch((err) => {
            setLoading(false);
            console.log(err);
        });
    }, []);
    // on change of page
    const onChangePage = (page: number) => {
        fetchDropOffs(page).then((res) => {
            setDropOffs(res);
        });
    }
    // on change on number of rows per page
    const onChangeRowsPerPage = (page: number, perPage: number) => {
        fetchDropOffs(page, perPage).then((res) => {
            setDropOffs(res);
        });
    }

    return (
        <>
            <Seo title="DropOffs" />
            <PageHeader title="Drop Offs" item="Skooltym" active_item="Drop Offs" />
            {
                loading ? (
                    <LoaderComponent />
                ) : dropOffs && (
                    <DropOffDataTable dropOffData={dropOffs} updatePage={onChangePage} />
                )
            }
        </>
    );
};
DropOffs.layout = "Contentlayout";
export default DropOffs;