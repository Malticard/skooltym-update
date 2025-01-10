import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';

interface AddPaymentProps {
    show: boolean;
    handleClose: () => void;
    amount: string;
    guardian: string;
    student: string;
    studentId: string;
    guardianId: string;
}

const AddPayment: React.FC<AddPaymentProps> = ({
    show,
    handleClose,
    amount,
    guardian,
    student,
    studentId,
    guardianId,
}) => {
    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        // school: "", // Replace with actual school ID
        // guardian: guardianId,
        // student: studentId,
        // payment_method: paymentMethod,
        // staff: "staff_id_placeholder", // Replace with actual staff ID
        // comment: "",
        // paid_amount: 0,
        // date_of_payment: new Date().toISOString().split("T")[0],
        // "payment_key[0]": "0",
    });

    const handlePayment = async (data: any) => {
        setIsAddingPayment(true);
        try {
            // const response = await axios.post('/api/addPayment', {
            //     school: "school_id_placeholder", // Replace with actual school ID
            //     guardian: guardianId,
            //     student: studentId,
            //     payment_method: paymentMethod,
            //     staff: "staff_id_placeholder", // Replace with actual staff ID
            //     comment: data.comment,
            //     paid_amount: data.paidAmount,
            //     date_of_payment: new Date().toISOString().split("T")[0],
            //     "payment_key[0]": "0",
            // });

            // if (response.status === 200 || response.status === 201) {
            //     alert("Added new payment successfully");
            //     handleClose();
            // } else {
            //     alert("Failed to add payment");
            // }
        } catch (error) {
            console.error("Error adding payment:", error);
            alert("An error occurred while adding the payment.");
        } finally {
            setIsAddingPayment(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(handlePayment)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount Owed</Form.Label>
                        <Form.Control type="text" value={`UGX ${amount}`} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Amount Paid</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount paid"
                            {...register('paidAmount', { required: "Amount Paid is required" })}
                            isInvalid={!!errors.paidAmount}
                        />
                        <Form.Control.Feedback type="invalid">
                            {/*  errors.paidAmount.message */}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="">Select Payment Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Comment">Comment</option>
                            <option value="Mobile Money">Comment</option>
                            <option value="Bank">Bank Card</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g school activities"
                            {...register('comment')}
                        />
                    </Form.Group>

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
