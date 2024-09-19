import { SchoolClass } from '@/interfaces/ClassesModel';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const DeleteClass = ({ deleteModalShow, deleting, currentClass, setDeleteModalShow, handleSaveDelete }: { deleting: boolean; deleteModalShow: boolean; currentClass: SchoolClass | null; setDeleteModalShow: React.Dispatch<React.SetStateAction<boolean>>; handleSaveDelete: () => void }) => {
    return (
        <>
            <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentClass && (
                        <p>Are you sure you want to delete {currentClass?.class_name}?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={deleting} onClick={() => setDeleteModalShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" disabled={deleting} onClick={handleSaveDelete}>
                        {deleting ? `Deleting...` : `Delete`}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteClass;