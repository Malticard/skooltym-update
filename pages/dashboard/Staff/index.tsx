import React from 'react'
import PageHeader from '@/shared/layout-components/page-header/page-header'
import { Card, Col, Row } from "react-bootstrap";
import Seo from '@/shared/layout-components/seo/seo';
import { StaffDataTable } from './StaffDatatable';
import { StaffResponse } from '@/interfaces/StaffModel';
import { fetchRoles, fetchStaff } from '@/utils/data_fetch';
import { RolesResponse } from '@/interfaces/RolesModel';
import { IconLoader } from '@/public/assets/icon-fonts/tabler-icons/icons-react';

const Checkout = () => {
  const [staff, setStaff] = React.useState<StaffResponse>(null as unknown as StaffResponse);
  const [roles, setRoles] = React.useState<RolesResponse>(null as unknown as RolesResponse);
  const [loadingData, setLoadingData] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [addModalShow, setAddModalShow] = React.useState(false);
  React.useEffect(() => {
    // fetch staff data
    fetchStaff().then((data) => {
      setStaff(data);
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    });
    // roles
    fetchRoles().then((data) => {
      console.log(data);
      setRoles(data);
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }, []);
  // methods for change of page
  const onChangePage = (page: number) => {
    // setLoading(true);
    fetchStaff(page).then((res) => {
      setStaff(res);
      console.log(res);
      // setLoading(false);
    }).catch((error) => {
      // setLoading(false);
      console.log(error);
    })
  }
  return (
    <>
      <Seo title="Staff" />

      <PageHeader
        title="Staff"
        item="Skooltym"
        active_item="Staff"
        buttonText="Add Staff"
        onTap={() => {
          setAddModalShow(true);
        }}
      />

      {/* <!-- Row --> */}
      <Row>
        <Col xl={12}>
          {loading ? (<><IconLoader /></>) : staff && (<StaffDataTable addModalShow={addModalShow} setAddModalShow={setAddModalShow} roles={roles} loadingClasses={false} updatePage={onChangePage} staff={staff} />)}
        </Col>
      </Row>
      {/* <!-- End Row --> */}
    </>
  )
}

Checkout.layout = "Contentlayout"


export default Checkout