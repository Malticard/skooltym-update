import { Guardian } from '@/interfaces/GuardiansModel';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const DeleteGuardian = ({ deleteModalShow, deleting, currentGuardian, setDeleteModalShow, handleSaveDelete }: { deleting: boolean; deleteModalShow: boolean; currentGuardian: Guardian | null; setDeleteModalShow: React.Dispatch<React.SetStateAction<boolean>>; handleSaveDelete: () => void }) => {
    return (
        <>
            <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Guardian</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentGuardian && (
                        <p>Are you sure you want to delete {currentGuardian?.guardian_fname} {currentGuardian?.guardian_lname}?</p>
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

export default DeleteGuardian;