import React from 'react'
import { Col, Row } from "react-bootstrap";
import ClassComponent from './components/ClassComponent';
import DashCard from './components/DashCard';
import { fetchDashBoardClasses, fetchDashboardMetaData } from '@/utils/data_fetch';
import { Skeleton } from '@mui/material';
import { StaffLogin } from '@/interfaces/StaffLogin';
import useSWR from 'swr';


const Dashboardecommerce = () => {

  const user: StaffLogin = JSON.parse(localStorage.getItem('skooltym_user') as string)
  const { data, isLoading: dashDataLoading } = useSWR("DashboardData", async () => fetchDashboardMetaData())
  const { data: classData, isLoading: classLoading } = useSWR("ClassData", async () => fetchDashBoardClasses());
  return (
    <div>
      <Row className="row-sm">
        {
          dashDataLoading ? Array.from({ length: 8 }).map((x, index) => (
            <Col sm={12} md={6} lg={6} xl={3}>
              <Skeleton
                key={index}
                className='m-2 rounded-2xl'
                variant="rounded"
                width={290}
                height={190}
              />
            </Col>

          )) : data && data.map((item, index) => (<DashCard key={index} label={item?.label} value={item.value} url={item.page} />))
        }

      </Row>
      {user.role == 'Admin' ? (
        <>
          <p className='main-content-title fs-24 mb-4 mt-2'>
            Classes Summary
          </p>
          <Row className="row-lg">
            {
              classLoading ? Array.from({ length: 10 }).map((x, index) => (<Skeleton key={index} width={250} className='m-2' height={150} variant="rounded" />)) : classData && classData.map((x, index) => (<ClassComponent key={index} id={x.class_id} title={x.class_name} streams={x.class_streams} students={x.class_students.length} />))
            }
          </Row>

        </>
      ) : (<></>)}

    </div>
  )
}

export default Dashboardecommerce