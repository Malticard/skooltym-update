
import Link from 'next/link';
import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { RiClockwise2Line, RiParentFill } from "react-icons/ri";
import { TbClockHour4 } from "react-icons/tb";
const DashCard = (props: { label: string; value: number; url: string; }) => {
    return (
        <Col sm={12} md={6} lg={6} xl={3}>
            <Link href={props.url}>
                <Card className="custom-card">
                    <Card.Body>
                        <div className="card-order">
                            <label className="main-content-label mb-2 pt-1">
                                {props.label}
                            </label>
                            <h2 className="text-end">
                                <div className='text-9xl w-10 h-10 flex justify-center items-center bg-primary rounded-full'>
                                    <TbClockHour4 size={20} className="float-start" />
                                </div>
                                <span className="fw-bold text-xl">Today: {props.value}</span>
                            </h2>
                            <div className="mb-0 mt-2 text-muted">
                                <b className="float-end">Records</b>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Link>
        </Col>


    );
};

export default DashCard;