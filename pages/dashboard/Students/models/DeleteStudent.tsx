import { StudentResult } from '@/interfaces/StudentsModel';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const DeleteStudent = ({ deleteModalShow, deleting, currentStudent, setDeleteModalShow, handleSaveDelete }: { deleting: boolean; deleteModalShow: boolean; currentStudent: StudentResult | null; setDeleteModalShow: React.Dispatch<React.SetStateAction<boolean>>; handleSaveDelete: () => void }) => {
    return (
        <>
            <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentStudent && (
                        <p>Are you sure you want to delete {currentStudent.student_fname} {currentStudent.student_lname}?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={deleting} onClick={() => setDeleteModalShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" disabled={deleting} onClick={handleSaveDelete}>
                        {deleting ? `Deleting...` : `Save Changes`}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteStudent;