import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { staffClocking } from '@/utils/clocking';
import useSWR from 'swr';
import React from 'react';
import StaffClockingDataTable from './StaffClockingtable';
import { StaffClockingResponse } from '@/interfaces/StaffClockingModel';
import { Row, Col } from 'react-bootstrap';
import LoaderComponent from '@/pages/components/LoaderComponent';

// Fetcher function to get staff clocking data
const fetchStaffClocking = () => staffClocking().then(res => res);

const StaffClockingPage = () => {
    // Using SWR with additional configuration for staff clocking data
    const { data: clockingData, error: clockingError, isValidating: isClockingLoading, mutate: mutateClockingData } = useSWR<StaffClockingResponse>(
        'fetchStaffClocking',
        fetchStaffClocking,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0,
            dedupingInterval: 5000, // Avoid re-fetching within 5 seconds
            onError: (err) => console.error('Error fetching staff clocking data:', err)
        }
    );

    // // Handle loading state
    // if (isClockingLoading && !clockingData) {
    //     return <div>Loading...</div>;
    // }

    // Handle error state
    if (clockingError) {
        return <div>Error loading staff clocking data</div>;
    }

    return (
        <>
            <Seo title="Staff Clocking" />
            <PageHeader
                title="Staff"
                item="Skooltym"
                active_item="Staff Clocking"
            />
            <Row>
                <Col xl={12}>
                    {
                        isClockingLoading ? <LoaderComponent /> : <StaffClockingDataTable
                            updatePage={(value: number): void => {
                                // Implement update page logic
                            }}
                            clockingData={clockingData}
                        />
                    }
                </Col>
            </Row>
        </>
    );
};

StaffClockingPage.layout = "Contentlayout";
export default StaffClockingPage;
