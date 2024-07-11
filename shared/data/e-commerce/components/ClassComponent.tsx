import React from 'react';
import { Col, Card } from 'react-bootstrap';

const ClassComponent = (props: { title: string; streams: string; students: string; }) => {
    return (
        <Col xxl={3} xl={6} md={12} sm={12}>
            <Card className="custom-card">
                <Card.Header>
                    <Card.Title>{props.title}</Card.Title>
                </Card.Header>
                <Card.Body>
                </Card.Body>
                <Card.Footer>
                    <b className="mb-0 mt-2 text-muted">
                        {props.streams} Streams
                        <b className="float-end">{props.students} Students</b>
                    </b>
                </Card.Footer>
            </Card>
        </Col>
    );
};

export default ClassComponent;