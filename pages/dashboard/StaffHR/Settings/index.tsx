import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
// import SettingsData from '../Settings/SettingsData';
import { fetchStaffSettings } from '@/utils/data_fetch';
import LoaderComponent from '@/pages/components/LoaderComponent';
import useSWR from 'swr';
import Snackbar from '../../components/SnackBar';
import SettingsSection from './SettingsSection';
// import { Snackbar } from '@mui/material';

const Settings = () => {
    const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false);

    // Use SWR to fetch settings
    const { data: settings, error, isValidating, mutate } = useSWR('staffSettings', fetchStaffSettings, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        dedupingInterval: 5000,
        onError: (err) => console.error('Error fetching roles:', err)
    });

    React.useEffect(() => {
        // if (error) {
        console.log("staff settings");
        // }
    }, []);
    function update() {
        mutate();
        setIsSnackbarVisible(true);
    }
    // Handle loading and error states
    if (error) return <div className='p-3 mx-auto bg-danger rounded-md'>Error loading settings: {error.message}</div>;
    return (
        <>
            <PageHeader title="Staff Clocking Settings" item="Skooltym" active_item="Staff Settings" />
            <Seo title="Staff Settings" />
            {isValidating ? <LoaderComponent /> : settings && (<SettingsSection handleUpdates={update} settings={settings} />)}
        </>
    );
};

Settings.layout = "Contentlayout";

export default Settings;
