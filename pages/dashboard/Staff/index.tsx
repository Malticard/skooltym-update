import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import { Col, Row } from 'react-bootstrap';
import Seo from '@/shared/layout-components/seo/seo';
import StaffDataTable from './StaffDatatable';
import { fetchRoles, fetchStaff } from '@/utils/data_fetch';
import LoaderComponent from '@/pages/components/LoaderComponent';
import useSWR from 'swr';

const Checkout = () => {
  const [addModalShow, setAddModalShow] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  // Fetch staff and roles data using SWR with automatic revalidation
  const { data: staff, error: staffError, isValidating: staffLoading, mutate: mutateStaff } = useSWR(
    'fetchStaff',
    () => fetchStaff(),
    {
      revalidateOnFocus: true, // Revalidate when window gets focus
      revalidateOnReconnect: true, // Revalidate when reconnecting
      refreshInterval: 10000, // Poll every 10 seconds
      dedupingInterval: 5000, // Deduplicate requests for 5 seconds
      onError: (err) => console.error('Error fetching staff:', err)
    }
  );

  const { data: roles, error: rolesError, isValidating: rolesLoading } = useSWR(
    'fetchRoles',
    fetchRoles,
    {
      revalidateOnFocus: true, // Revalidate when window gets focus
      revalidateOnReconnect: true, // Revalidate when reconnecting
      refreshInterval: 10000, // Poll every 10 seconds
      dedupingInterval: 5000, // Deduplicate requests for 5 seconds
      onError: (err) => console.error('Error fetching roles:', err)
    }
  );

  // Update data manually
  const updates = async () => {
    setIsUploading(true);
    try {
      const newStaff = await fetchStaff();
      mutateStaff(newStaff, false);
    } catch (error) {
      console.error("Error updating staff data:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle page change for pagination
  const onChangePage = async (page: number) => {
    try {
      const newStaff = await fetchStaff(page);
      mutateStaff(newStaff, false);
    } catch (error) {
      console.error("Error fetching new staff data:", error);
    }
  };

  // If loading or error, show loader or error message
  if (staffError || rolesError) return <div>Error loading data: {staffError?.message || rolesError?.message}</div>;

  return (
    <>
      <Seo title="Staff" />
      <PageHeader
        title="Staff"
        item="Skooltym"
        active_item="Staff"
        buttonText="Add Staff"
        onTap={() => setAddModalShow(true)}
      />
      {/* Row */}
      <Row>
        <Col xl={12}>
          {staffLoading === false ? staff && (
            <StaffDataTable
              loadingClasses={isUploading}
              handleUpdates={updates}
              addModalShow={addModalShow}
              setAddModalShow={setAddModalShow}
              roles={roles || []}
              updatePage={onChangePage}
              staff={staff}
            />
          ) : (
            <LoaderComponent />
          )}
        </Col>
      </Row>
      {/* End Row */}
    </>
  );
};

Checkout.layout = 'Contentlayout';

export default Checkout;
