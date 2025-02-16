import React from 'react';
import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import StaffDataTable from './StaffDatatable';
import { fetchRoles, fetchStaff } from '@/utils/data_fetch';
import useSWR from 'swr';
import Link from 'next/link';
import { exportStaff } from '@/utils/reports';

const Checkout = () => {
  const [addModalShow, setAddModalShow] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  // Fetch staff and roles data using SWR with automatic revalidation
  const { data: staff, error: staffError, isValidating: staffLoading, mutate: mutateStaff } = useSWR(
    "fetchStaff",
    async () => await fetchStaff(page, limit),
  );

  const { data: roles, error: rolesError, isValidating: rolesLoading } = useSWR(
    'fetchRoles',
    fetchRoles,

  );

  // Update data manually
  const updates = async () => {
    const newStaff = await fetchStaff(page, limit);
    mutateStaff(newStaff, false);
  };

  // Handle page change for pagination
  const onChangePage = async (newPage: number) => {
    setPage(newPage);
    const newStaff = await fetchStaff(page, limit);
    mutateStaff(newStaff);
  };

  const onChangeLimit = async (lm: number) => {
    setLimit(lm);
    const newStaff = await fetchStaff(page, limit);
    mutateStaff(newStaff);
  }

  // If loading or error, show loader or error message
  if (staffError || rolesError) return <div>Error loading data: {staffError?.message || rolesError?.message}</div>;

  return (
    <div className="my-2">
      <Seo title="Staff & Reports" />
      <PageHeader
        title={`Staff (${staff?.totalDocuments})`}
        link
        buttonText="Add Staff"
        onTap={() => setAddModalShow(true)}
        upload
        download
        onDownload={() => exportStaff()}
      >
        <li className='breadcrumb-item'><Link href="/dashboard">Dashboard</Link></li>
        <li className='breadcrumb-item active'>Staff Data</li>
      </PageHeader>
      {/* Row */}

      {staff && (
        <StaffDataTable
          loadingClasses={false}
          handleUpdates={updates}
          addModalShow={addModalShow}
          setAddModalShow={setAddModalShow}
          roles={roles || []}
          updatePage={onChangePage}
          updateLimit={onChangeLimit}
          staff={staff}
        />
      )}
      {/* End Row */}
    </div>
  );
};

Checkout.layout = 'Contentlayout';

export default Checkout;
