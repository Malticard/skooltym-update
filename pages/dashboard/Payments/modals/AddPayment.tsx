import React, { useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { processPayment } from '@/utils/data_fetch';
import { AuthenticatedUserModel } from '@/interfaces/AuthenticatedUserModel';

interface AddPaymentProps {
    show: boolean;
    handleClose: () => void;
    amount: string;
    guardian: string;
    student: string;
    studentId: string;
    guardianId: string;
    user: AuthenticatedUserModel
}

const AddPayment: React.FC<AddPaymentProps> = ({
    show,
    handleClose,
    amount,
    guardian,
    student,
    studentId,
    guardianId, user
}) => {
    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [paidAmount, setPaidAmount] = useState("");
    const [paymentComment, setPaymentComment] = useState("");

    const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsAddingPayment(true);
        const formData = new FormData();
        formData.append('student', studentId);
        formData.append('school', user.school);
        formData.append('guardian', guardianId);
        formData.append('comment', paymentComment);
        formData.append('payment_method', paymentMethod);
        formData.append('staff', user.id);
        formData.append("paid_amount", paidAmount);
        formData.append("date_of_payment", new Date().toDateString());
        formData.append("payment_key[key]", "[0]");
        // console.log(f);
        processPayment(formData).then((res) => {
            setIsAddingPayment(false);
            window.location.reload();
        }).catch((err) => {
            console.log(err);
            setIsAddingPayment(false);
        })
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handlePayment}>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount Owed</Form.Label>
                        <Form.Control type="text" value={`UGX ${amount}`} readOnly />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Select
                            value={paymentMethod}
                            name='paid_amount'
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="">Select Payment Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Comment">Comment</option>
                        </Form.Select>
                    </Form.Group>

                    {paymentMethod === "Comment" && (
                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                type="text"
                                value={paymentComment}
                                name='comment'
                                onChange={(e) => setPaymentComment(e.target.value)}
                                placeholder="e.g school activities"
                            />
                        </Form.Group>
                    )}
                    {paymentMethod === "Cash" && (
                        <Form.Group className="mb-3">
                            <Form.Label>Amount Paid</Form.Label>
                            <Form.Control
                                type="number"
                                value={paidAmount}
                                placeholder="Enter amount paid"
                                onChange={e => setPaidAmount(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                            </Form.Control.Feedback>
                        </Form.Group>
                    )}


                    <Form.Group className="mb-3">
                        <Form.Label>Student</Form.Label>
                        <Form.Control type="text" value={student} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Guardian</Form.Label>
                        <Form.Control type="text" value={guardian} readOnly />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isAddingPayment}
                        className="w-100"
                    >
                        {isAddingPayment ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        ) : (
                            "Add Payment"
                        )}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddPayment;
