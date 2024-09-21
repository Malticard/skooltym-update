import React from 'react'
import PageHeader from '@/shared/layout-components/page-header/page-header';
import { connect } from "react-redux"
import Seo from '@/shared/layout-components/seo/seo';
import SettingsData from './SettingsData';
import { fetchSettings } from '@/utils/data_fetch';
import { SettingsModel } from '@/interfaces/SettingsModel';
import LoaderComponent from '@/pages/components/LoaderComponent';
const Account = () => {
    const [settings, setSettings] = React.useState({} as SettingsModel);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        setLoading(true);
        fetchSettings().then((data) => {
            setSettings(data);
            setLoading(false);
        });
    }, []);
    return (
        <>
            <PageHeader title="Settings" item="Skooltym" active_item="Settings" />
            <Seo title="Settings" />
            {loading ? (<>
                <LoaderComponent />
            </>) : (<SettingsData settings={settings} />)}
        </>
    )
}

Account.layout = "Contentlayout"

const mapStateToProps = (state: string) => ({
    local_Products: state
})

export default connect(mapStateToProps)(Account)