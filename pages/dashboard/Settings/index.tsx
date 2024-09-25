import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import SettingsData from './SettingsData';
import { fetchSettings } from '@/utils/data_fetch';
import LoaderComponent from '@/pages/components/LoaderComponent';
import useSWR from 'swr';
import Snackbar from '../components/SnackBar';
// import { Snackbar } from '@mui/material';

const Settings = () => {
    const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false);

    // Use SWR to fetch settings
    const { data: settings, error, isValidating, mutate } = useSWR('settings', fetchSettings, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 0,
        dedupingInterval: 5000,
        onError: (err) => console.error('Error fetching roles:', err)
    });
    function update() {
        mutate();
        setIsSnackbarVisible(true);
        setTimeout(() => setIsSnackbarVisible(false), 3000);
    }
    // Handle loading and error states
    // if (isValidating) return <LoaderComponent />;
    if (error) return <div>Error loading settings: {error.message}</div>;

    return (
        <>
            <PageHeader title="Settings" item="Skooltym" active_item="Settings" />
            <Seo title="Settings" />
            {!isValidating ? settings && (<SettingsData handleUpdates={update} settings={settings} />) : <LoaderComponent />}
            {/* <Snackbar
                open={isSnackbarVisible}
                autoHideDuration={6000}
                dir='rtl'
                onClose={() => setIsSnackbarVisible(false)}
                message="Settings updated successfully"
            /> */}
            <Snackbar
                message="Settings saved successfully!"
                isVisible={isSnackbarVisible}
                onClose={() => setIsSnackbarVisible(false)}
            />
        </>
    );
};

Settings.layout = "Contentlayout";

export default Settings;
