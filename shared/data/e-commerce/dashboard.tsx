import React from 'react'
// import { Chart, CategoryScale } from 'chart.js/auto';
import { Row } from "react-bootstrap";
import ClassComponent from './components/ClassComponent';
import DashCard from './components/DashCard';
import { useRouter } from 'next/navigation';


// Chart.register(
//   CategoryScale,
// );

const Dashboardecommerce = () => {

  return (
    <div>
      <Row className="row-sm">
        {
          Array.from({ length: 4 }).map((x, index) => (
            <DashCard key={index} label={''} value={0} url={''} />
          ))
        }

      </Row>
      <p className='main-content-title fs-24 mb-4 mt-2'>
        Classes Summary
      </p>
      <Row className="row-lg">
        {
          Array.from({ length: 10 }).map((x, index) => (<ClassComponent key={index} title={`S ${index + 1}`} streams={'0'} students={'0'} />))
        }
      </Row>

    </div>
  )
}

export default Dashboardecommerce