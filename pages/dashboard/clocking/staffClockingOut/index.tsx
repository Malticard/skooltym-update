import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { staffClockingOut } from '@/utils/clocking';
import useSWR from 'swr';
import React from 'react';
import StaffClockingOutDataTable from './StaffClockingOuttable';
import { StaffClockingResponse } from '@/interfaces/StaffClockingModel';
import { Row, Col } from 'react-bootstrap';
import LoaderComponent from '@/pages/components/LoaderComponent';

// Fetcher function to get staff clocking data
const fetchStaffClocking = () => staffClockingOut().then(res => res);

const StaffClockingPage = () => {
    // Using SWR with automatic revalidation for staff clocking data
    const { data: clockingData, error: clockingError, isValidating: isClockingLoading, mutate: mutateClockingData } = useSWR<StaffClockingResponse>(
        'fetchStaffClocking',
        fetchStaffClocking,
        {
            // revalidateOnFocus: false,
            // revalidateOnReconnect: false,
            // refreshInterval: 0,
            // dedupingInterval: 0, // 5 
            onError: (err) => console.error('Error fetching staff clocking data:', err)
        }
    );
    // if (isClockingLoading) {
    //     return <LoaderComponent />;
    // }

    // Handle error state
    if (clockingError) {
        return <div>Error loading staff clocking data</div>;
    }
    // function to handle mutating staff clocking
    const handleChange = async (page: number) => {
        const clock = await staffClockingOut(page)
        mutateClockingData(clock)
    }

    return (
        <>
            <Seo title="Staff Clocking Out" />
            <PageHeader
                title="Staff"
                item="Skooltym"
                active_item="Staff Clocking Out"
            />
            <Row>
                <Col xl={12}>
                    {
                        clockingData && (
                            <StaffClockingOutDataTable
                                updatePage={handleChange}
                                clockingData={clockingData}
                            />
                        )
                    }
                </Col>
            </Row>
        </>
    );
};

StaffClockingPage.layout = "Contentlayout";
export default StaffClockingPage;
