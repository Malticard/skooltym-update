// Date: 07/20/21
import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap'

export default function DropOffDateModal({ open, title, children, setOpen, onTap }: { open: boolean, children: React.ReactNode; onTap: () => void; title: string; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    return (
        <Modal show={open}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            {children}
            <Modal.Footer>
                <Row xxl={2}>
                    <Col>
                        <Button variant='secondary' onClick={() => setOpen(false)}>Close</Button>
                    </Col>
                    <Col>
                        <Button variant='primary' onClick={onTap}>Save</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
}
