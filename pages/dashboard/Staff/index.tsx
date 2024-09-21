import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import { Col, Row } from 'react-bootstrap';
import Seo from '@/shared/layout-components/seo/seo';
import StaffDataTable from './StaffDatatable';
import { StaffResponse } from '@/interfaces/StaffModel';
import { fetchRoles, fetchStaff } from '@/utils/data_fetch';
import { Role } from '@/interfaces/RolesModel';
import LoaderComponent from '@/pages/components/LoaderComponent';
import useSWR from 'swr';

const Checkout = () => {
  const [addModalShow, setAddModalShow] = React.useState(false);

  // Fetch staff and roles data using SWR
  const { data: staff, error: staffError, isValidating: staffLoading, mutate: mutateStaff } = useSWR('fetchStaff', () => fetchStaff());
  const { data: roles, error: rolesError, isValidating: rolesLoading } = useSWR(['fetchRoles'], fetchRoles);
  // update data
  const updates = async () => {
    const newStaff = await fetchStaff();
    mutateStaff(newStaff, false); // Optimistically update staff data
  }
  // Handle page change for pagination
  const onChangePage = async (page: number) => {
    try {
      const newStaff = await fetchStaff(page);
      mutateStaff(newStaff, false); // Optimistically update staff data
    } catch (error) {
      console.error("Error fetching new staff data:", error);
    }
  };

  // If loading or error, show loader or error message
  if (staffLoading || rolesLoading) return <LoaderComponent />;
  if (staffError || rolesError) return <div>Error loading data</div>;

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
          {staff && (
            <StaffDataTable
              handleUpdates={updates}
              addModalShow={addModalShow}
              setAddModalShow={setAddModalShow}
              roles={roles || []}
              loadingClasses={false}  // This can be removed as it's no longer needed
              updatePage={onChangePage}
              staff={staff}
            />
          )}
        </Col>
      </Row>
      {/* End Row */}
    </>
  );
};

Checkout.layout = 'Contentlayout';

export default Checkout;
