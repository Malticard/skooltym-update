
import Link from 'next/link';
import React from 'react';
import { Col, Card } from 'react-bootstrap';

const DashCard = (props: { label: string; value: number; url: string; }) => {
    return (
        <Col sm={12} md={6} lg={6} xl={3}>
            <Link href={props.url}>
                <Card className="custom-card">
                    <Card.Body>
                        <div className="card-order">
                            <label className="main-content-label mb-3 pt-1">
                                {props.label}
                            </label>
                            <h2 className="text-end">
                                <i className="mdi mdi-cart icon-size float-start text-primary"></i>
                                <span className="fw-bold">{props.value}</span>
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