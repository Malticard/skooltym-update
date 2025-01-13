import { Staff } from '@/interfaces/StaffModel';
import Link from 'next/link';
import React from 'react';
import { Card, Modal, Row, Col, Button, Container } from 'react-bootstrap';

interface StaffDetailsComponentIF {
    staff: Staff | null;
    showStaffDetails: boolean;
    setStaffDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const StaffDetailsComponent: React.FC<StaffDetailsComponentIF> = ({
    staff,
    setStaffDetails,
    showStaffDetails,
}) => {
    return (
        <Modal
            show={showStaffDetails}
            onHide={() => setStaffDetails(false)}
            size="lg"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {staff ? `${staff.staff_fname} ${staff.staff_lname}'s Details` : 'Staff Details'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="gy-4">
                        {/* Staff Overtime */}
                        <Col xs={12} md={6}>
                            <Card className=" shadow-sm">
                                <Card.Body>
                                    <Card.Title className="text-primary">Staff Overtime</Card.Title>
                                    <Card.Text>
                                        View overtime records for{' '}
                                        <strong>{staff?.staff_fname || 'the staff'}</strong>.
                                    </Card.Text>
                                    <Link href={`/dashboard/Staff/Overtime/${staff?._id}`}>
                                        <Button
                                            variant="outline-primary"
                                            className="w-100"
                                        >
                                            View Overtime
                                        </Button>
                                    </Link>

                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Staff Late Data */}
                        <Col xs={12} md={6}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="text-danger">Staff Late</Card.Title>
                                    <Card.Text>
                                        View late attendance records for{' '}
                                        <strong>{staff?.staff_fname || 'the staff'}</strong>.
                                    </Card.Text>
                                    <Link href={`/dashboard/Staff/Late/${staff?._id}`}>
                                        <Button

                                            variant="outline-danger"
                                            className="w-100"
                                        >
                                            View Late Records
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setStaffDetails(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StaffDetailsComponent;
