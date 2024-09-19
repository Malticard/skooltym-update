import { SchoolClass } from '@/interfaces/ClassesModel';
import { Stream } from '@/interfaces/StreamModel';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const DeleteClass = ({ deleteModalShow, deleting, currentStream, setDeleteModalShow, handleSaveDelete }: { deleting: boolean; deleteModalShow: boolean; currentStream: Stream | null; setDeleteModalShow: React.Dispatch<React.SetStateAction<boolean>>; handleSaveDelete: () => void }) => {
    return (
        <>
            <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Stream</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentStream && (
                        <p>Are you sure you want to delete {currentStream?.stream_name}?</p>
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