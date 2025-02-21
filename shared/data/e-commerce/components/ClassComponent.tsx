import Link from 'next/link';
import React from 'react';
import { Col, Card } from 'react-bootstrap';

const ClassComponent = (props: { title: string; id: string; streams: number; students: number; }) => {
    return (
        <Col xxl={3} xl={6} md={12} sm={12}>
            <Link href={`/dashboard/${props.id}?class=${props.title}`}>
                <Card className="custom-card">
                    <Card.Header>
                        <Card.Title>{props.title}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex align-items-center"></div>
                    </Card.Body>
                    <Card.Footer>
                        <b className="mb-0 mt-2 text-muted">
                            {props.streams} Streams
                            <b className="float-end">{props.students} Students</b>
                        </b>
                    </Card.Footer>
                </Card>
            </Link>
        </Col>
    );
};
export default ClassComponent;