import React from 'react'
// import { Chart, CategoryScale } from 'chart.js/auto';
import { Col, Row } from "react-bootstrap";
import ClassComponent from './components/ClassComponent';
import DashCard from './components/DashCard';
import { fetchDashBoardData, fetchDashboardMetaData } from '@/utils/data_fetch';
import { DashboardItem } from '@/interfaces/DashboardItem';
import { Skeleton } from '@mui/material';
import { ClassDataModel } from '@/interfaces/ClassDataModel';
import { verifyToken } from '@/utils/auth';
import { StaffLogin } from '@/interfaces/StaffLogin';
import { isTokenValid } from '@/utils/verifyToken';


// Chart.register(
//   CategoryScale,
// );

const Dashboardecommerce = () => {
  // loader
  const [loading, setLoading] = React.useState<boolean>(false);
  // loading class data
  const [classLoading, setClassLoading] = React.useState<boolean>(false);
  // class data
  const [classData, setClassData] = React.useState<ClassDataModel[]>([]);
  // data handler
  const [data, setData] = React.useState<DashboardItem[]>([]);
  const user: StaffLogin = JSON.parse(localStorage.getItem('skooltym_user') as string)
  React.useEffect(() => {

    // check if user token is still valid
    const isValid = isTokenValid(user._token);
    // fetch dashcards data
    setLoading(true);
    fetchDashboardMetaData().then((data) => {
      setData(data);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    });
    // fetch classes data
    setClassLoading(true);
    fetchDashBoardData().then((res) => {
      setClassLoading(false);
      setClassData(res);
    }).catch((err) => {
      setClassLoading(false);
      console.log(err);
    });
  }, []);
  return (
    <div>
      <Row className="row-sm">
        {
          loading ? Array.from({ length: 4 }).map((x, index) => (
            <Col sm={12} md={6} lg={6} xl={3}>
              <Skeleton
                key={index}
                className='mx-4'
                variant="rounded"
                width={260}
                height={140}
              />
            </Col>

          )) : data.map((item, index) => (<DashCard key={index} label={item.label} value={item.value} url={item.page} />))
        }

      </Row>
      {user.role == 'Admin' ? (
        <>
          <p className='main-content-title fs-24 mb-4 mt-2'>
            Classes Summary
          </p>
          <Row className="row-lg">
            {
              classLoading ? Array.from({ length: 10 }).map((x, index) => (<Skeleton key={index} width={200} height={150} variant="rounded" />)) : classData.map((x, index) => (<ClassComponent key={index} title={x.class_name} streams={x.class_streams.length} students={x.class_students.length} />))
            }
          </Row>
        </>
      ) : (<></>)}

    </div>
  )
}

export default Dashboardecommerce